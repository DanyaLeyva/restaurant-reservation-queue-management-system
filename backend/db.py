# backend/db.py
# Owner: Eduardo Salvador
# Handles the connection between Flask and MySQL

# Database tables:
# restaurant_tables
# reservations
# waitlist_entries

import os
from pathlib import Path
import pyodbc
from dotenv import load_dotenv
from contextlib import closing

from allocation import find_available_table

#Find .env beside this db.py file
load_dotenv(Path(__file__).resolve().parent / ".env")

class NoAvailableTable(Exception):
    pass

def get_connection():
    connection_string= os.getenv("AZURE_SQL_CONNECTIONSTRING")

    if not connection_string:
        raise RuntimeError("AZURE_SQL_CONNECTIONSTRING is missing from backend/.env")

    return pyodbc.connect(connection_string, timeout=30)

def save_guest_reservation(
    customer_name,
    customer_phone,
    party_size,
    reservation_time,
    ):
    with closing(get_connection()) as connection:
        connection.autocommit = False

        try:
            with closing(connection.cursor()) as cursor:

                cursor.execute(
                    """
                    SELECT tableID, capacitySize
                    FROM dbo.restaurant_tables WITH (TABLOCK, HOLDLOCK)
                    WHERE capacitySize  >= ?
                        AND status_quo = 0
                    """,
                    (party_size,),
                )

                tables= [
                    {
                        "table_id": row[0],
                        "capacity": row[1],
                        "status": "available",
                    }
                    for row in cursor.fetchall()
                ]

                selected = find_available_table(tables, party_size)

                if selected is None: 
                    raise NoAvailableTable(
                        "No suitable table is currently available."
                    )
                
                table_id=selected["table_id"]

                cursor.execute(
                    """
                    UPDATE dbo.restaurant_tables
                    SET status_quo = 1
                    WHERE tableID = ?
                        AND status_quo = 0
                    """,
                    (table_id,),
                )

                if  cursor.rowcount != 1:
                    raise NoAvailableTable(
                        "That table is no longer available."
                    )
                
                
                cursor.execute(
                    """
                    SELECT TOP (1) customerID
                    FROM dbo.customer
                    WHERE Name = ? AND Phone = ?
                    ORDER BY customerID
                    """,
                    (customer_name, customer_phone),
                )

                customer = cursor.fetchone()

                if customer:
                    customer_id = customer[0]
                else :
                    cursor.execute(
                        """ 
                        INSERT INTO dbo.customer (Name, Phone)
                        OUTPUT INSERTED.customerID
                        VALUES (?,?)
                        """,
                        (customer_name, customer_phone)
                    )

                    customer_id = cursor.fetchone()[0]

                cursor.execute(
                    """
                    INSERT INTO dbo.reservation (
                    customerID,
                    partySize,
                    reservation_time,
                    tableID
                )
                OUTPUT INSERTED.reservationID
                VALUES (?, ?, ?, ?)    
                """,
                    (customer_id,
                    party_size,
                    reservation_time,
                    table_id,),
                )

                reservation_id=cursor.fetchone()[0]

            connection.commit()
            return {
                "reservation_id" : reservation_id,
                "table_id" :table_id,
            }
        except Exception:
            connection.rollback()
            raise



# TODO (Eduardo): create a function that opens and returns
# a database connection

# Important: do not put the MySQL password directly in this file.

#You need to install a extension called MySQL DataBase on VSCODE
#Once you have insalled MySQL, look at the left side of your tool bar and look for a cyclinadr shape container
#It should be called DataBase, and click on add connection
# Under Server Type, Hover over the more option and click on Azure SQL server
# Enter the following information
# Host = library-sql-db-1.database.windows.net
#Auth Type = SQL Server Auth
#Username = Ben
#Database = LibraryDB
#PS: <CSC481>
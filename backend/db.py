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

#Find .env beside this db.py file
load_dotenv(Path(__file__).resolve().parent / ".env")

def get_connection():
    connection_string= os.getenv("AZURE_SQL_CONNECTIONSTRING")

    if not connection_string:
        raise RuntimeError("AZURE_SQL_CONNECTIONSTRING is missing from backend/.env")

    return pyodbc.connect(connection_string, timeout=10)

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
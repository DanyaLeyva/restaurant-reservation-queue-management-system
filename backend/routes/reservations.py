# backend/routes/reservations.py
# Owner: Kristopher Ryan Manalang
# Handles customer reservations
# REQUIRED LIBRARIES: flask, mysql.connector, and os (os is not required to download, comes with Python Standard Library)

from contextlib import closing

from flask import Blueprint, request, jsonify, current_app #Eduardo, I add the current_app class
from db import get_connection

from datetime import datetime
import re
import pyodbc

from allocation import find_available_table  #Eduardo
from db import save_guest_reservation, NoAvailableTable        #Eduardo 

import os

reservations_bp = Blueprint("reservations", __name__)

# Use these exact field names:
# reservation_id, customer_name, customer_phone, party_size,
# reservation_time, status, table_id, created_at

# Reservation status values:
# confirmed, cancelled

# TODO (Kristopher): Create a new reservation
# POST /api/reservations
# Uses: customer_name, customer_phone, party_size, reservation_time
# New reservations should have the status "confirmed"

# Create route, accept POST requests to send data
@reservations_bp.route("/api/reservations", methods = ["POST"])

def create_reservation():
    # Get reservation information from HTTP request/frontend (ex. customer fills out information)
    data = request.get_json(silent=True)

    # Error: We obtain invalid JSON data
    if not isinstance(data, dict):
        return jsonify({"error" : "Invalid JSON data"}), 400

    # Access information by key + validate
    # a. customer name
    customer_name = data.get("customer_name") # Using this format to avoid KeyError if key does not exist

    # Validate customer_name (must be type str, not empty)
    if (type(customer_name) is not str or not customer_name.strip()): # empty string considered falsy, use .strip() so we can also prevent "   " strings from being accepted ("".strip() evaluates to false)
        return jsonify({"error" : "Invalid name"}), 400

    # b. customer phone
    # for customer phone, it is stored as (xxx) xxx-xxxx. 
    customer_phone = data.get("customer_phone")

    # validate customer_phone (must be type str, not empty.)
    if (type(customer_phone) is not str or not customer_phone.strip()):
        return jsonify({"error" : "Invalid phone number"}), 400

    phone_number_translation_table = str.maketrans({"(" : "", 
                                                    ")" : "",
                                                    "-" : "",
                                                    " " : ""}) # translation table to convert [(, ), -, " "] to empty ""
    
    customer_phone = customer_phone.strip().translate(phone_number_translation_table) # remove [(, ), -, " "] to make a standardized phone number string with only 10 digits from 0-9

    # validate customer_phone (must be str size 10, and the str must be digits)
    if (len(customer_phone) != 10 or not customer_phone.isdigit() or not customer_phone.isascii()):
        return jsonify({"error" : "Invalid phone number"}), 400

    # c. party size                                                             # ADJUST: party size max needs to be defined at some point
    party_size = data.get("party_size")

    # Validate party_size (must be type int and at least of size 1)
    if (type(party_size) is not int or party_size < 1):
        return jsonify({"error" : "Party Size must be an integer from 1 to 8"}), 400

    # d. reservation time
    time_text = data.get("reservation_time")

    # Validate reservation_time (must be type str or not empty)                 # IMPROVE THIS: we still can accept any nonempty string, so use isoformat
    try:
        if not isinstance(time_text,str):
            raise ValueError

        reservation_time = datetime.strptime(time_text,"%Y-%m-%dT%H:%M",)
    except ValueError:
        return jsonify({
            "error" : "Choose a vaild reservation data and time"
        }), 400

    if reservation_time <= datetime.now():
        return jsonify({
            "error" : "Choose a future reservation time"
        }), 400

    try:
        booking = save_guest_reservation(
        customer_name.strip(),
        customer_phone,
        party_size,
        reservation_time,
        )

    except NoAvailableTable as error:
        return jsonify({"error" : str(error)}), 409

    except pyodbc.Error:
        current_app.logger.exception(
            "Azure SQL rservation operation failed."
        )
        return jsonify({
            "error" : "Database Error, Check Flask terminal"
        }), 500

    return jsonify({
        "message" : "Reservation has been made.",
        "reservation_id" : booking["reservation_id"],
        "table_id" : booking["table_id"],
    }), 201

@reservations_bp.route("/api/reservations/lookup", methods=["GET"],)
def loopkup_reservation():
    phone=request.args.get("customer_phone", "")

    phone = re.sub(r"[()\s-]","",phone)

    if re.fullmatch(r"[0-9]{10}", phone) is None:
        return jsonify({
            "error" : "Enter a vaild 10-digit phone number."
    }), 400

    try:
        with closing(get_connection()) as connection:
            with closing(connection.cursor()) as cursor:
                    cursor.execute(
                        """
                        SELECT
                            r.reservationID,
                            r.partySize,
                            r.reservation_time,
                            r.tableID
                        FROM dbo.reservation AS r
                        JOIN dbo.customer AS c
                            on c.customerID = r.customerID
                        WHERE c.Phone = ?
                        ORDER BY r.reservation_time DESC
                        """,
                        (phone,),                        
                        )
                    rows=cursor.fetchall()
        reservations = [{
            "reservation_id" : row[0],
            "party_size": row[1],
            "reservation_time" : row[2].isoformat(
                timespec = "minutes"
            ),
            "table_id": row[3],
        }
        for row in rows
        ]

        return jsonify({
            "message" : (
                "Reservation Found."
            if reservations
            else "No reservations found for that phone number"
            ),
            "reservations" : reservations,
        }),200
    except pyodbc.Error:
        current_app.logger.exception(
            "Reservation lookup failed"
        )

        return jsonify({
            "error" : "Unable to lool up reservations."
        }),500

# TODO (Kristopher): View all reservations
# GET /api/staff/reservations
@reservations_bp.route("/api/staff/reservations", methods = ["GET"])

def get_all_reservations():
    try:
        with closing(get_connection()) as connection:
            with closing(connection.cursor()) as cursor:
                cursor.execute(
                    """
                    SELECT
                        r.reservationID,
                        c.name,
                        c.Phone,
                        r.partySize,
                        r.reservation_time,
                        r.tableID
                    FROM dbo.reservation AS r
                    JOIN dbo.customer AS c
                        on c.customerID = r.customerID
                    ORDER BY r.reservationID DESC
                    """
                )

                rows = cursor.fetchall()

        reservations = [
            {
                "reservation_id" : row[0],
                "customer_name": row[1],
                "customer_phone": row[2],
                "party_size": row[3],
                "reservation_time": row[4].isoformat(
                    timespec="minutes"
                ),
                "table_id": row[5],
            }
            for row in rows
        ]

        response = jsonify({"reservations" : reservations})
        response.headers["Cache-Control"] = "no=store"
        return response,200
    
    except pyodbc.Error:
        current_app.logger.exception(
            "Unable to load staff reservations"
        )

        return jsonify({
            "error" : "Unable to load reservations"
        }), 500

# TODO (Kristopher): Cancel a reservation
# PATCH /api/reservations/<reservation_id>/cancel
# Change the reservation status to "cancelled"
@reservations_bp.route("/api/reservations/<int:reservation_id>/cancel", methods = ["PATCH"])
def cancel_reservation(reservation_id):
    # Connect to MySQL database
    connection = mysql.connector.connect(
                 host = os.environ["DB_HOST"],
                 user = os.environ["DB_USER"],
                 password = os.environ["DB_PASSWORD"],
                 database = "restauranttest"
                 )
        
    # Allow SQL commands to execute via an existing connection
    cursor = connection.cursor(dictionary = True)

    # Query to look at if the reservation exists
    exist_check_query = """
                        select status
                        from reservations
                        where reservation_id = %s
                        """

    cursor.execute(exist_check_query, (reservation_id, ))
    reservation = cursor.fetchone()

    if reservation is None: # check if reservation exists first
        cursor.close()
        connection.close()
        return jsonify({"error" : "Reservation does not exist."}), 404
    
    if reservation["status"] == "cancelled": # check if reservation has already been cancelled
        cursor.close()
        connection.close()
        return jsonify({"message" : "Reservation has already been cancelled."}), 200

    # Query to update the reservation identified by the id, and checked earlier to be confirmed
    query = """
            UPDATE reservations
            SET status = %s 
            WHERE reservation_id = %s
            AND status = %s
            """

    # Execute query to perform updates, and commit update
    cursor.execute(query, ("cancelled", reservation_id, "confirmed")) # counts only those it changed, not the total observations that have status "cancelled"
    connection.commit()

    # Close cursor and connections
    cursor.close()
    connection.close()

    return jsonify({"message" : "Reservation has successfully been cancelled"}), 200
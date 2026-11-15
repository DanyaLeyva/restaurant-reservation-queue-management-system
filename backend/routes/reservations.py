# backend/routes/reservations.py
# Owner: Kristopher Ryan Manalang
# Handles customer reservations

from flask import Blueprint, request, jsonify
import mysql.connector
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
    data = request.get_json()

    # Error: We obtain invalid JSON data
    if not isinstance(data, dict):
        return jsonify({"error" : "Invalid JSON data"}), 400

    # Access information by key
    customer_name = data.get("customer_name") # Using this format to avoid KeyError if key does not exist
    customer_phone = data.get("customer_phone")
    party_size = data.get("party_size")
    reservation_time = data.get("reservation_time")

    # DATA VALIDATIONS
    # a. Validate customer_name
    if (type(customer_name) is not str or not customer_name.strip()): # empty string considered falsy, use .strip so we can also prevent "   " strings from being accepted
        return jsonify({"error" : "Invalid name"}), 400

    # b. Validate customer_phone (must be type str, not empty)
    if (type(customer_phone) is not str or not customer_phone.strip()):
        return jsonify({"error" : "Invalid phone number"}), 400

    # c. Validate party_size (must be type int and at least of size 1)
    if (type(party_size) is not int or party_size < 1):
        return jsonify({"error" : "Invalid party size"}), 400

    # d. Validate reservation_time (must be type str or not empty) # IMPROVE THIS: we still can accept any nonempty string, so use isoformat
    if (type(reservation_time) is not str or not reservation_time.strip()): 
        return jsonify({"error" : "Invalid reservation time"}), 400

    # Once all checks pass, the reservation can be confirmed
    status = "confirmed"

    # Manipulating MySQL Database
    # Establish communication with Python and mySQL database
    connection = mysql.connector.connect(
        host = os.environ["DB_HOST"],
        user = os.environ["DB_USER"],
        password = os.environ["DB_PASSWORD"],
        database = "restauranttest"
    )

    # Allow SQL commands to execute via an existing connection / get results
    cursor = connection.cursor()

    # Making query for customer table 
    # First, check if the customer already exists in the database
    customer_query = """ SELECT customer_id
                         FROM customer
                         WHERE customer_name = %s
                         AND customer_phone_number = %s
                     """

    customer_info = (customer_name, customer_phone)
    cursor.execute(customer_query, customer_info) # Search the MySQL customer database for 
    customer_exists = cursor.fetchone() # Obtain the matching customer if they exist

    if customer_exists:
        customer_id = customer_exists[0]
    else: # The customer does not exist in the database, add them
        customer_query = """INSERT INTO customer
                            (customer_name, customer_phone)
                            VALUES (%s, %s)    
                         """
        cursor.execute(customer_query, customer_info)
        customer_id = cursor.lastrowid

    # Making query for reservations table
    reservations_query = """ INSERT INTO reservations
                             (customer_id, party_size, reservation_time, created_at, status) 
                             VALUES (%s, %s, %s, CURRENT_TIMESTAMP, %s)
                         """

    reservations_info = (customer_id, party_size, reservation_time, status) # check MySQL reservations database, does not look like it has status
    cursor.execute(reservations_query, reservations_info) # Save into MySQL database for reservations
    reservation_id = cursor.lastrowid # Get reservation_id from database

    # Confirm and commit changes to MySQL database
    connection.commit()
    cursor.close()
    connection.close()

    # Confirm reservation and send back to frontend
    response = {"message" : "Reservation has been made.",
                "reservation_id" : reservation_id,
                "status" : status
               }

    return jsonify(response), 201

# TODO (Kristopher): View all reservations
# GET /api/reservations
@reservations_bp.route("/api/reservations", methods = ["GET"])

def view_all_reservations():
    # Connect to MySQL database
    connection = mysql.connector.connect(
            host = os.environ["DB_HOST"],
            user = os.environ["DB_USER"],
            password = os.environ["DB_PASSWORD"],
            database = "restauranttest"
        )
    cursor = connection.cursor(dictionary = True) # Get results from query as a dictionary
    
    # From reservations database, obtain all reservation information
    query = "SELECT * FROM reservations"

    cursor.execute(query) # execute the query

    # Grab the reservation records / results of cursor execution of query
    reservation_list = cursor.fetchall()
    cursor.close()
    connection.close()

    return jsonify({"message" : "Reservation List",
                    "reservations" : reservation_list}), 200

# TODO (Kristopher): View reservations for one customer
# GET /api/reservations?customer_phone=...
@reservations_bp.route("/api/reservations", methods = ["GET"])

def view_customer_reservation():

    # Obtain customer's phone number from the url
    customer_phone = request.args.get("customer_phone")

    # Connect to MySQL database
    connection = mysql.connector.connect(
                 host = os.environ["DB_HOST"],
                 user = os.environ["DB_USER"],
                 password = os.environ["DB_PASSWORD"],
                 database = "restauranttest"
                 )
    
    # Allow SQL commands to execute via an existing connection
    cursor = connection.cursor()

    # Make a query that searches for the customer id based on customer phone number
    customer_query = """
                     SELECT customer_id
                     FROM customer
                     WHERE customer_phone_number = %s
                     """

    cursor.execute(customer_query, (customer_phone,))

    customer = cursor.fetchone() # grab the customer from the database, should return a tuple (ex. (5,))
    if customer:
        customer_id = customer[0] # extract id from tuple
    elif customer is None:
        cursor.close()
        connection.close()
        return jsonify({"error" : "Customer does not exist."}), 404


    # Make a secondary query that searches for a specific customer's reservations based on their ID
    reservation_query = """
                        SELECT *
                        FROM reservations
                        WHERE customer_id = %s
                        """

    cursor.execute(reservation_query, (customer_id, ))
    customer_reservations = cursor.fetchall()

    cursor.close()
    connection.close()

    return jsonify({"message" : "Reservations In Progress",
                    "reservations" : customer_reservations}), 200

# TODO (Kristopher): Cancel a reservation
# PATCH /api/reservations/<reservation_id>/cancel
# Change the reservation status to "cancelled"
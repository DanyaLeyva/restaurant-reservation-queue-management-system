# backend/routes/reservations.py
# Owner: Kristopher Ryan Manalang
# Handles customer reservations

from flask import Blueprint, request, jsonify
import mysql.connector

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
        return jsonify({"error" : "Invalid JSON data"}, status = 400)

    # Access information by key
    customer_name = data.get("customer_name") # Using this format to avoid KeyError if key does not exist
    customer_phone = data.get("customer_phone")
    party_size = data.get("party_size")
    reservation_time = data.get("reservation_time")

    # DATA VALIDATIONS
    # a. Validate customer_name
    if (not isinstance(customer_name, str) or not customer_name.strip()): # empty string considered falsy
        return jsonify({"error" : "Invalid name"}, status = 400)

    # b. Validate customer_phone (must be type str, not empty)
    if (not isinstance(customer_phone, str) or not customer_phone.strip()):
        return jsonify({"error" : "Invalid phone number"}, status = 400)

    # c. Validate party_size (must be type int or at least 1)
    if (not isinstance(party_size, int) or party_size < 1):
        return jsonify({"error" : "Invalid party size"}, status = 400)

    # d. Validate reservation_time (must be type str or not empty)
    if (not isinstance(reservation_time, str) or not reservation_time.strip()): 
        return jsonify({"error" : "Invalid reservation time"}, status = 400)

    # STOPPED HERE, CONTINUE HERE
    # Save to the mySQL Database
    connection = mysql.connector.connect(
        host =
        user =
        password =
        database = 
    )

    # Confirm reservation and send back to frontend

    response = {"message" : "Reservation has been made.",
                "status" : "confirmed",
                "reservation_id" : reservation_id}

    return jsonify(response, status = 201)



    # Handling for when data is 
    #if not isinstance(data, dict):
    #   return jsonify({"ERROR" : "Invalid request"}), 400 #




# TODO (Kristopher): View all reservations
# GET /api/reservations

# TODO (Kristopher): View reservations for one customer
# GET /api/reservations?customer_phone=...

# TODO (Kristopher): Cancel a reservation
# PATCH /api/reservations/<reservation_id>/cancel
# Change the reservation status to "cancelled"
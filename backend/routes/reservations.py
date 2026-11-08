# backend/routes/reservations.py
# Owner: Kristopher Ryan Manalang
# Handles customer reservations

from flask import Blueprint, request, jsonify

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

# TODO (Kristopher): View all reservations
# GET /api/reservations

# TODO (Kristopher): View reservations for one customer
# GET /api/reservations?customer_phone=...

# TODO (Kristopher): Cancel a reservation
# PATCH /api/reservations/<reservation_id>/cancel
# Change the reservation status to "cancelled"
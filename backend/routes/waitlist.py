# backend/routes/waitlist.py
# Owner: Alejandro Garcia
# Handles the restaurant waitlist

from flask import Blueprint, request, jsonify

waitlist_bp = Blueprint("waitlist", __name__)

# Use these exact field names:
# waitlist_id, customer_name, customer_phone, party_size,
# status, table_id, joined_at

# Waitlist status values:
# waiting, notified, seated, cancelled

# TODO (Alejandro): Add a customer to the waitlist
# POST /api/waitlist
# Uses: customer_name, customer_phone, party_size
# New entries should have status "waiting"

# TODO (Alejandro): View the current waitlist
# GET /api/waitlist

# TODO (Alejandro): Cancel a waitlist entry
# PATCH /api/waitlist/<waitlist_id>/cancel
# Change the status to "cancelled"

# TODO (Alejandro): Assign a table to a waiting customer
# POST /api/waitlist/<waitlist_id>/assign-table
# Update the table_id and change the customer's status when appropriate

# TODO (Alejandro): Notify a customer that their table is ready
# POST /api/waitlist/<waitlist_id>/notify
# Use the notification function from notifications.py

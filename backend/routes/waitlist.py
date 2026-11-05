# backend/routes/waitlist.py
# Owner: Alejandro Garcia
# Handles the restaurant waitlist

from flask import Blueprint, request, jsonify
import uuid
from datetime import datetime
from backend.notifications import notify_customer

waitlist_bp = Blueprint("waitlist", __name__)
waitlist = []

# Use these exact field names:
# waitlist_id, customer_name, customer_phone, party_size,
# status, table_id, joined_at

# Waitlist status values:
# waiting, notified, seated, cancelled

# TODO (Alejandro): Add a customer to the waitlist
# POST /api/waitlist
# Uses: customer_name, customer_phone, party_size
# New entries should have status "waiting"

@waitlist_bp.route("/", methods = ["POST"])
def add_customer_to_waitList():
    
    # gets info sent by user
    data = request.get_json()
    
    customer_name = data.get("customer_name")
    customer_phone = data.get("customer_phone")
    party_size = data.get("party_size")
    
    # incase data is missing somewhere, bad request
    if not customer_name or not customer_phone or party_size is None:
        return jsonify({"error": "Missing information"}), 400
    
    # can't have of party of 0...
    if party_size <= 0:
        return jsonify({"error": "Invalid party size"}), 400
    
    new_entry = {
        "waitlist_id" : str(uuid.uuid4()),
        "customer_name" : customer_name, 
        "customer_phone" : customer_phone,
        "party_size" : party_size,
        "status" : "waiting",
        "table_id" : None,
        "joined_at" : datetime.now().isoformat(),
    }
    
    waitlist.append(new_entry)
    
    # created
    return jsonify(new_entry), 201


# TODO (Alejandro): View the current waitlist
# GET /api/waitlist

@waitlist_bp.route("/", methods = ["GET"])
def get_waitlist():
    
    # success
    return jsonify(waitlist), 200


# TODO (Alejandro): Cancel a waitlist entry
# PATCH /api/waitlist/<waitlist_id>/cancel
# Change the status to "cancelled"

@waitlist_bp.route("/<waitlist_id>/cancel", methods = ["PATCH"])
def cancel_waitlist_entry(waitlist_id):
    
    for entry in waitlist:
        if entry["waitlist_id"] == waitlist_id:
            entry["status"] = "cancelled"
            return jsonify(entry), 200
        
    return jsonify({"error": "Waitlist entry not found"}), 404


# TODO (Alejandro): Assign a table to a waiting customer
# POST /api/waitlist/<waitlist_id>/assign-table
# Update the table_id and change the customer's status when appropriate

@waitlist_bp.route("/<waitlist_id>/assign-table", methods = ["POST"])
def assign_table(waitlist_id):
    
    data = request.get_json()
    table_id = data.get("table_id")

    if table_id is None:
        return jsonify({"error": "Table ID is required}"}), 400
    
    for entry in waitlist:
        if entry["waitlist_id"] == waitlist_id:
            if entry["status"] != "waiting":
                return jsonify({"error": "Customer is not waiting"}), 400
            
            entry["table_id"] = table_id
            
            return jsonify(entry), 200
    return jsonify({"error": "Waitlist entry not found"}), 404


# TODO (Alejandro): Notify a customer that their table is ready
# POST /api/waitlist/<waitlist_id>/notify
# Use the notification function from notifications.py

@waitlist_bp.route("/<waitlist_id/notify", methods = ["POST"])
def notify_customer(waitlist_id):
    for entry in waitlist:
        if entry["waitlist_id"] == waitlist_id:
            if entry["table_id"] is None:
                return jsonify({"error": "No table assigned"}), 400
            
            # call notification
            success = notify_customer(
                entry["customer_name"],
                entry["customer_phone"]
            )

            #if success then change status to notified
            if success:
                entry["status"] = "notified"
                return jsonify(entry), 200
            
            # internal server error
            return jsonify({"error": "Notification failed"}), 500
        
    return jsonify({"error": "Waitlist entry not found"}), 404

# backend/routes/tables.py
# Owner: Eduardo Salvador
# Handles restaurant table information

from flask import Blueprint, request, jsonify

tables_bp = Blueprint("tables", __name__)

# Use these exact database field names:
# table_id, table_number, capacity, status

# Table status values:
# available, occupied

# TODO (Eduardo): create a route for viewing all restaurant tables
# GET /api/tables

# TODO (Eduardo): create a route for changing a table's status
# PATCH /api/tables/<table_id>/status
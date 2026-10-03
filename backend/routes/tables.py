# Table routes

from flask import Blueprint, request, jsonify

tables_bp = Blueprint("tables", __name__)

# TODO (Kristopher): get all tables and their status
# TODO (Kristopher): set a table to available or occupied

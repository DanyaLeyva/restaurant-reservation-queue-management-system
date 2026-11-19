import re
from contextlib import closing

import pyodbc
from flask import Blueprint, current_app, jsonify,request

from db import get_connection

customers_bp = Blueprint("customers", __name__)

@customers_bp.route("/api/customers", methods=["POST"])
def create_customer():
    data = request.get_json(silent=True)

    if not isinstance(data, dict):
        return jsonify({"message": "Send a JSON object."}),400

    name = data.get("name")
    phone = data.get("phone")

    if not isinstance(name,str) or not 1<=len(name.strip()) <=50:
        return jsonify({
            "message" : "Enter a name"
        }),400

    if(not isinstance(phone,str)
       or re.fullmathc(r"\([0-9]{3}\) [0-9]{3}-[0-9]{4}", phone) is None
    ):
        return jsonify({
        "Message": "Use the phone format (123) 456-7890"
    }),400

    try:
        with closing(get_connection()) as connection:
            with closing(connection.cursor()) as cursor:
                cursor.execute(
                    """
                    INSERT INTO dbo.Customers (Name, Phone)
                    VALUES (?,?)
                    """,
                    (name.strip(),phone),
                )
                connection.commit()
            return jsonify({
                "message": "Customer saved successfully!"
            }),201

    except pyodbc.Error:
            current_app.logger.exception("Customer insert failed")

            return jsonify({
                 "message": "Unable to save customer. Check the backend terminal."
            }),500
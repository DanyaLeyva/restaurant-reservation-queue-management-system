# Flask backend. Main file that starts the server.
# Owner: Kristopher Ryan Manalang

# REQUIRED LIBRARIES: flask, flask_cors
from flask import Flask, jsonify
from flask_cors import CORS

from routes.reservations import reservations_bp
from routes.waitlist import waitlist_bp
from routes.tables import tables_bp

app = Flask(__name__)

# TODO (Kristopher): Connect these route files to the Flask app:
# - reservations.py
# - waitlist.py
# - tables.py

app.register_blueprint(reservations_bp)
app.register_blueprint(waitlist_bp)
app.register_blueprint(tables_bp)

# TODO (Kristopher): Set up CORS so the React frontend
# can communicate with the Flask backend
# Allow CORS to access all routes; CORS cross-origin resource sharing which determines if the frontend can communicate with the backend despite having different origins
CORS(app)


# Check health
@app.route("/api/health")
def health():
    return jsonify({"status": "ok"})


if __name__ == "__main__":
    app.run(debug=True)

#Eduardo, Im testing the connection to the cloud database

@app.route("/")
def home();
    return "Flask is running"
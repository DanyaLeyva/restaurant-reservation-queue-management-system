# Flask backend. Main file that starts the server.
# Owner: Kristopher Ryan Manalong

from flask import Flask, jsonify

app = Flask(__name__)

# TODO (Kristopher): Connect these route files to the Flask app:
# - reservations.py
# - waitlist.py
# - tables.py

# TODO (Kristopher): Set up CORS so the React frontend
# can communicate with the Flask backend


@app.route("/api/health")
def health():
    return jsonify({"status": "ok"})


if __name__ == "__main__":
    app.run(debug=True)

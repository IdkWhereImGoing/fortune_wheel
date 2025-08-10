from flask import Flask, request, jsonify

app = Flask(__name__)

@app.route("/")
def index():
    return "Hello, Render!"

@app.route("/get_value", methods=["GET"])
def get_value():
    return jsonify({"value": "some_variable"})

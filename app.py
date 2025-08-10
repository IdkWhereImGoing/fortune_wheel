from flask import Flask, request, jsonify, render_template

app = Flask(__name__)

@app.route("/")
def home():
    return render_template("index.html")

@app.route("/get_value", methods=["GET"])
def get_value():
    return jsonify({"value": "some_variable"})



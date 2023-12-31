from flask import Flask, render_template, jsonify
from pymongo import MongoClient

app = Flask(__name__)

# Connect to MongoDB
client = MongoClient("mongodb://localhost:27017/")
db = client["pedestrians"]
collection = db["ped_acc"]

@app.route("/")
def index():
    return render_template("index1.html")

@app.route("/get_geojson")
def get_geojson():
    # Retrieve GeoJSON data from MongoDB
    geojson_data = []
    for document in collection.find({}, {"_id": 0}):
        geojson_data.append(document)

    return jsonify(geojson_data)

if __name__ == "__main__":
    app.run(debug=True)

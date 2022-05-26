import Services
from flask import Flask, jsonify, request
from flask_cors import CORS, cross_origin
app = Flask(__name__)
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'


@app.route("/api/v1.1/TweetRetrieval", methods=["POST"])
@cross_origin()
def smth():
    try:
        data = request.get_json()
        result = Services.FetchAndCheckAll(data)
        items = {
            "status": 200,
            "response": result
        }
        return jsonify(result)
    except Exception:
        result = {
            "status": 404,
            "response": "There has been an error"
        }
        return result

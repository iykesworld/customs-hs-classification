import os
import json
from flask import Blueprint, request, jsonify
from flask_cors import CORS 

from .classifier import classify_product


api_bp = Blueprint('api', __name__)

CORS(api_bp) 


@api_bp.route('/classify', methods=['POST'])
def classify_route():
    """
    API endpoint to receive a product description and return HS Code predictions.
    """
    # 1. Check for JSON data in the request
    if not request.is_json:
        return jsonify({"error": "Missing JSON in request"}), 400

    data = request.get_json()
    product_description = data.get('description')

    # 2. Validate input
    if not product_description or not isinstance(product_description, str):
        return jsonify({"error": "Invalid or missing 'description' field"}), 400

    # 3. Call the core classifier logic
    result = classify_product(product_description)

    # 4. Handle and return the result
    if result.get("error"):
        # Log the error and return a 500 status
        print(f"Classification failure: {result['error']}")
        return jsonify({"status": "error", "message": result['error']}), 500
    
    # Success
    return jsonify({
        "status": "success",
        "message": "Classification successful",
        "predictions": result['data']['predictions']
    }), 200


@api_bp.route('/', methods=['GET'])
def index():
    return jsonify({
        "service": "Customs AI Classification API", 
        "version": "1.0",
        "status": "Running",
        "endpoint": "/classify (POST)"
    })
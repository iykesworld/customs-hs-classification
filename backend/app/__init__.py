from flask import Flask
from flask_cors import CORS

def create_app():
    """Application factory for Flask."""
    app = Flask(__name__)

    # Enable CORS for frontend + local development
    CORS(
        app,
        origins=[
            "http://localhost:3000",
            "https://customs-hs-classification.vercel.app"
        ]
    )

    # Import and register the blueprints (our API routes)
    from .api import api_bp
    app.register_blueprint(api_bp)

    return app
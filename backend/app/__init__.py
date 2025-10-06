from flask import Flask

def create_app():
    """Application factory for Flask."""
    app = Flask(__name__)
    
    # Import and register the blueprints (our API routes)
    from .api import api_bp
    app.register_blueprint(api_bp)

    return app
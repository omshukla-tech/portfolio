import os
from flask import Flask, send_from_directory
from flask_cors import CORS
from backend.app.database import db
from backend.app.routes import api
from backend.config import Config

def create_app(config_class=Config):
    # Set static and template folders pointing to the Vite build directory
    frontend_dist = os.path.abspath(os.path.join(os.path.dirname(__file__), '../../frontend/dist'))
    
    app = Flask(__name__, 
                static_folder=os.path.join(frontend_dist, 'assets'),
                template_folder=frontend_dist)
                
    app.config.from_object(config_class)
    
    # Configure CORS to allow access from the frontend (Vite React app in dev mode)
    CORS(app, resources={r"/api/*": {"origins": "*"}})
    
    db.init_app(app)
    
    app.register_blueprint(api, url_prefix='/api')
    
    # Catch-all route to serve the React application for any frontend route
    @app.route('/', defaults={'path': ''})
    @app.route('/<path:path>')
    def serve_frontend(path):
        if path.startswith('api/'):
            return {"message": "API endpoint not found"}, 404
            
        # Serve root-level files like favicon.jpg, robots.txt, sitemap.xml
        if path != "" and os.path.exists(os.path.join(frontend_dist, path)):
            return send_from_directory(frontend_dist, path)
        else:
            return send_from_directory(frontend_dist, 'index.html')
        
    return app

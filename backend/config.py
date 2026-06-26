import os

class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY', 'dev_key_for_om_portfolio_website_2026')
    
    # Neon PostgreSQL database connection URI fallback
    default_db = "postgresql://neondb_owner:npg_9nVGJgI2fitQ@ep-long-smoke-at1guqmu-pooler.c-9.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require"
    
    db_url = os.environ.get('DATABASE_URL', default_db)
    
    # Fix protocol compatibility: rewrite legacy "postgres://" to "postgresql://" (SQLAlchemy 1.4+)
    if db_url and db_url.startswith("postgres://"):
        db_url = db_url.replace("postgres://", "postgresql://", 1)
        
    SQLALCHEMY_DATABASE_URI = db_url
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    JWT_SECRET_KEY = os.environ.get('JWT_SECRET_KEY', 'jwt_secret_key_om_2026')

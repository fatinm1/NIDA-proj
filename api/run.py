import os
from app import create_app, db, migrate

app = create_app()

if __name__ == '__main__':
    # Run database migrations on startup
    with app.app_context():
        try:
            print("Running database migrations...")
            migrate.upgrade()
            print("Database migrations completed successfully!")
        except Exception as e:
            print(f"Migration error (this might be normal on first run): {e}")
    
    # Get port from environment variable (Railway sets this)
    port = int(os.environ.get('PORT', 5001))
    # Disable debug in production
    debug = os.environ.get('FLASK_ENV') != 'production'
    app.run(host='0.0.0.0', port=port, debug=debug)

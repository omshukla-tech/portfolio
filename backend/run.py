import sys
import os

# Add parent directory to system path to enable modular package imports
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from backend.app import create_app

app = create_app()

if __name__ == '__main__':
    app.run(debug=True, port=5000)

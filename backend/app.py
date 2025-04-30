from flask import Flask, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Configure SQLite database
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///boyboy_demo.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

from backend import routes

app.register_blueprint(routes.api)

@app.route('/')
def index():
    return jsonify({"message": "Boyboy Demo API is running"})

@app.cli.command('initdb')
def initdb_command():
    """Initialize the database."""
    db.create_all()
    print('Initialized the database.')

if __name__ == '__main__':
    app.run(debug=True)

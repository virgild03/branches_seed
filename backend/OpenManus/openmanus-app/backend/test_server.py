from flask import Flask, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route('/')
def home():
    return jsonify({"message": "Flask fonctionne !"})

@app.route('/run-script')
def run_script():
    return jsonify({"output": "Le script Python s'est exécuté."})

if __name__ == '__main__':
    print("Routes disponibles :", app.url_map)
    app.run(port=5000)

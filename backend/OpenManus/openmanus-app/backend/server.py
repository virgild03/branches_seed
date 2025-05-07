from flask import Flask, jsonify, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# On importe directement la fonction Python :
from main_program import generate_question_for_recruiter

@app.route('/')
def home():
    return jsonify({"message": "Flask est opérationnel !"})

@app.route('/generate-question', methods=['POST'])
def generate_question_endpoint():
    """
    Reçoit un JSON :
      {
        "difficulte": "facile",
        "theme": "Java",
        "format": "QCM"
      }
    Retourne :
      {
        "question": "...",
        "error": ""
      }
    """
    try:
        data = request.get_json()
        if not data:
            return jsonify({"error": "Aucun JSON reçu", "question": ""}), 400

        difficulte = data.get("difficulte", "facile")
        theme = data.get("theme", "Général")
        question_format = data.get("format", "QCM")

        # Appel direct à la fonction Python
        question = generate_question_for_recruiter(difficulte, theme, question_format)
        return jsonify({"question": question, "error": ""})

    except Exception as e:
        return jsonify({"question": "", "error": str(e)}), 500

if __name__ == '__main__':
    app.run(port=5000)

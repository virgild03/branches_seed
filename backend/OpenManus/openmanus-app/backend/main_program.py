import sys
import os

# Ajoute le chemin vers le dossier qui contient question_generator.py
sys.path.append(r"C:\Users\lakaf\OpenManus")

from question_generator import generate_question

def generate_question_for_recruiter(difficulte, theme, question_format):
    """
    Renvoie la question + réponse générée par question_generator,
    sans input().
    """
    question = generate_question(difficulte, theme, question_format)
    return question

# Test local hors Flask (facultatif)
if __name__ == "__main__":
    question = generate_question_for_recruiter("facile", "Java", "QCM")
    print(question)

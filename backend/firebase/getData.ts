// firebaseService.ts
import { db } from "../config/firebaseConfig";
import { collection, getDocs, doc, getDoc, query, where} from 'firebase/firestore';
import * as types from "../commun/types/firebase";

const getCandidateAnswers = async () => {
  const candidateAnswersRef = collection(db, 'CandidateAnswer');
  const snapshot = await getDocs(candidateAnswersRef);
  const candidateAnswers = snapshot.docs.map((doc) => doc.data());

  return candidateAnswers;
};

const getQuestionnaireInfo = async () => {
  const exercisesRef = collection(db, 'exercise');
  const snapshot = await getDocs(exercisesRef);
  const exercises = snapshot.docs.map((doc) => doc.data());

  return exercises;
};

// Récupérer toutes les réponses des candidats
const getAnswers = async () => {
  const answersRef = collection(db, 'Answers');
  const snapshot = await getDocs(answersRef);
  const answers = snapshot.docs.map((doc) => doc.data());

  return answers;
};


// Fonction principale pour récupérer les données liées
const getAllData = async () => {
  try {
    const candidateAnswers = await getCandidateAnswers();
    const exercises = await getQuestionnaireInfo();
    const answers = await getAnswers();

    // Optionnel: Tu peux faire des jointures, ou d'autres opérations ici

    return {
      candidateAnswers,
      exercises,
      answers,
    };
  } catch (error) {
    console.error('Erreur lors de la récupération des données:', error);
  }
};


//fonctions transformant les string en enum
export const  mapDifficulty = (value: string): types.Difficulty => {
    switch (value.toUpperCase()) {
      case "FACILE": return types.Difficulty.FACILE;
      case "MOYEN": return types.Difficulty.MOYEN;
      case "DIFFICILE": return types.Difficulty.DIFFICILE;
      default: throw new Error(`Difficulté inconnue : ${value}`);
    }
  };


export const mapLangage = (value: string): types.Language => {
    switch (value.toUpperCase()) {
      case "PYTHON": return types.Language.PYTHON;
      case "C": return types.Language.C;
      case "C++": return types.Language.CPP;
      case "JAVA": return types.Language.JAVA;
      case "JAVASCRIPT": return types.Language.JAVASCRIPT;
      default: throw new Error(`Langage inconnu : ${value}`);
    }
  }; 
  
export const mapType =(value: string): types.Type => {
  switch(value){
    case "QCM": return types.Type.QCM;
    case "Question libre": return types.Type.OpenQuestion;
    case "Question de code": return types.Type.CodingQuestion;
    default: throw new Error(`Type de question inconnu : ${value}`);
  }
}

export { getAllData };

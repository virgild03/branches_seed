import { collection, query, where, getDocs, DocumentReference, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../../config/firebaseConfig";
import { executeCodeInSandbox } from "../../sandbox/runInSanbox"; 


// Fonction qui corrige automatiquement un QCM
export const QCMCorrection = async (answerRef: DocumentReference) => {
    try {
        const answerSnap = await getDoc(answerRef);
        if (!answerSnap.exists()) throw new Error("Cette réponse n'existe pas");

        const answerData = answerSnap.data() as {
            selectedOption: string;
            questionId: DocumentReference;
        };

        const questionRef = answerData.questionId;

        const questionSnap = await getDoc(questionRef);
        if (!questionSnap.exists()) throw new Error("Cette question n'existe pas");

        const questionData = questionSnap.data() as {
            acceptedAnswer: string;
            score: number;
        };

        const isCorrect = answerData.selectedOption === questionData.acceptedAnswer;

        await updateDoc(answerRef, {
            corrected: true,
            score: isCorrect ? questionData.score : 0,
            isCorrect: isCorrect
        });

    } catch (error) {
        console.error("Erreur lors de la correction QCM :", error);
        throw error;
    }
};


// Fonction qui met a jour un document du type answer "OpenQuestion"
const OpenQuestionCorrection = async( answerRef : DocumentReference) =>{
  try{
    // Récupérer la réponse du candidat
    const answerSnap = await getDoc(answerRef);
    if (!answerSnap.exists()) throw new Error("Réponse introuvable");

    const answerData = answerSnap.data() as {
      questionId: DocumentReference;
    };

    const questionRef = answerData.questionId;
    // Récupérer la question
    const questionSnap = await getDoc(questionRef);
    if (!questionSnap.exists()) throw new Error("Question introuvable");

    // Mise à jour dans Firebase
    await updateDoc(answerRef, {
      corrected: false,
      score: 0, 
    });
  } catch (error) {
    console.error("Erreur lors de la correction ouverte :", error);
    throw error;
}
}



// Fonction qui corrige automatiquement un Coding Question
export const correctCodingAnswer = async (answerRef: DocumentReference) => {
    try {
      // Récupérer la réponse du candidat
      const answerSnap = await getDoc(answerRef);
      if (!answerSnap.exists()) throw new Error("Réponse introuvable");
  
      const answerData = answerSnap.data() as {
        value: string;
        questionId: DocumentReference;
      };
  
      const candidateCode = answerData.value;
      const questionRef = answerData.questionId;
  
      // Récupérer la question
      const questionSnap = await getDoc(questionRef);
      if (!questionSnap.exists()) throw new Error("Question introuvable");
  
      const questionData = questionSnap.data() as {
        input: string;
        expectedOutput: string;
        language: string;
        score: number;
      };
  
      const input = questionData.input;
      const expectedOutput = questionData.expectedOutput;
      const language = questionData.language;
      const questionScore = questionData.score;
  
      let candidateOutput = "";
      let isCorrect = false;
  
      try {
        // Exécuter le code candidat
        candidateOutput = await executeCodeInSandbox(candidateCode, language, input);
  
        // Comparer le résultat
        isCorrect = candidateOutput.trim() === expectedOutput.trim();
  
      } catch (executionError) {
        console.error("Erreur lors de l'exécution du code:", executionError);
        // Si le code a une erreur on garde isCorrect à false et candidateOutput vide
        candidateOutput = "";
        isCorrect = false;
      }
  
      // Mise à jour dans Firebase
      await updateDoc(answerRef, {
        corrected: true,
        isCorrect: isCorrect,
        score: isCorrect ? questionScore : 0,
        candidateOutput: candidateOutput,
        output: candidateOutput,  
      });
  
      console.log(`Correction terminée : ${isCorrect ? "Réponse correcte" : "Réponse incorrecte"}`);
  
    } catch (error) {
      console.error("Erreur de correction automatique:", error);
      throw error;
    }
  };


// Fonction qui corrige n'importe quel type de question 
export const correctAnswer= async(answerRef : DocumentReference) =>{
  try{
    const answerSnap = await getDoc(answerRef);
    if (!answerSnap.exists()) throw new Error("Réponse introuvable");

    const answerData = answerSnap.data() as {
      questionId: DocumentReference;
      type : string;
    };
  
    const questionRef = answerData.questionId;
    // Récupérer la question
    const questionSnap = await getDoc(questionRef);
    if (!questionSnap.exists()) throw new Error("Question introuvable");

    const type = answerData.type;


    if(type=="QCM") QCMCorrection(answerRef);
    else if(type=="OpenQuestion") OpenQuestionCorrection(answerRef);
    else correctCodingAnswer(answerRef);
    
  }catch(error){
    console.error("Erreur dans la correction :", error);
    throw error;
  }
};
  
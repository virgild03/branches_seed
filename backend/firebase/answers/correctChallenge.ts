import { collection, query, where, getDoc, DocumentReference, updateDoc } from "firebase/firestore";
import { db } from "../../config/firebaseConfig";
import { correctAnswer } from "./autoCorrection";

export const autoCorrectChallengeAnswer = async (challengeAnswerRef :DocumentReference ) =>{
try{
    const challengeAnswerSnap = await getDoc(challengeAnswerRef);
    if (!challengeAnswerSnap.exists()) throw new Error("Réponse du challenge introuvable");

    const challengeAnswerData = challengeAnswerSnap.data() as {
      answers: DocumentReference[],
      score : number,
    };
    // récupere toutes les réponses 
    const answersRef = challengeAnswerData.answers;
    const score = challengeAnswerData.score;
    
    // corrige toutes les questions QCM et Coding questions de la réponse entière au challenge
    for (let i=0;i< answersRef.length ; i++) {
        await correctAnswer(answersRef[i]);
        let answerSnap = await getDoc(answersRef[i]);
        let answerData = answerSnap.data() as {
            score : number,
        };
        let answerScore= answerData.score;

        updateDoc(challengeAnswerRef , {
            score : score + answerScore
        })
    }
    console.log("Toutes les réponses du challenge ont été corrigées.");

  }catch(error){
    console.error("Erreur dans la correction automatique du questionnaire :", error);
    throw error;
  }
};

export const manualCorrectChallengeAnswer = async (challengeAnswerRef :DocumentReference ) => {
    try{
        const challengeAnswerSnap = await getDoc(challengeAnswerRef);
        if (!challengeAnswerSnap.exists()) throw new Error("Réponse du challenge introuvable");
    
        const challengeAnswerData = challengeAnswerSnap.data() as {
          answers: DocumentReference[];
        };
        // récupere toutes les réponses 
        const answersRef = challengeAnswerData.answers;
        
        // corrige toutes les questions QCM et Coding questions de la réponse entière au challenge
        for (let i=0;i< answersRef.length ; i++) {
            const answerSnap = await getDoc(answersRef[i]);
            if(!answerSnap.exists()) throw new Error(" réponse introuvable ");

            const answerData = answerSnap.data() as {
                type : string ,
            }

            if( answerData.type == "OpenQuestion" ) {
                let score = console
            }

        }
        console.log("Toutes les réponses du challenge ont été corrigées.");
    
      }catch(error){
        console.error("Erreur dans la correction  du questionnaire :", error);
        throw error;
      }
};

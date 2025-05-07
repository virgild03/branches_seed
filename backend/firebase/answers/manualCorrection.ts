import { collection, query, where, getDocs, DocumentReference, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../../config/firebaseConfig";

// Fonction qui prend en parametre une question et le score attribué à cette question 
export const correctOpenQuestion = async ( answerRef : DocumentReference, score : number) => {
try{
    const answerSnap = await getDoc(answerRef);
    if (!answerSnap.exists()) throw new Error("Réponse introuvable");

    const answerData = answerSnap.data() as {
      questionId: DocumentReference;
      type : string;
      value : string;
    };
  
    const questionRef = answerData.questionId;
    // Récupérer la question
    const questionSnap = await getDoc(questionRef);
    if (!questionSnap.exists()) throw new Error("Question introuvable");

    const type = answerData.type;
    const value = answerData.value;


    if(type=="OpenQuestion") {
        console.log(" la réponse du candidat est :"+value);
        await updateDoc(answerRef ,{
            corrected : true,
            score : score,
        })
    }
    else throw new Error("Vous ne pouvez corriger que des questions ouvertes");
        

    
  }catch(error){
    console.error("Erreur dans la correction :", error);
    throw error;
  }
};
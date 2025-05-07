import { db } from "../../config/firebaseConfig";
import {DocumentReference,doc, getDoc, addDoc, collection } from "firebase/firestore";
 

// Fonction qui prend en parametre l'id d'un challenge et recupere les questions d'un challenge 
export const getChallengeWithQuestions = async(challengeId: string)=>{
    const challengeDoc= await getDoc(doc(db,"Challenge",challengeId));

    //si le challenge existe pas on lance une exception
    if (!challengeDoc.exists()) {
        throw new Error("Le challenge n'existe pas.");
      }
    const challengeData = challengeDoc.data();

    
    const questions = await Promise.all(
        challengeData.questions.map(async (ref: DocumentReference) => {
            const snap = await getDoc(ref);
            return snap.data();
          })
        );

    return {...challengeData,questions};


};
import { db } from "../../config/firebaseConfig";
import { doc, getDoc, updateDoc, arrayUnion, collection, DocumentReference } from "firebase/firestore";
 // Fonction qui prend en parametres l'id d'un challenge et la reference d'une question 
 // et l'ajoute à la liste de questions du challenge
export const addQuestionToChallenge= async(challengeId: string, questionRef : DocumentReference)=>{
    const challengeRef = doc(db, "Challenge", challengeId);
    const challengeSnap= await getDoc(challengeRef);
    if ( !challengeSnap.exists()){
        throw new Error("Challenge inexistant");
    }

    // on recupere les données du questionnaire en cours
    const currentData=challengeSnap.data();
    const currentScore = currentData.score; //score a incrementer
    const currentDuration = currentData.duration; //duration aussi


    //on récupere les données de la question entrée en parametre
    const questionSnap = await getDoc(questionRef);
    if( !questionSnap.exists()){
        throw new Error("Question inexistante");
    }
    const currentQuestion= questionSnap.data();

   //on met a jour le challenge en ajoutant la question et modifiant sa durée et score
    await updateDoc(challengeRef,{
        questions : arrayUnion(questionRef),
        score : currentScore+ currentQuestion.score,
        duration : currentDuration+ currentQuestion.duration,
    });
};

//To Do : Tester
import { db } from "../../config/firebaseConfig";
import { addDoc, collection } from "firebase/firestore";

// Fonction qui crée un challenge et l'ajoute a la BDD
export const createChallenge= async(data:any)=>{
    const challengeRef = await addDoc(collection(db,"Challenge"),data);
    return challengeRef.id;
};
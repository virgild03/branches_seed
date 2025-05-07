import { db } from "../../config/firebaseConfig";
import { addDoc, collection } from "firebase/firestore";


export const addQuestionToFirestore = async (questionData: any) => {
  try {
    const docRef = await addDoc(collection(db, "exercise"), {
      ...questionData,
    }); //génére automatiquement un ID et ajoute un nouveau document
    console.log("Question ajoutée avec ID :", docRef.id);
    return docRef.id;
  } catch (err) {
    console.error("Erreur lors de l’ajout de la question :", err);
    throw err;
  }
};
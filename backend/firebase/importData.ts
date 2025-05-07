//fichier pour transferer des data de json a firestore

import { db } from "../config/firebaseConfig"; //connexion firestore
import data from "../data/data.json"; 
import { writeBatch, doc, collection } from "firebase/firestore"; //batch permet l'envoi de plusieurs ecriture en un seul envoi
// db et collection fonctions pour créer des ref firestore

const importCollections = async () => {
  const batch = writeBatch(db); //creation du batch

  for (const [collectionName, documents] of Object.entries(data)) { //parcours de chaque collection dans le json
    documents.forEach((documentWrapper: any) => {
      const docId = Object.keys(documentWrapper)[0];
      const documentData = documentWrapper[docId];
      const transformedDoc: any = { ...documentData };

     //si la collextion est Challenge transformer en reference les exercices et jobid
      if (collectionName === "Challenge" && Array.isArray(documentData.exercises)) {
        transformedDoc.exercises = documentData.exercises.map((ref: string) => {
          const [coll, id] = ref.split("/");
          return doc(db, coll, id); 
        });

        if (documentData.jobId) {
          transformedDoc.jobId = doc(db, "Job", documentData.jobId);
        }
      }
      //si la collextion est CandidateAnswer transformer en reference 
      if (collectionName === "CandidateAnswer" && Array.isArray(documentData.answers)) {
        transformedDoc.answers = documentData.answers.map((ref: string) => {
          const [coll, id] = ref.split("/");
          return doc(db, coll, id); 
        });

        if (documentData.jobId) {
          transformedDoc.jobId = doc(db, "Job", documentData.jobId);
        }

        if (documentData.candidateId) {
          transformedDoc.candidateId = doc(db, "Candidate", documentData.candidateId);
        }
      }

      //si la collextion est Answer on transforme questionid en ref
      if (collectionName === "Answer" && documentData.exerciseId) {
        transformedDoc.questionId = doc(db, "exercise", documentData.exerciseId);
      }

      
      const docRef = doc(collection(db, collectionName), docId);// creer le doc a inserer

      
      batch.set(docRef, transformedDoc);//l'ajoute au batch
    });
  }

  try {
    await batch.commit(); //envoie du batch vers firestore
    console.log("ca marche");
  } catch (error) {
    console.error("erreur", error);
  }
};

importCollections();

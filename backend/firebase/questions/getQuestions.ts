// dans ce fichier il ya toutes les methodes de récuperation des questions selon des filtres sur firebase

import { db } from "../../config/firebaseConfig";
import { collection, getDocs, doc, getDoc, query, where} from 'firebase/firestore';
import * as types from "../../commun/types/firebase";




// fonction qui récupere les questions de la bdd selon les tags 
export const getQuestionsByTags = async (tags: string[]): Promise<types.Question[]> => {
  const questionsRef = collection(db, "exercise");
  const q = query(questionsRef, where("tags", "array-contains-any", tags));
  const snapshot = await getDocs(q);

  const questions: types.Question[] = snapshot.docs.map((doc) => {
    const data = doc.data();
    switch (data.type) {
      case "QCM":
        return new types.QCM(data.id, data.desciription, data.options, data.acceptedAnswer, data.duration,data.score, data.tags, data.difficulty);
      case "OpenQuestion":
        return new types.OpenQuestion(data.id , data.description, data.duration, data.score, data.topics , data.difficulty);
      case "CodingQuestion":
        return new types.CodingQuestion(data.id ,data.language ,data.desciription,data.expectedOutput , data.duration , data.score , data.topics, data.difficulty);
      default:
        throw new Error(`Type de question inconnu : ${data.type}`);
    }
  });


  return questions;
};

// Fonction qui recupere les id de toutes les questions de la BDD
// cas ou aucun filtre est utilisé
export const getQuestionIds = async ():Promise<string[]> =>{
  const questionRef = collection(db,"exercise");
  const snapshot = await getDocs(questionRef)
  return snapshot.docs.map((doc)=> doc.id);
}

// fonction qui recupere les id des questions ayant un des tags entrés en parametre
// validée !
export const getQuestionIdsByTags = async (tags: string[]): Promise<string[]> => {
    const questionsRef = collection(db, "exercise");
    const q = query(questionsRef, where("tags", "array-contains-any", tags)); //requette
    const snapshot = await getDocs(q);
  
    return snapshot.docs.map((doc) => doc.id);
  };
  
// fonction qui récupere les id des questions du type entré en paramètres
export const getQuestionIdsByType = async (t : types.Type): Promise<string[]> =>{
    const questionRef = collection(db,"exercice");
    if( t==types.Type.QCM){
        const  q = query(questionRef, where("type", "==","QCM" ));
        const snapshot = await getDocs(q);
        return snapshot.docs.map((doc)=> doc.id);
    }
    if( t==types.Type.OpenQuestion){
        const  q = query(questionRef, where("type", "==","OpenQuestion" ));
        const snapshot = await getDocs(q);
        return snapshot.docs.map((doc)=> doc.id);
    }

    if( t==types.Type.CodingQuestion){
        const  q = query(questionRef, where("type", "==","CodingQuestion" ));
        const snapshot = await getDocs(q);
        return snapshot.docs.map((doc)=> doc.id);
    }
    else throw new Error ("Type de questions introuvable");

    
}



// fonction qui recupere les id des questions ayant la difficulté entrée en paramètres
//  validée !!
export const getQuestionIdsByDifficulty =async (diff: types.Difficulty): Promise<string[]> =>{
    const questionsRef = collection(db, "exercise");
    
    if(diff== types.Difficulty.FACILE){
        const q = query(questionsRef, where("difficulty", "==", "FACILE"));
        const snapshot = await getDocs(q);
        return snapshot.docs.map((doc) => doc.id);
    }
    if(diff== types.Difficulty.MOYEN){
        const q = query(questionsRef, where("difficulty", "==", "MOYEN"));
        const snapshot = await getDocs(q);
        return snapshot.docs.map((doc) => doc.id);
    }
    if(diff== types.Difficulty.DIFFICILE){
        const q = query(questionsRef, where("difficulty", "==", "DIFFICILE"));
        const snapshot = await getDocs(q);
        return snapshot.docs.map((doc) => doc.id);
    }
    else throw new Error("le type entrée en parametre et inconnu");
                 
    
}

// fonction  qui recupere les questions de la bdd selon la difficulté

export const getQuestionsByDifficulty = async (dif : types.Difficulty): Promise<types.Question[]> =>{
    const questionRef = collection(db , "exercice");
    let diff;
    if( dif == types.Difficulty.FACILE){
        diff = "FACILE";
    }
    else if( dif == types.Difficulty.MOYEN){
        diff = "MOYEN";
    }
    else if( dif == types.Difficulty.DIFFICILE){
        diff = "DIFFICILE";
    }
    else throw new Error( "Type de difficulté entré en parametres inconnu !");
    const q = query(questionRef, where("difficulty","==",diff)); 
    const snapshot=await getDocs(q);

    const questions: types.Question[] = snapshot.docs.map((doc) => {
        const data = doc.data();
        switch (data.type) {
          case "QCM":
            return new types.QCM(data.id, data.desciription, data.options, data.acceptedAnswer, data.duration,data.score, data.tags, data.difficulty);
          case "OpenQuestion":
            return new types.OpenQuestion(data.id , data.description, data.duration, data.score, data.topics , data.difficulty);
          case "CodingQuestion":
            return new types.CodingQuestion(data.id ,data.language ,data.desciription,data.expectedOutput , data.duration , data.score , data.topics, data.difficulty);
          default:
            throw new Error(`Type de question inconnu : ${data.type}`);
        }
      });


    return questions;
}

export const getQuestionIdsByFilters = async (
  tags?: string[],
  diff?: types.Difficulty[],
  type?: types.Type[]
): Promise<string[]> => {
  let questionsIds: string[] = [];
  // Si aucun flitre est appliqué
  if (!tags && !diff && !type) {
    // Récupérer tous les ID des questions
    return await getQuestionIds();
  }

  // Récupérer les ID des questions par tags si des tags sont fournis
  if (tags && tags.length > 0) {
    const tagIds = await getQuestionIdsByTags(tags);
    questionsIds = [...questionsIds, ...tagIds];
  }

  // Récupérer les ID des questions par difficulté si une difficulté est fournie
  if (diff && diff.length > 0) {
    const difficultyIds = await Promise.all(
      diff.map((difficulty) => getQuestionIdsByDifficulty(difficulty))
    );
    // Fusionner les IDs obtenus et retirer les doublons
    const flatDifficultyIds = [...new Set(difficultyIds.flat())];
    questionsIds = [...questionsIds, ...flatDifficultyIds];
  }

  // Récupérer les ID des questions par type si un type est fourni
  if (type && type.length > 0) {
    const typeIds = await Promise.all(
      type.map((t) => getQuestionIdsByType(t))
    );
    // Fusionner les IDs obtenus et retirer les doublons
    const flatTypeIds = [...new Set(typeIds.flat())];
    questionsIds = [...questionsIds, ...flatTypeIds];
  }

  // Retirer les doublons dans le tableau final des questionsIds
  const uniqueQuestionsIds = [...new Set(questionsIds)];

  return uniqueQuestionsIds;
};

//export const getQuestionById= async (id : String)=>Promise
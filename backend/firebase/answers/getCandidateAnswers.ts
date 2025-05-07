import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../../config/firebaseConfig";
 

// Fonction qui recupère toutes les réponses d'un questionnaire
export const getCandidateAnswersByJob = async (jobId:string)=>{
    const q = query(collection(db,"CandidateAnswer"),where("jobId","==",jobId));
    const snapshot=await getDocs(q);
    return snapshot.docs.map((doc)=>({ id: doc.id, ...doc.data()}));
};

// Fonction qui récupère la réponse d'un candidat à un questionnaire
export const getCandidateAnswersByCandidate = async( jobId: string , candidateId: string) =>{
    const q = query( collection(db,"CandidateAnswer"),where("jobId","==",jobId), where("candidateId","==",candidateId));
    const snapshot = await getDocs(q);
    if(snapshot.empty) throw new Error(" Aucune réponse n'a été trouvée");
    const docSnap = snapshot.docs[0];
    return {id: docSnap.id,...docSnap.data()};
};

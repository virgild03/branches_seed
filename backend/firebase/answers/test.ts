import { db } from "../../config/firebaseConfig";
import { correctCodingAnswer, QCMCorrection } from "../answers/autoCorrection"; 
import { doc } from "firebase/firestore";
import { autoCorrectChallengeAnswer } from "./correctChallenge";

const testCodingCorrection = async () => {
  try {
    const answerRef = doc(db, "Answers", "answer_c_1"); // récupère la référence Firestore de  réponse
    await correctCodingAnswer(answerRef); // appelle la fonction de correction automatique
    console.log("Correction de la réponse effectuée !");


    const qcmRef= doc(db, "Answers", "ans1");
    await QCMCorrection(qcmRef);
    console.log("Correction de la réponse qcm effectuée !");

      // test de la correction auto de
    //const challengeAnswerRef = doc(db, "CandidateAnswer", "candAnswer1"); // remplace par l’ID correct
    //await autoCorrectChallengeAnswer(challengeAnswerRef);
  } catch (error) {
    console.error("Erreur pendant la correction:", error);
  }
};

testCodingCorrection();

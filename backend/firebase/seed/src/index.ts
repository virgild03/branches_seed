import { onCall } from "firebase-functions/v2/https";
import * as admin from "firebase-admin";
import { autoCorrectChallengeAnswer } from "./answers/correctChallenge";

admin.initializeApp();
const db = admin.firestore();

/**
 * Callable Function : corrige toutes les réponses d’un CandidateAnswer
 * data = { candidateAnswerId: "candAnswer1" }
 */
export const autoCorrect = onCall(async (request) => {
  const candidateAnswerId = request.data?.candidateAnswerId as string;
  if (!candidateAnswerId) {
    throw new Error("candidateAnswerId manquant");
  }
  const candRef = db.doc(`CandidateAnswer/${candidateAnswerId}`);
  await autoCorrectChallengeAnswer(candRef);
  return { ok: true };
});

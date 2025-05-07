import { db, DocumentReference } from "../db";
import { correctAnswer } from "./autoCorrection";

export const autoCorrectChallengeAnswer = async (challengeAnswerRef: DocumentReference) => {
  const challengeSnap = await challengeAnswerRef.get();
  if (!challengeSnap.exists) throw new Error("Réponse du challenge introuvable");

  const { answers, score: baseScore } = challengeSnap.data() as {
    answers: DocumentReference[];
    score: number;
  };

  let total = baseScore;
  for (const ansRef of answers) {
    await correctAnswer(ansRef);
    const ansScore = (await ansRef.get()).data()?.score ?? 0;
    total += ansScore;
  }
  await challengeAnswerRef.update({ score: total });
};

export const manualCorrectChallengeAnswer = async (challengeAnswerRef: DocumentReference) => {
  /* à écrire plus tard – ici rien ne change côté SDK */
};

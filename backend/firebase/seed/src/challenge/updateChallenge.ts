import { db, DocumentReference, FieldValue } from "../db";

export const addQuestionToChallenge = async (challengeId: string, questionRef: DocumentReference) => {
  const challRef  = db.doc(`Challenge/${challengeId}`);
  const challSnap = await challRef.get();
  if (!challSnap.exists) throw new Error("Challenge inexistant");

  const { score = 0, duration = 0 } = challSnap.data() as any;
  const questionSnap = await questionRef.get();
  if (!questionSnap.exists) throw new Error("Question inexistante");

  const { score: qScore, duration: qDuration } = questionSnap.data() as any;

  await challRef.update({
    questions: FieldValue.arrayUnion(questionRef),
    score:     score    + qScore,
    duration:  duration + qDuration,
  });
};

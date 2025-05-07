import { db, DocumentReference } from "../db";

export const getChallengeWithQuestions = async (challengeId: string) => {
  const challSnap = await db.doc(`Challenge/${challengeId}`).get();
  if (!challSnap.exists) throw new Error("Challenge inexistant");

  const data = challSnap.data()!;
  const questions = await Promise.all(
    (data.questions as DocumentReference[]).map(async (ref) => (await ref.get()).data())
  );
  return { ...data, questions };
};

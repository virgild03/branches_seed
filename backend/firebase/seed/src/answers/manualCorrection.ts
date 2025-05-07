import { db, DocumentReference } from "../db";

export const correctOpenQuestion = async (answerRef: DocumentReference, score: number) => {
  const snap = await answerRef.get();
  if (!snap.exists) throw new Error("Réponse introuvable");

  const { type, value } = snap.data() as { type: string; value: string };
  if (type !== "OpenQuestion") throw new Error("Uniquement les questions ouvertes");

  console.log("Réponse du candidat :", value);
  await answerRef.update({ corrected: true, score });
};

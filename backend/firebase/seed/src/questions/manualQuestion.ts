import { db } from "../db";

export const addQuestionToFirestore = async (questionData: any) => {
  const ref = await db.collection("exercise").add(questionData);
  console.log("Question ajoutée :", ref.id);
  return ref.id;
};

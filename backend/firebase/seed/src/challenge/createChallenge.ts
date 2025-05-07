import { db } from "../db";

export const createChallenge = async (data: any) => {
  const ref = await db.collection("Challenge").add(data);
  return ref.id;
};

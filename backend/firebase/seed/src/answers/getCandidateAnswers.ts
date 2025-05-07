import { db } from "../db";

export const getCandidateAnswersByJob = async (jobId: string) => {
  const snap = await db
    .collection("CandidateAnswer")
    .where("jobId", "==", jobId)
    .get();
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
};

export const getCandidateAnswersByCandidate = async (jobId: string, candidateId: string) => {
  const snap = await db
    .collection("CandidateAnswer")
    .where("jobId", "==", jobId)
    .where("candidateId", "==", candidateId)
    .limit(1)
    .get();
  if (snap.empty) throw new Error("Aucune réponse trouvée");
  const doc = snap.docs[0];
  return { id: doc.id, ...doc.data() };
};

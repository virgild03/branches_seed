import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

admin.initializeApp();
const db = admin.firestore();

// Correction automatique d’une réponse
export const correctAnswer = functions.firestore
  .document("Answers/{answerId}")
  .onCreate(async (snap, context) => {
    const answer = snap.data();
    if (!answer) return;

    if (answer.corrected) return "Already corrected";

    const qSnap = await answer.questionId.get();
    if (!qSnap.exists) return;

    const question = qSnap.data();
    if (!question) return;

    let score = 0;

    if (answer.type === "QCM") {
      const correct = question.correctAnswer;
      if (
        answer.selectedOption &&
        correct &&
        answer.selectedOption === correct
      ) {
        score = 1;
      }
    } else if (answer.type === "CodingQuestion") {
      const candidateOutput = answer.value?.trim();
      const expectedOutput = question.expectedOutput?.trim();
      if (candidateOutput && expectedOutput && candidateOutput === expectedOutput) {
        score = 1;
      }
    }

    await snap.ref.update({
      score,
      corrected: true,
    });
  });

// Mise à jour du score global d’un test après soumission
export const updateCandidateScore = functions.firestore
  .document("CandidateAnswer/{docId}")
  .onUpdate(async (change, context) => {
    const after = change.after.data();
    if (!after.answers || after.answers.length === 0) return;

    let sum = 0;

    for (const ref of after.answers) {
      try {
        const snap = await ref.get();
        if (!snap.exists) continue;
        const data = snap.data();
        if (data?.corrected) {
          sum += data.score || 0;
        }
      } catch (e) {
        console.warn("Erreur lecture answer:", e);
      }
    }

    await change.after.ref.update({
      score: sum,
    });
  });

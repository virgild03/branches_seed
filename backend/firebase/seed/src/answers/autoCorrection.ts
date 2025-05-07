import { db, DocumentReference } from "../db";
import { executeCodeInSandbox } from "../sandbox/runInSanbox";

/* ---------- QCM ---------- */
export const QCMCorrection = async (answerRef: DocumentReference) => {
  const answerSnap = await answerRef.get();
  if (!answerSnap.exists) throw new Error("Cette réponse n'existe pas");

  const { selectedOption, questionId } = answerSnap.data() as {
    selectedOption: string;
    questionId: DocumentReference;
  };

  const questionSnap = await questionId.get();
  if (!questionSnap.exists) throw new Error("Cette question n'existe pas");

  const { acceptedAnswer, score } = questionSnap.data() as {
    acceptedAnswer: string;
    score: number;
  };

  const isCorrect = selectedOption === acceptedAnswer;

  await answerRef.update({
    corrected: true,
    isCorrect,
    score: isCorrect ? score : 0,
  });
};

/* ---------- OpenQuestion (mise à zéro) ---------- */
const OpenQuestionCorrection = async (answerRef: DocumentReference) => {
  await answerRef.update({ corrected: false, score: 0 });
};

/* ---------- Coding ---------- */
export const correctCodingAnswer = async (answerRef: DocumentReference) => {
  const answerSnap = await answerRef.get();
  if (!answerSnap.exists) throw new Error("Réponse introuvable");

  const { value: candidateCode, questionId } = answerSnap.data() as {
    value: string;
    questionId: DocumentReference;
  };

  const questionSnap = await questionId.get();
  if (!questionSnap.exists) throw new Error("Question introuvable");

  const { input, expectedOutput, language, score } = questionSnap.data() as {
    input: string;
    expectedOutput: string;
    language: string;
    score: number;
  };

  let candidateOutput = "";
  let isCorrect = false;
  try {
    candidateOutput = await executeCodeInSandbox(candidateCode, language, input);
    isCorrect = candidateOutput.trim() === expectedOutput.trim();
  } catch {
    /* exécution en erreur ⇒ isCorrect = false */
  }

  await answerRef.update({
    corrected: true,
    isCorrect,
    score: isCorrect ? score : 0,
    candidateOutput,
    output: candidateOutput,
  });
};

/* ---------- Dispatcher ---------- */
export const correctAnswer = async (answerRef: DocumentReference) => {
  const { type } = (await answerRef.get()).data() as { type: string };
  if (type === "QCM")          return QCMCorrection(answerRef);
  if (type === "OpenQuestion") return OpenQuestionCorrection(answerRef);
  return correctCodingAnswer(answerRef);
};

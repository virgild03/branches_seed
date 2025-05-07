import { db } from "../db";
import { correctCodingAnswer, QCMCorrection } from "./autoCorrection";
import { autoCorrectChallengeAnswer } from "./correctChallenge";

(async () => {
  const codingRef = db.doc("Answers/answer_c_1");
  await correctCodingAnswer(codingRef);

  const qcmRef = db.doc("Answers/ans1");
  await QCMCorrection(qcmRef);

  // const challRef = db.doc("CandidateAnswer/candAnswer1");
  // await autoCorrectChallengeAnswer(challRef);
})();

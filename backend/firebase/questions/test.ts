
// runTests.ts

import {getQuestionIdsByFilters, getQuestionIds,getQuestionIdsByTags, getQuestionsByDifficulty , getQuestionIdsByDifficulty, getQuestionIdsByType} from "../questions/getQuestions";
import { Difficulty, Type } from "../../commun/types/firebase";

const runTests = async () => {
  console.log("=== Test getQuestionsIds ===");
  const all= await getQuestionIds();
  console.log("Résultat:", all);

  console.log("=== Test getQuestionsIdsByTags ===");
  const tagQuestions = await getQuestionIdsByTags(['JavaScript']);
  console.log("Résultat:", tagQuestions);

  console.log("=== Test getQuestionsIdsByDifficulty ===");
  const questions = await getQuestionIdsByDifficulty(Difficulty.FACILE);
  console.log("Résultat:", questions);

  console.log("\n=== Test getQuestionsByDifficulty ===");
  const easyQuestions = await getQuestionsByDifficulty(Difficulty.FACILE);
  console.log("Résultat:", easyQuestions);

  console.log("\n=== Test getQuestionsByType ===");
  const qcm = await getQuestionIdsByType(Type.QCM);
  console.log("Résultat:", qcm);

  console.log("\n=== Test getQuestionsByFilter ===");
  const filter = await getQuestionIdsByFilters(["JavaScript", "Types"], [Difficulty.FACILE],[Type.QCM]);
  console.log("Résultat:", filter);


};

runTests().catch(console.error);

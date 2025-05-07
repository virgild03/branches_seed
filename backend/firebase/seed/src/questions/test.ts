import {
  getQuestionIdsByFilters,
  getQuestionIds,
  getQuestionIdsByTags,
  getQuestionsByDifficulty,
  getQuestionIdsByDifficulty,
  getQuestionIdsByType,
} from "./getQuestions";
import { Difficulty, Type } from "../../commun/types/firebase";

(async () => {
  console.log("all :", await getQuestionIds());
  console.log("tags:", await getQuestionIdsByTags(["JavaScript"]));
  console.log("diff:", await getQuestionIdsByDifficulty(Difficulty.FACILE));
  console.log("diffQ:", await getQuestionsByDifficulty(Difficulty.FACILE));
  console.log("type:", await getQuestionIdsByType(Type.QCM));
  console.log("mix :", await getQuestionIdsByFilters(
    ["JavaScript", "Types"], [Difficulty.FACILE], [Type.QCM]));
})();

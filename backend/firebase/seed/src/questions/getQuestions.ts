import { db } from "../db";
import * as types from "../commun/types/firebase";


const toQuestion = (data: any): types.Question => {
  switch (data.type) {
    case "QCM":
      return new types.QCM(data.id, data.description, data.options,
                           data.acceptedAnswer, data.duration, data.score,
                           data.tags, data.difficulty);
    case "OpenQuestion":
      return new types.OpenQuestion(data.id, data.description,
                                    data.duration, data.score,
                                    data.topics, data.difficulty);
    case "CodingQuestion":
      return new types.CodingQuestion(data.id, data.language,
                                      data.description, data.expectedOutput,
                                      data.duration, data.score,
                                      data.topics, data.difficulty);
    default: throw new Error(`Type inconnu : ${data.type}`);
  }
};

/* ---------- helpers génériques ---------- */
const ids = (snap: FirebaseFirestore.QuerySnapshot) => snap.docs.map((d) => d.id);

/* ---------- requêtes ---------- */
export const getQuestionIds     = async () =>
  ids(await db.collection("exercise").get());

export const getQuestionIdsByTags = async (tags: string[]) =>
  ids(await db.collection("exercise").where("tags", "array-contains-any", tags).get());

export const getQuestionIdsByDifficulty = async (d: types.Difficulty) =>
  ids(await db.collection("exercise").where("difficulty", "==", d).get());

export const getQuestionIdsByType = async (t: types.Type) =>
  ids(await db.collection("exercise").where("type", "==", t).get());

export const getQuestionsByTags = async (tags: string[]) =>
  (await db.collection("exercise").where("tags", "array-contains-any", tags).get())
    .docs.map((d) => toQuestion(d.data()));

export const getQuestionsByDifficulty = async (d: types.Difficulty) =>
  (await db.collection("exercise").where("difficulty", "==", d).get())
    .docs.map((d) => toQuestion(d.data()));

/* ---------- mix & match ---------- */
export const getQuestionIdsByFilters = async (
  tags?: string[],
  diff?: types.Difficulty[],
  type?: types.Type[]
) => {
  let idsSet = new Set<string>();

  if (tags?.length) (await getQuestionIdsByTags(tags)).forEach((id) => idsSet.add(id));
  if (diff?.length)
    for (const d of diff)
      (await getQuestionIdsByDifficulty(d)).forEach((id) => idsSet.add(id));
  if (type?.length)
    for (const t of type)
      (await getQuestionIdsByType(t)).forEach((id) => idsSet.add(id));

  return [...idsSet];
};

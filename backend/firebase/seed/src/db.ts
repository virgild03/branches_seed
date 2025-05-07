import * as admin from "firebase-admin";
import { getFirestore, FieldValue } from "firebase-admin/firestore";

if (!admin.apps.length) {
  admin.initializeApp();          // lit les creds Cloud Functions
}

export const db  = getFirestore();
export { FieldValue };
export type DocumentReference<T = FirebaseFirestore.DocumentData> =
  FirebaseFirestore.DocumentReference<T>;

import { initializeApp, getApps, cert } from "firebase-admin/app";
import { getDatabase } from "firebase-admin/database";

if (!getApps().length) {
  initializeApp({
    credential: cert(JSON.parse(process.env.FIREBASE_ADMIN_KEY as string)),
    databaseURL: process.env.FIREBASE_DB_URL,
  });
}

export const db = getDatabase();

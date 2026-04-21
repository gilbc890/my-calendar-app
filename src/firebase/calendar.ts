import { db } from "@/firebase/config";
import { ref, set, get } from "firebase/database";

export async function saveMemo(date: string, data: any) {
  await set(ref(db, `calendar/${date}`), data);
}

export async function getMemo(date: string) {
  const snapshot = await get(ref(db, `calendar/${date}`));
  return snapshot.val();
}

export async function getAllMemos() {
  const snapshot = await get(ref(db, "calendar"));
  return snapshot.val() || {};
}

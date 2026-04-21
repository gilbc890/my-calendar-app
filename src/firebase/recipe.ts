import { db } from "@/firebase/config";
import { ref, set, get, remove } from "firebase/database";

// 레시피 저장
export async function saveRecipe(recipeId: string, data: any) {
  await set(ref(db, `recipes/${recipeId}`), data);
}

// 전체 레시피 불러오기
export async function getAllRecipes() {
  const snapshot = await get(ref(db, "recipes"));
  return snapshot.val() || {};
}

// 특정 레시피 불러오기
export async function getRecipe(id: string) {
  const snapshot = await get(ref(db, `recipes/${id}`));
  return snapshot.val();
}

// 🔥 레시피 삭제
export async function deleteRecipe(id: string) {
  await remove(ref(db, `recipes/${id}`));
}

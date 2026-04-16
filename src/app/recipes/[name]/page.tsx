"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Recipe = {
  name: string;
  thumbnail?: string;
  ingredients?: string;
  description?: string;
};

export default function RecipeDetail({ params }: { params: { name: string } }) {
  const router = useRouter();
  const [recipe, setRecipe] = useState<Recipe | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem("recipes");
    if (!saved) return;

    const list: Recipe[] = JSON.parse(saved);

    const decodedName = decodeURIComponent(params.name);

    const found = list.find((r) => r.name === decodedName);

    setRecipe(found || null);
  }, [params.name]);

  if (!recipe) {
    return (
      <div style={{ padding: 20 }}>
        <button onClick={() => router.back()}>← 뒤로가기</button>
        <p>레시피를 찾을 수 없습니다.</p>
      </div>
    );
  }

  return (
    <div style={{ padding: 20 }}>
      <button onClick={() => router.back()}>← 뒤로가기</button>

      <h1>{recipe.name}</h1>

      {recipe.thumbnail && (
        <img
          src={recipe.thumbnail}
          style={{ width: "100%", borderRadius: 12, marginBottom: 20 }}
        />
      )}

      {recipe.ingredients && (
        <>
          <h3>재료</h3>
          <p>{recipe.ingredients}</p>
        </>
      )}

      {recipe.description && (
        <>
          <h3>설명</h3>
          <p style={{ whiteSpace: "pre-line" }}>{recipe.description}</p>
        </>
      )}
    </div>
  );
}

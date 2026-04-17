"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Recipe = {
  name: string;
  thumbnail?: string;
  ingredients?: string;
  description?: string;
};

export default function RecipeDetail({ params }: { params: Promise<{ name: string }> }) {
  const router = useRouter();

  // 🔥 Next.js 15에서는 params가 Promise → 반드시 use()로 풀어야 함
  const { name } = use(params);
  const decodedName = decodeURIComponent(name);

  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("recipes");
    if (saved) {
      const list: Recipe[] = JSON.parse(saved);
      const found = list.find((r) => r.name === decodedName);
      if (found) setRecipe(found);
    }
    setLoaded(true);
  }, [decodedName]);

  if (!loaded) {
    return <div style={{ padding: 20 }}>불러오는 중...</div>;
  }

  if (!recipe) {
    return (
      <div style={{ padding: 20 }}>
        <button onClick={() => router.back()}>← 뒤로가기</button>
        <h1>{decodedName}</h1>
        <p style={{ marginTop: 10, color: "#888" }}>
          이 기기에는 이 레시피의 상세 정보가 없습니다.
        </p>
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
          style={{
            width: "100%",
            borderRadius: 12,
            margin: "20px 0",
            objectFit: "cover",
          }}
        />
      )}

      {recipe.ingredients && (
        <>
          <h3>재료</h3>
          <p style={{ whiteSpace: "pre-line" }}>{recipe.ingredients}</p>
        </>
      )}

      {recipe.description && (
        <>
          <h3 style={{ marginTop: 20 }}>설명</h3>
          <p style={{ whiteSpace: "pre-line" }}>{recipe.description}</p>
        </>
      )}
    </div>
  );
}

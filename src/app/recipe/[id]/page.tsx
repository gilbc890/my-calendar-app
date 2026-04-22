"use client";

import { useEffect, useState, use } from "react";
import { getRecipe } from "@/firebase/recipe";

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default function RecipeDetailPage({ params }: PageProps) {
  const { id } = use(params);

  const [recipe, setRecipe] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      if (!id) return;

      const data = await getRecipe(id);
      setRecipe(data);
      setLoading(false);
    };

    load();
  }, [id]);

  if (loading) return <div style={{ padding: 24 }}>Loading...</div>;

  if (!recipe) {
    return (
      <div style={{ padding: 24 }}>
        <h2 style={{ fontSize: 22, marginBottom: 12 }}>레시피를 찾을 수 없습니다.</h2>
        <p style={{ fontSize: 16, color: "#666" }}>id: {id}</p>
      </div>
    );
  }

  return (
    <div
      style={{
        padding: 24,
        maxWidth: 720,
        margin: "0 auto",
        lineHeight: 1.7,
        fontFamily: "Inter, sans-serif",
      }}
    >
      {/* 제목 */}
      <h1
        style={{
          fontSize: 28,
          fontWeight: 700,
          marginBottom: 20,
        }}
      >
        {recipe.name}
      </h1>

      {/* 썸네일 */}
      {recipe.thumbnail && (
        <img
          src={recipe.thumbnail}
          alt={recipe.name}
          style={{
            width: "100%",
            maxWidth: 300,      // 🔥 최대 크기 제한
            height: "auto",
            borderRadius: 12,
            margin: "0 auto 24px", // 🔥 가운데 정렬 + 아래 여백
            display: "block",
            objectFit: "cover",
          }}
        />
      )}

      {/* 재료 */}
      <section
        style={{
          padding: 20,
          borderRadius: 12,
          marginBottom: 28,
          border: "1px solid #eee",
        }}
      >
        <h2
          style={{
            fontSize: 20,
            fontWeight: 600,
            marginBottom: 12,
          }}
        >
          🥕 Ingredients
        </h2>

        <pre
          style={{
            whiteSpace: "pre-wrap",
            fontSize: 16,
            lineHeight: 1.7,
            margin: 0,
          }}
        >
          {recipe.ingredients}
        </pre>
      </section>

      {/* 설명 */}
      <section
        style={{
          padding: 20,
          borderRadius: 12,
          border: "1px solid #eee",
        }}
      >
        <h2
          style={{
            fontSize: 20,
            fontWeight: 600,
            marginBottom: 12,
          }}
        >
          🍳 Description
        </h2>

        <pre
          style={{
            whiteSpace: "pre-wrap",
            fontSize: 16,
            lineHeight: 1.7,
            margin: 0,
          }}
        >
          {recipe.description}
        </pre>
      </section>
    </div>
  );
}

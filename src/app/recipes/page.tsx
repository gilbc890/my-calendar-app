"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

type Recipe = {
  name: string;
  thumbnail?: string;
  ingredients?: string;
  description?: string;
};

export default function RecipesPage() {
  const router = useRouter();
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [name, setName] = useState("");
  const [thumbnail, setThumbnail] = useState("");
  const [ingredients, setIngredients] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem("recipes");
    if (saved) setRecipes(JSON.parse(saved));
  }, []);

  const handleAdd = () => {
    if (!name.trim()) return;

    const newRecipes = [
      ...recipes,
      {
        name: name.trim(),
        thumbnail: thumbnail || undefined,
        ingredients,
        description,
      },
    ];

    setRecipes(newRecipes);
    localStorage.setItem("recipes", JSON.stringify(newRecipes));

    setName("");
    setThumbnail("");
    setIngredients("");
    setDescription("");
  };

  const handleDelete = (name: string) => {
    const newRecipes = recipes.filter((r) => r.name !== name);
    setRecipes(newRecipes);
    localStorage.setItem("recipes", JSON.stringify(newRecipes));
  };

  return (
    <div style={{ padding: 20, maxWidth: 500, margin: "0 auto" }}>
      <h1 style={{ marginBottom: 20 }}>레시피 등록</h1>

      <button
        onClick={() => router.push("/")}
        style={{
          marginBottom: 20,
          padding: "6px 10px",
          borderRadius: 8,
          border: "1px solid #ccc",
          background: "white",
          cursor: "pointer",
        }}
      >
        ← 캘린더로 돌아가기
      </button>

      <input
        placeholder="레시피 이름"
        value={name}
        onChange={(e) => setName(e.target.value)}
        style={{ width: "100%", padding: 10, marginBottom: 10 }}
      />

      <input
        placeholder="썸네일 이미지 URL (선택)"
        value={thumbnail}
        onChange={(e) => setThumbnail(e.target.value)}
        style={{ width: "100%", padding: 10, marginBottom: 10 }}
      />

      <textarea
        placeholder="재료 (선택)"
        value={ingredients}
        onChange={(e) => setIngredients(e.target.value)}
        style={{ width: "100%", padding: 10, marginBottom: 10, height: 80 }}
      />

      <textarea
        placeholder="설명 (선택)"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        style={{ width: "100%", padding: 10, marginBottom: 10, height: 80 }}
      />

      <button
        onClick={handleAdd}
        style={{
          width: "100%",
          padding: 12,
          background: "#7A3FFF",
          color: "white",
          border: "none",
          borderRadius: 8,
          cursor: "pointer",
          marginBottom: 20,
        }}
      >
        레시피 추가
      </button>

      <h2>등록된 레시피</h2>

      {recipes.map((r) => (
        <div
          key={r.name}
          style={{
            display: "flex",
            alignItems: "center",
            padding: "10px 0",
            borderBottom: "1px solid #eee",
          }}
        >
          {r.thumbnail && (
            <img
              src={r.thumbnail}
              style={{
                width: 50,
                height: 50,
                borderRadius: 8,
                objectFit: "cover",
                marginRight: 10,
              }}
            />
          )}

          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 600 }}>{r.name}</div>
            {r.ingredients && (
              <div style={{ fontSize: 12, color: "#666" }}>
                재료: {r.ingredients}
              </div>
            )}
          </div>

          <button
            onClick={() => handleDelete(r.name)}
            style={{
              background: "red",
              color: "white",
              border: "none",
              padding: "6px 10px",
              borderRadius: 6,
              cursor: "pointer",
            }}
          >
            삭제
          </button>
        </div>
      ))}
    </div>
  );
}

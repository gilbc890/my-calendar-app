"use client";

import { useEffect, useState } from "react";

type Recipe = {
  name: string;
  thumbnail?: string;
  ingredients?: string;
  description?: string;
};

export default function RecipesPage() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [name, setName] = useState("");
  const [thumbnail, setThumbnail] = useState("");
  const [ingredients, setIngredients] = useState("");
  const [description, setDescription] = useState("");

  // 처음 로드 시 localStorage에서 불러오기
  useEffect(() => {
    const saved = localStorage.getItem("recipes");
    if (saved) {
      try {
        setRecipes(JSON.parse(saved));
      } catch {
        setRecipes([]);
      }
    }
  }, []);

  // 레시피 추가
  const handleAdd = () => {
    if (!name.trim()) {
      alert("레시피 이름은 필수입니다.");
      return;
    }

    const newRecipe: Recipe = {
      name: name.trim(),
      thumbnail: thumbnail.trim() || undefined,
      ingredients: ingredients.trim() || undefined,
      description: description.trim() || undefined,
    };

    const updated = [...recipes, newRecipe];

    localStorage.setItem("recipes", JSON.stringify(updated));
    setRecipes(updated);

    setName("");
    setThumbnail("");
    setIngredients("");
    setDescription("");
  };

  // 레시피 삭제
  const handleDelete = (recipeName: string) => {
    const updated = recipes.filter((r) => r.name !== recipeName);
    setRecipes(updated);
    localStorage.setItem("recipes", JSON.stringify(updated));
  };

  return (
    <div style={{ padding: 20, maxWidth: 480, margin: "0 auto" }}>
      <h1 style={{ marginBottom: 16 }}>레시피 등록</h1>

      <div style={{ marginBottom: 16 }}>
        <label>레시피 이름 *</label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="예: 김치찌개"
          style={{
            width: "100%",
            padding: 8,
            marginTop: 4,
            borderRadius: 8,
            border: "1px solid #ccc",
          }}
        />
      </div>

      <div style={{ marginBottom: 16 }}>
        <label>썸네일 이미지 URL (선택)</label>
        <input
          value={thumbnail}
          onChange={(e) => setThumbnail(e.target.value)}
          placeholder="이미지 주소"
          style={{
            width: "100%",
            padding: 8,
            marginTop: 4,
            borderRadius: 8,
            border: "1px solid #ccc",
          }}
        />
      </div>

      <div style={{ marginBottom: 16 }}>
        <label>재료 (선택)</label>
        <textarea
          value={ingredients}
          onChange={(e) => setIngredients(e.target.value)}
          placeholder="예: 돼지고기, 김치, 대파..."
          style={{
            width: "100%",
            padding: 8,
            marginTop: 4,
            borderRadius: 8,
            border: "1px solid #ccc",
            minHeight: 60,
          }}
        />
      </div>

      <div style={{ marginBottom: 16 }}>
        <label>설명 (선택)</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="레시피 설명"
          style={{
            width: "100%",
            padding: 8,
            marginTop: 4,
            borderRadius: 8,
            border: "1px solid #ccc",
            minHeight: 80,
          }}
        />
      </div>

      <button
        onClick={handleAdd}
        style={{
          width: "100%",
          padding: 10,
          background: "#7A3FFF",
          color: "white",
          border: "none",
          borderRadius: 8,
          cursor: "pointer",
          marginBottom: 20,
        }}
      >
        레시피 저장
      </button>

      <h2 style={{ marginBottom: 8 }}>등록된 레시피</h2>

      {recipes.length === 0 && (
        <p style={{ color: "#888" }}>아직 등록된 레시피가 없습니다.</p>
      )}

      {recipes.map((r) => (
        <div
          key={r.name}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "8px 0",
            borderBottom: "1px solid rgba(0,0,0,0.1)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center" }}>
            {r.thumbnail && (
              <img
                src={r.thumbnail}
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 8,
                  objectFit: "cover",
                  marginRight: 10,
                }}
              />
            )}
            <div>
              <div style={{ fontWeight: 600 }}>{r.name}</div>
              {r.ingredients && (
                <div style={{ fontSize: 12, color: "#888" }}>
                  {r.ingredients.slice(0, 30)}
                  {r.ingredients.length > 30 ? "..." : ""}
                </div>
              )}
            </div>
          </div>

          {/* 삭제 버튼 */}
          <button
            onClick={() => handleDelete(r.name)}
            style={{
              background: "transparent",
              border: "none",
              color: "#ff3b30",
              fontSize: 20,
              cursor: "pointer",
            }}
          >
            ❌
          </button>
        </div>
      ))}
    </div>
  );
}
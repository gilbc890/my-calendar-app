"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { saveRecipe } from "@/firebase/recipe";

export default function AddRecipePage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [ingredients, setIngredients] = useState("");
  const [description, setDescription] = useState("");
  const [thumbnail, setThumbnail] = useState("");

  const makeSafeId = (text: string) => {
    return text
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim();
  };

  const handleSave = async () => {
    if (!name.trim()) {
      alert("Please enter a recipe name.");
      return;
    }

    const id = makeSafeId(name);

    await saveRecipe(id, {
      id,
      name,
      ingredients,
      description,
      thumbnail,
      createdAt: Date.now(),
    });

    router.push("/recipe");
  };

  // ✅ 입력칸 공통 스타일
  const fieldStyle: React.CSSProperties = {
    width: "100%",
    padding: 16,
    marginTop: 12,
    borderRadius: 12,
    border: "1px solid #ccc",
    fontSize: 16,
    lineHeight: 1.5,
    boxSizing: "border-box",
  };

  return (
    <div
      style={{
        padding: 24,
        maxWidth: 480,
        margin: "0 auto",
        boxSizing: "border-box",
      }}
    >
      {/* Back to Recipe List */}
      <button
        onClick={() => router.push("/recipe")}
        style={{
          marginBottom: 24,
          padding: "10px 14px",
          borderRadius: 10,
          border: "1px solid #7A3FFF",
          background: "#7A3FFF",
          color: "white",
          cursor: "pointer",
        }}
      >
        ← Back to Recipe List
      </button>

      <h2 style={{ marginBottom: 20 }}>Add Recipe</h2>

      {/* Name */}
      <input
        placeholder="Recipe Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        style={fieldStyle}
      />

      {/* Ingredients */}
      <textarea
        placeholder="Ingredients (line breaks allowed)"
        value={ingredients}
        onChange={(e) => setIngredients(e.target.value)}
        style={{
          ...fieldStyle,
          minHeight: 150,
          fontSize: 15,
        }}
      />

      {/* Description */}
      <textarea
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        style={{
          ...fieldStyle,
          minHeight: 200,
          fontSize: 15,
        }}
      />

      {/* Thumbnail */}
      <input
        placeholder="Thumbnail Image URL (optional)"
        value={thumbnail}
        onChange={(e) => setThumbnail(e.target.value)}
        style={{
          ...fieldStyle,
          fontSize: 15,
        }}
      />

      {/* ✅ Save 버튼: fieldStyle 그대로 + 색만 덮어쓰기 */}
      <button
        onClick={handleSave}
        style={{
          ...fieldStyle,
          marginTop: 24,
          background: "#7A3FFF",
          color: "white",
          border: "1px solid #7A3FFF",
          fontWeight: 500,
          cursor: "pointer",
        }}
      >
        Save
      </button>
    </div>
  );
}

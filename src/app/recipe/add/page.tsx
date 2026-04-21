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

  // 🔥 저장할 때 특수문자/이모티콘 제거해서 id 생성
  const makeSafeId = (text: string) => {
    return text
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")   // 이모티콘/특수문자 제거
      .replace(/\s+/g, "-")       // 공백 → 하이픈
      .replace(/-+/g, "-")        // 중복 하이픈 제거
      .trim();
  };

  const handleSave = async () => {
    if (!name.trim()) {
      alert("레시피 이름을 입력해주세요.");
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

  return (
    <div
      style={{
        padding: 24,
        maxWidth: 480,
        margin: "0 auto",
      }}
    >
      {/* 🔙 레시피 목록으로 */}
      <button
        onClick={() => router.push("/recipe")}
        style={{
          marginBottom: 24,
          padding: "10px 14px",
          borderRadius: 10,
          border: "1px solid #ccc",
          background: "white",
          cursor: "pointer",
        }}
      >
        ← 레시피 목록으로
      </button>

      <h2 style={{ marginBottom: 20 }}>레시피 추가</h2>

      {/* 이름 */}
      <input
        placeholder="레시피 이름"
        value={name}
        onChange={(e) => setName(e.target.value)}
        style={{
          width: "100%",
          padding: 16,
          marginTop: 12,
          borderRadius: 12,
          border: "1px solid #ccc",
          fontSize: 16,
        }}
      />

      {/* 재료 */}
      <textarea
        placeholder="재료 (줄바꿈 가능)"
        value={ingredients}
        onChange={(e) => setIngredients(e.target.value)}
        style={{
          width: "100%",
          padding: 16,
          marginTop: 12,
          borderRadius: 12,
          border: "1px solid #ccc",
          minHeight: 150,
          fontSize: 15,
          lineHeight: 1.5,
        }}
      />

      {/* 설명 */}
      <textarea
        placeholder="설명"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        style={{
          width: "100%",
          padding: 16,
          marginTop: 12,
          borderRadius: 12,
          border: "1px solid #ccc",
          minHeight: 200,
          fontSize: 15,
          lineHeight: 1.5,
        }}
      />

      {/* 썸네일 */}
      <input
        placeholder="썸네일 이미지 URL (선택)"
        value={thumbnail}
        onChange={(e) => setThumbnail(e.target.value)}
        style={{
          width: "100%",
          padding: 16,
          marginTop: 12,
          borderRadius: 12,
          border: "1px solid #ccc",
          fontSize: 15,
        }}
      />

      {/* 저장 버튼 */}
      <button
        onClick={handleSave}
        style={{
          marginTop: 24,
          width: "100%",
          padding: 16,
          borderRadius: 12,
          border: "none",
          background: "#7A3FFF",
          color: "white",
          fontSize: 17,
          cursor: "pointer",
        }}
      >
        저장
      </button>
    </div>
  );
}

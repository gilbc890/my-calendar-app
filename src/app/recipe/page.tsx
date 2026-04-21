"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getAllRecipes, deleteRecipe } from "@/firebase/recipe";

export default function RecipeListPage() {
  const router = useRouter();
  const [recipes, setRecipes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const data = await getAllRecipes();

      const list = Object.entries(data).map(([id, recipe]: any) => ({
        id,
        ...recipe,
      }));

      setRecipes(list);
      setLoading(false);
    };

    load();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("정말 삭제할까요?")) return;

    await deleteRecipe(id);

    setRecipes((prev) => prev.filter((r) => r.id !== id));
  };

  if (loading) return <div style={{ padding: 20 }}>Loading...</div>;

  return (
    <div style={{ padding: 20 }}>
      {/* 🔙 캘린더로 돌아가기 */}
      <button
        onClick={() => router.push("/")}
        style={{
          marginBottom: 20,
          padding: "8px 12px",
          borderRadius: 8,
          border: "1px solid #ccc",
          background: "white",
          cursor: "pointer",
        }}
      >
        ← 캘린더로 돌아가기
      </button>

      <h2 style={{ marginBottom: 20 }}>레시피 목록</h2>

      <button
        onClick={() => router.push("/recipe/add")}
        style={{
          marginBottom: 20,
          padding: "10px 14px",
          borderRadius: 8,
          border: "none",
          background: "#7A3FFF",
          color: "white",
          cursor: "pointer",
          width: "100%",
        }}
      >
        ➕ 레시피 추가
      </button>

      {recipes.length === 0 && <p>등록된 레시피가 없습니다.</p>}

      {recipes.map((r) => (
        <div
          key={r.id}
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "12px 14px",
            borderRadius: 10,
            background: "var(--modal-bg)",
            color: "var(--modal-text)",
            marginBottom: 12,
            boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
          }}
        >
          {/* 레시피 이름 클릭 → 상세페이지 */}
          <div
            onClick={() => router.push(`/recipe/${r.id}`)}
            style={{
              cursor: "pointer",
              fontWeight: 600,
              flex: 1,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {r.name}
          </div>

          {/* 삭제 버튼 */}
          <button
            onClick={() => handleDelete(r.id)}
            style={{
              marginLeft: 10,
              padding: "6px 10px",
              borderRadius: 6,
              border: "none",
              background: "#FF4D4D",
              color: "white",
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

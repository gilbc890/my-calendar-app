"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import "react-calendar/dist/Calendar.css";
import "./apple-calendar.css";

import { getAllMemos, getMemo, saveMemo } from "@/firebase/calendar";
import { getAllRecipes } from "@/firebase/recipe";

type MemoData = {
  recipeId: string;
  recipeName: string;
  todo: string;
};

type Recipe = {
  id: string;
  name: string;
  thumbnail?: string;
  ingredients?: string;
  description?: string;
};

const Calendar = dynamic(() => import("react-calendar"), { ssr: false });

export default function Home() {
  const router = useRouter();

  const [date, setDate] = useState(new Date());
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<"view" | "add">("view");
  const [recipeSelectOpen, setRecipeSelectOpen] = useState(false);

  const [recipeId, setRecipeId] = useState("");   // 🔥 추가
  const [recipeName, setRecipeName] = useState("");
  const [todo, setTodo] = useState("");

  const [memos, setMemos] = useState<Record<string, MemoData>>({});
  const [recipes, setRecipes] = useState<Recipe[]>([]);

  // 🔥 Firebase에서 전체 메모 + 레시피 불러오기
  useEffect(() => {
    const load = async () => {
      const memoData = await getAllMemos();
      setMemos(memoData);

      const recipeData = await getAllRecipes();

      // 🔥 id 포함해서 배열로 변환
      const list = Object.entries(recipeData).map(([id, recipe]: any) => ({
        id,
        ...recipe,
      }));

      setRecipes(list);
    };
    load();
  }, []);

  // 🔥 날짜 클릭 → Firebase에서 해당 날짜 메모 불러오기
  const handleDayClick = async (selectedDate: Date) => {
    setDate(selectedDate);

    const key = selectedDate.toISOString().split("T")[0];
    const memo = await getMemo(key);

    if (memo) {
      setRecipeId(memo.recipeId);
      setRecipeName(memo.recipeName);
      setTodo(memo.todo);
    } else {
      setRecipeId("");
      setRecipeName("");
      setTodo("");
    }

    setMode("view");
    setOpen(true);
  };

  // 🔥 저장 → Firebase에 저장
  const handleSave = async () => {
    const key = date.toISOString().split("T")[0];

    const newMemo = { recipeId, recipeName, todo };

    await saveMemo(key, {
      recipeId,
      recipeName,
      todo,
    });

    // 화면 즉시 반영
    setMemos({
      ...memos,
      [key]: newMemo,
    });

    setMode("view");
  };

  const key = date.toISOString().split("T")[0];
  const hasMemo = !!memos[key];

  return (
    <div
      style={{
        padding: 20,
        maxWidth: 420,
        margin: "0 auto",
        minHeight: "100vh",
        background: "var(--bg)",
        color: "var(--text)",
      }}
    >
      <h1 style={{ textAlign: "center", marginBottom: 20 }}>
        My Recipe Calendar
      </h1>

      {/* 레시피 관리 버튼 */}
      <button
        onClick={() => router.push("/recipe")}
        style={{
          position: "fixed",
          bottom: 20,
          right: 20,
          width: 55,
          height: 55,
          borderRadius: "50%",
          background: "#C8A2FF",
          color: "white",
          border: "none",
          fontSize: 28,
          cursor: "pointer",
          boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
          zIndex: 999,
        }}
      >
        ➕
      </button>

      {/* 🔥 캘린더 tileContent → Firebase 데이터 표시 */}
      <Calendar
        onClickDay={handleDayClick}
        value={date}
        tileContent={({ date }) => {
          const key = date.toISOString().split("T")[0];
          const memo = memos[key];
          if (!memo) return null;

          return (
            <div
              style={{
                marginTop: 4,
                fontSize: 10,
                textAlign: "center",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {memo.recipeName}
            </div>
          );
        }}
      />

      {/* 🔥 날짜 모달 */}
      {open && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.4)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 900,
          }}
          onClick={() => setOpen(false)}
        >
          <div
            style={{
              background: "var(--modal-bg)",
              color: "var(--modal-text)",
              padding: 20,
              borderRadius: 12,
              width: "80%",
              maxWidth: 350,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 style={{ marginBottom: 10 }}>{date.toDateString()}</h2>

            {mode === "view" && (
              <>
                {hasMemo ? (
                  <>
                    <p
                      style={{
                        cursor: "pointer",
                        textDecoration: "underline",
                        marginBottom: 8,
                      }}
                      onClick={() => {
                        const memo = memos[key];
                        console.log("memo click:", memo);

                        if (!memo) return;

                        // recipeId가 없으면 일단 경고라도 띄우자
                        if (!memo.recipeId) {
                          alert("이 메모에는 recipeId가 저장되어 있지 않습니다.");
                          return;
                        }

                        router.push(`/recipe/${memo.recipeId}`);
                      }}
                    >
                      🍱 레시피: {memos[key].recipeName}
                    </p>

                    <p>📝 할 일: {memos[key].todo}</p>
                  </>
                ) : (
                  <p style={{ color: "#8e8e93" }}>메모 없음</p>
                )}

                <button
                  onClick={() => setRecipeSelectOpen(true)}
                  style={{
                    marginTop: 15,
                    width: "100%",
                    padding: 10,
                    background: "#7A3FFF",
                    color: "white",
                    border: "none",
                    borderRadius: 8,
                    cursor: "pointer",
                  }}
                >
                  레시피 선택해서 추가
                </button>
              </>
            )}

            {mode === "add" && (
              <>
                <p>선택한 레시피: {recipeName}</p>
                <input
                  placeholder="할 일"
                  value={todo}
                  onChange={(e) => setTodo(e.target.value)}
                  style={{
                    width: "100%",
                    padding: 10,
                    marginTop: 10,
                    borderRadius: 8,
                    border: "1px solid #ccc",
                  }}
                />
                <button
                  onClick={handleSave}
                  style={{
                    marginTop: 15,
                    width: "100%",
                    padding: 10,
                    background: "#7A3FFF",
                    color: "white",
                    border: "none",
                    borderRadius: 8,
                    cursor: "pointer",
                  }}
                >
                  저장
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {/* 🔥 레시피 선택 모달 */}
      {recipeSelectOpen && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.4)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 950,
          }}
          onClick={() => setRecipeSelectOpen(false)}
        >
          <div
            style={{
              background: "var(--modal-bg)",
              color: "var(--modal-text)",
              padding: 20,
              borderRadius: 12,
              width: "80%",
              maxWidth: 350,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 style={{ marginBottom: 10 }}>레시피 선택</h3>

            {recipes.length === 0 && (
              <p style={{ color: "#888" }}>등록된 레시피가 없습니다.</p>
            )}

            {recipes.map((r) => (
              <div
                key={r.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  padding: "8px 0",
                  cursor: "pointer",
                }}
                onClick={() => {
                  setRecipeName(r.name);
                  setRecipeId(r.id);   // 🔥 이제 정상 작동
                  setRecipeSelectOpen(false);
                  setMode("add");
                }}
              >
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
                <span>{r.name}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

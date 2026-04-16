"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import "react-calendar/dist/Calendar.css";
import "./apple-calendar.css";

type Recipe = {
  name: string;
  thumbnail?: string;
  ingredients?: string;
  description?: string;
};

type MemoData = {
  recipeName: string;
  todo: string;
};

const Calendar = dynamic(() => import("react-calendar"), { ssr: false });

export default function Home() {
  const router = useRouter();

  const [date, setDate] = useState(new Date());
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<"view" | "add">("view");
  const [recipeSelectOpen, setRecipeSelectOpen] = useState(false);

  const [recipeName, setRecipeName] = useState("");
  const [todo, setTodo] = useState("");

  const [memos, setMemos] = useState<Record<string, MemoData>>({});
  const [recipes, setRecipes] = useState<Recipe[]>([]);

  // 메모/레시피 불러오기
  useEffect(() => {
    const savedMemos = localStorage.getItem("memos");
    if (savedMemos) setMemos(JSON.parse(savedMemos));

    const savedRecipes = localStorage.getItem("recipes");
    if (savedRecipes) setRecipes(JSON.parse(savedRecipes));
  }, []);

  const handleDayClick = (selectedDate: Date) => {
    setDate(selectedDate);
    const key = selectedDate.toISOString().split("T")[0];
    const memo = memos[key];

    if (memo) {
      setRecipeName(memo.recipeName);
      setTodo(memo.todo);
    } else {
      setRecipeName("");
      setTodo("");
    }

    setMode("view");
    setOpen(true);
  };

  const handleSave = () => {
    const key = date.toISOString().split("T")[0];

    const newMemos = {
      ...memos,
      [key]: { recipeName, todo },
    };

    setMemos(newMemos);
    localStorage.setItem("memos", JSON.stringify(newMemos));

    setMode("view");
  };

  const key = date.toISOString().split("T")[0];
  const hasMemo = !!memos[key];

  return (
    <div style={{ padding: 20, maxWidth: 420, margin: "0 auto" }}>
      <h1 style={{ textAlign: "center", marginBottom: 20 }}>My Recipe Calendar</h1>

      {/* 오른쪽 아래 레시피 관리 버튼 (레시피 페이지로 이동) */}
      <button
        onClick={() => router.push("/recipes")}
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
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        ➕
      </button>

      <Calendar
        onClickDay={handleDayClick}
        value={date}
        className="apple-calendar"
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

      {/* 보기/추가 모달 */}
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
              background: "white",
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
                    {/* 레시피 이름 클릭 → 상세 페이지로 이동 */}
                    <p
                      style={{
                        cursor: "pointer",
                        textDecoration: "underline",
                        marginBottom: 8,
                      }}
                      onClick={() => {
                        const memo = memos[key];
                        if (!memo) return;
                        router.push(`/recipe/${encodeURIComponent(memo.recipeName)}`);
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

      {/* 레시피 선택 모달 */}
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
              background: "white",
              padding: 20,
              borderRadius: 12,
              width: "80%",
              maxWidth: 350,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 style={{ marginBottom: 10 }}>레시피 선택</h3>

            {recipes.length === 0 && (
              <p style={{ color: "#8e8e93" }}>등록된 레시피가 없습니다.</p>
            )}

            {recipes.map((r) => (
              <div
                key={r.name}
                style={{
                  display: "flex",
                  alignItems: "center",
                  padding: "8px 0",
                  cursor: "pointer",
                }}
                onClick={() => {
                  setRecipeName(r.name);
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

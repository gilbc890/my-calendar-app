"use client";

import dynamic from "next/dynamic";
import { useState, useEffect } from "react";
import { auth, login, logout } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/navigation";
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

  // 🔥 로그인 상태
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    return onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
  }, []);

  const [date, setDate] = useState(new Date());
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<"view" | "add">("view");
  const [recipeSelectOpen, setRecipeSelectOpen] = useState(false);

  const [recipeId, setRecipeId] = useState("");
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

    await saveMemo(key, newMemo);

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
        My Meal Planner
      </h1>

      {/* 로그인 버튼 (로그인 안 했을 때만) */}
      {!user && (
        <div style={{ textAlign: "center", marginBottom: 20 }}>
          <button
            onClick={login}
            style={{
              position: "fixed",
              bottom: 20,
              right: 20,
              width: 55,
              height: 55,
              borderRadius: "50%",
              background: "#DB4437",
              color: "white",
              border: "none",
              fontSize: 22,
              cursor: "pointer",
              boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
              zIndex: 999,
            }}
          >
            👤
          </button>
        </div>
      )}
      {/* 로그인 후 버튼 (로그인 했을 때만) */}
      {user && (
      <button
        onClick={logout}
        style={{
          position: "fixed",
          bottom: 20,
          left: 20,
          width: 55,
          height: 55,
          borderRadius: "50%",
          background: "white",
          border: "2px solid #DB4437",
          cursor: "pointer",
          padding: 0,
          overflow: "hidden",
          boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
          zIndex: 999,
        }}
      >
        <img
          src={user.photoURL}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />
      </button>
    )}


      {/* 🔥 로그인해야만 기능 버튼 보임 */}
      {user && (
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
      )}

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

      {/* 🔥 로그인 안 했으면 모달보기만 가능 */}
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
                        if (!memo) return;
                        if (!memo.recipeId) {
                          alert("이 메모에는 recipeId가 없습니다.");
                          return;
                        }
                        router.push(`/recipe/${memo.recipeId}`);
                      }}
                    >
                      🍱 Recipe: {memos[key].recipeName}
                    </p>

                    <p>📝 To-do: {memos[key].todo}</p>
                  </>
                ) : (
                  <p style={{ color: "#8e8e93" }}>No notes</p>
                )}

                {user && (
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
                    Select a recipe to add
                  </button>
                )}
              </>
            )}

            {mode === "add" && (
              <>
                <p>Selected recipe: {recipeName}</p>
                <div
                  style={{
                    width: "100%",
                    display: "flex",
                    flexDirection: "column",
                    gap: 10,
                    marginTop: 10,
                  }}
                >
                  <input
                    placeholder="To-do"
                    value={todo}
                    onChange={(e) => setTodo(e.target.value)}
                    style={{
                      width: "100%",
                      height: 45,
                      padding: "0 12px",
                      borderRadius: 8,
                      border: "1px solid #ccc",
                      fontSize: 16,
                      boxSizing: "border-box",
                    }}
                  />
                  <button
                    onClick={handleSave}
                    style={{
                      width: "100%",
                      height: 45,
                      background: "#7A3FFF",
                      color: "white",
                      border: "none",
                      borderRadius: 8,
                      cursor: "pointer",
                      fontSize: 16,
                      fontWeight: 600,
                    }}
                  >
                    Save
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* 🔥 레시피 선택 모달 (로그인한 경우만) */}
      {recipeSelectOpen && user && (
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
            <h3 style={{ marginBottom: 10 }}>Select a recipe</h3>

            {recipes.length === 0 && (
              <p style={{ color: "#888" }}>No recipes available</p>
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
                  setRecipeId(r.id);
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

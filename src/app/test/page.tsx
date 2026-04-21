"use client";

import { db } from "@/firebase/config";
import { ref, set, get } from "firebase/database";
import { useState } from "react";

export default function TestPage() {
  const [value, setValueState] = useState("");

  const writeData = async () => {
    await set(ref(db, "test/message"), "hello firebase!");
    alert("저장 완료");
  };

  const readData = async () => {
    const snapshot = await get(ref(db, "test/message"));
    setValueState(snapshot.val());
  };

  return (
    <div style={{ padding: 20 }}>
      <button onClick={writeData}>쓰기</button>
      <button onClick={readData}>읽기</button>

      <div style={{ marginTop: 20 }}>읽은 값: {value}</div>
    </div>
  );
}

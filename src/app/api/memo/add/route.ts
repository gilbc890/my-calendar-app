import { NextResponse } from "next/server";
import { getAuth } from "firebase-admin/auth";
import { db } from "@/lib/firebaseAdmin";

export async function POST(req: Request) {
  const { idToken, memo } = await req.json();

  // 1) 로그인 토큰 검증
  const decoded = await getAuth().verifyIdToken(idToken);

  // 2) 인증된 사용자만 DB 접근
  await db.ref(`memos/${decoded.uid}`).push(memo);

  return NextResponse.json({ ok: true });
}

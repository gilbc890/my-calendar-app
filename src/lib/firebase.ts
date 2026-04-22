import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { app } from "@/firebase/config";  // 🔥 config.ts의 app 재사용

export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();

export const login = () => signInWithPopup(auth, provider);
export const logout = () => auth.signOut();

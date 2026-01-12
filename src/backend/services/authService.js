import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { auth } from "../config/firebase";

// SIGN UP USER
export const signupUser = async (email, password) => {
  const userCredential = await createUserWithEmailAndPassword(
    auth,
    email,
    password
  );
  return userCredential.user;
};

// LOGIN USER
export const loginUser = async (email, password) => {
  const userCredential = await signInWithEmailAndPassword(
    auth,
    email,
    password
  );
  return userCredential.user;
};

// LOGOUT USER
export const logoutUser = async () => {
  await signOut(auth);
};
/* ======================
   AUTH STATE TRACKER (STEP-6)
====================== */
export const trackAuthState = () => {
  onAuthStateChanged(auth, (user) => {
    if (user) {
      console.log("✅ LOGGED IN");
      console.log("UID:", user.uid);
      console.log("Email:", user.email);
    } else {
      console.log("❌ LOGGED OUT");
    }
  });
};

// reset Password

export const resetPassword = async (email) => {
  if (!email) {
    throw new Error("Email is required");
  }
  await sendPasswordResetEmail(auth, email);
};

import { signupUser, loginUser, logoutUser } from "../services/authService";

/* 🔹 TEST SIGNUP */
export const testSignup = async () => {
  try {
    const user = await signupUser("testuser@gmail.com", "Test@123");
    console.log("Signup success:", user.uid);
  } catch (err) {
    console.error("Signup failed:", err.message);
  }
};

/* 🔹 TEST LOGIN */
export const testLogin = async () => {
  try {
    const user = await loginUser("testuser@gmail.com", "Test@123");
    console.log("Login success:", user.uid);
  } catch (err) {
    console.error("Login failed:", err.message);
  }
};

/* 🔹 TEST LOGOUT */
export const testLogout = async () => {
  await logoutUser();
  console.log("Logged out");
};

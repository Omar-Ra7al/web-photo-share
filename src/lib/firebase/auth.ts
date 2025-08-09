import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
} from "firebase/auth";
import app from "./config"; // your firebase config

// Initialize Firebase Auth
const auth = getAuth(app);

// Create Google provider
const provider = new GoogleAuthProvider();

// Sign in with Google popup
export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, provider);
    // You can get user info from result.user
    return result.user;
  } catch (error) {
    console.error("Google Sign-In Error:", error);
    throw error;
  }
};

// Sign out user
export const signOutUser = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error("Sign-Out Error:", error);
    throw error;
  }
};

export { auth };

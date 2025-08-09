import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import app from "./config"; // your firebase config
import { FirebaseError } from "firebase/app";

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

// Sign Up with email and password
export const signUpUser = async (email: string, password: string) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    await signOutUser(); // Make sure to await if it's async
    return userCredential.user;
  } catch (error: unknown) {
    if (error instanceof FirebaseError) {
      return Promise.reject({
        code: error.code,
        message: error.message,
      });
    }
  }
};

// Sign in with email and password
export const signInUser = async (email: string, password: string) => {
  await signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // Signed up
      return userCredential.user;
    })
    .catch((error) => {
      return Promise.reject({
        code: error.code,
        message: error.message,
      });
    });
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

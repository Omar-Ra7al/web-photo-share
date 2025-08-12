import { auth, db } from "./config";
import {
  signInWithPopup,
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  deleteUser,
  reauthenticateWithCredential,
  EmailAuthProvider,
  reauthenticateWithPopup,
  updateProfile,
  UserProfile,
} from "firebase/auth";
import { doc, deleteDoc } from "firebase/firestore";
import { FirebaseError } from "firebase/app";
import { createUserDocProfile } from "./fireStore";

// Sign Up with email and password
export const signUpUser = async (
  email: string,
  password: string,
  firstName: string,
  lastName: string
) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    // Signed up
    const user = userCredential.user;

    // Add display name to the user profile
    await updateProfile(user, {
      displayName: `${firstName} ${lastName}`,
    });

    // Store in Firestore
    await createUserDocProfile(user.uid, {
      firstName: user.displayName?.split(" ")[0] || firstName,
      lastName: user.displayName?.split(" ")[1] || lastName,
      email: user.email!,
      role: "user",
    });
    // Sign out the user after sign up
    await signOutUser();
    return user;
  } catch (error: unknown) {
    if (error instanceof FirebaseError) {
      return Promise.reject({
        code: error.code,
        message: error.message,
      });
    }
  }
};

// Sign up and Sign in with Google popup
export const signInWithGoogle = async () => {
  // Create Google provider
  const provider = new GoogleAuthProvider();
  try {
    const result = await signInWithPopup(auth, provider);
    // You can get user info from result.user
    const user = result.user;
    await createUserDocProfile(user.uid, {
      firstName: user.displayName?.split(" ")[0] || "First",
      lastName: user.displayName?.split(" ")[1] || "Last",
      email: user.email || "",
      role: "user",
    });

    return result.user;
  } catch (error) {
    console.error("Google Sign-In Error:", error);
    throw error;
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

export const updateUserProfile = async (data: Partial<UserProfile>) => {
  const user = auth.currentUser;
  if (!user) throw new Error("No authenticated user found.");

  // Update profile (displayName, photoURL, etc.)
  await updateProfile(user, { ...data });
};
// Reauthenticate user before deleting account
export const reauthenticateUser = async () => {
  const user = auth.currentUser;
  if (user) {
    const providerId = user.providerData[0]?.providerId;
    if (!providerId) throw new Error("No provider data found.");

    if (providerId === "password") {
      const password = prompt("Enter your password:");
      if (!password) throw new Error("Password is required.");
      const credential = EmailAuthProvider.credential(user.email!, password);
      await reauthenticateWithCredential(user, credential);
    } else if (providerId === "google.com") {
      const provider = new GoogleAuthProvider();
      await reauthenticateWithPopup(user, provider);
    } else {
      throw new Error(`Unsupported provider: ${providerId}`);
    }
    console.log("Re-authentication successful.");
  }
};

// Delete user account and it's own document
export const deleteUserAccount = async () => {
  const user = auth.currentUser;
  await reauthenticateUser();
  await deleteDoc(doc(db, "users", user!.uid));
  await deleteUser(user!);
  console.log("User account deleted successfully.");
  return true;
};

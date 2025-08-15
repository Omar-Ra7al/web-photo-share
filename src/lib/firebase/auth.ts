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

import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { showError, showSuccess } from "@/utils/notifications";
import { promptPassword } from "@/components/shared/style/promptPassword";
// Sign Up with email and password
export const signUpUser = async (
  email: string,
  password: string,
  firstName: string,
  lastName: string,
  router?: AppRouterInstance
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
    await signOutUser(false);
    console.log("Navigate to login page", router);
    showSuccess("Signed up successfully! Please log in.", router, "/login");
    return user;
  } catch (error: unknown) {
    showError("Sign Up failed. Please check your credentials.");
    if (error instanceof FirebaseError) {
      return Promise.reject({
        code: error.code,
        message: error.message,
      });
    }
  }
};

// Sign up and Sign in with Google popup
export const signInWithGoogle = async (router?: AppRouterInstance) => {
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
    showSuccess("Logged in successfully!", router, "/");
    return result.user;
  } catch (error) {
    showError("Sign In failed. Please check your credentials.");
    throw error;
  }
};

// Sign in with email and password
export const signInUser = async (
  email: string,
  password: string,
  router?: AppRouterInstance
) => {
  await signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // Signed up
      showSuccess("Logged in successfully!", router, "/");
      return userCredential.user;
    })
    .catch((error) => {
      showError("Sign In failed. Please check your credentials.");
      return Promise.reject({
        code: error.code,
        message: error.message,
      });
    });
};

// Sign out user
export const signOutUser = async (
  showNotification = true,
  router?: AppRouterInstance
) => {
  try {
    await signOut(auth);
    if (showNotification) showSuccess("Logged out successfully!", router, "/");
  } catch (error) {
    if (showNotification) showError("Sign Out failed.");
    console.error("Unexpected error:", error);
  }
};

export const updateUserProfile = async (data: Partial<UserProfile>) => {
  const user = auth.currentUser;
  if (!user) {
    showError("User not found.");
  } else {
    // Update profile (displayName, photoURL, etc.)
    await updateProfile(user, { ...data });
    const updatedFields = Object.keys(data).join(", ");
    showSuccess(`Updated successfully! Updated: ${updatedFields}`);
  }
};

// Reauthenticate user before deleting account
export const reauthenticateUser = async () => {
  const user = auth.currentUser;
  if (user) {
    const providerId = user.providerData[0]?.providerId;
    if (!providerId) throw new Error("No provider data found.");

    if (providerId === "password") {
      const password = await promptPassword();
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
export const deleteUserAccount = async (router?: AppRouterInstance) => {
  try {
    const user = auth.currentUser;
    if (user) {
      await reauthenticateUser();
      await deleteDoc(doc(db, "users", user.uid));
      await deleteUser(user);
      showSuccess("Account deleted successfully!", router, "/");
    }
  } catch (error) {
    showError("Failed to delete account.");
    if (error instanceof Error) {
      console.error(error.message);
    } else {
      console.error("Unexpected error:", error);
    }
  }
};

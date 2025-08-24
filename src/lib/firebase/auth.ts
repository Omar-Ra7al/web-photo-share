import { auth, db } from "./config";
import { doc, deleteDoc } from "firebase/firestore";
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
  sendPasswordResetEmail,
  sendEmailVerification,
  verifyBeforeUpdateEmail,
  updatePassword,
  linkWithCredential,
} from "firebase/auth";
import { FirebaseError } from "firebase/app";
import { createUserDocProfile, updateUserDocProfile } from "./fireStore";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { promptPassword } from "@/components/shared/style/promptPassword";
import { showError, showSuccess } from "@/utils/notifications";
import { uploadImageToStorage } from "./storage";
import { uploadProfilePicture } from "./services/userService";

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
      photoURL: user.photoURL || "",
      role: "user",
    });
    showSuccess("Logged in successfully!", router, "/");
    return result.user;
  } catch (error) {
    showError("Sign In failed. Please check your credentials.");
    throw error;
  }
};

export const linkGoogleUserToEmail = async (password: string) => {
  const user = auth.currentUser;
  if (!user) return;
  try {
    await reauthenticateUser();

    const credential = EmailAuthProvider.credential(user.email!, password);

    await linkWithCredential(user, credential);

    await sendEmailVerification(user);

    showSuccess("Email/Password linked successfully!");
  } catch (error) {
    showError("Link failed. Please check your credentials.");
    if (error instanceof Error) {
      console.error(error.message);
    } else {
      console.error("Unexpected error:", error);
    }
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
      if (userCredential.user.emailVerified === false) {
        // Store in Firestore
        showError("Please verify your email first.");
        sendUserEmailVerification();
      } else {
        console.log("User signed in:", userCredential.user);
        showSuccess("Logged in successfully!", router, "/");
        return userCredential.user;
      }
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

// Update user profile
export const updateUserProfile = async (data: Partial<UserProfile>) => {
  const user = auth.currentUser;
  if (user) {
    const providerId = user.providerData
      .map((provider) => provider.providerId)
      .includes("password");

    let updatedFields: Partial<UserProfile> = {};
    const updatedFieldsKeys = [];
    for (const key in data) {
      if (data[key] !== "") {
        updatedFieldsKeys.push(key);
        updatedFields = {
          displayName: `${
            data.firstName ? data.firstName : user.displayName?.split(" ")[0]
          } ${data.lastName ? data.lastName : user.displayName?.split(" ")[1]}`,
        };
      }
    }

    // Update user profile
    await updateProfile(user, updatedFields);

    // Update user document

    // Update first name
    if (data.firstName && typeof data.firstName === "string") {
      // Update first name
      await updateUserDocProfile({
        firstName: data.firstName,
      });
    }

    // Update last name
    if (data.lastName && typeof data.lastName === "string") {
      // Update last name
      await updateUserDocProfile({
        lastName: data.lastName,
      });
    }

    // Update email
    if (data.email && typeof data.email === "string") {
      // Update email
      if (providerId) {
        await reauthenticateUser();
        await verifyBeforeUpdateEmail(user, data.email);
        await updateUserDocProfile({
          email: data.email,
        });
        showSuccess("Please check it email box to verify your new email.");
      } else {
        showError("You are not logged in with a password provider.");
      }
    }

    // Update password
    if (data.password && typeof data.password === "string") {
      if (providerId) {
        await reauthenticateUser();
        await updatePassword(user!, data.password);
      } else {
        showError("You are not logged in with a password provider.");
      }
    }

    // Update photo URL
    if (
      data.photoURL &&
      data.photoURL instanceof File &&
      typeof data.photoURL !== "string"
    ) {
      await uploadProfilePicture(data.photoURL);
    }

    showSuccess(
      `Profile updated successfully (${updatedFieldsKeys.join(", ")}).`
    );
  } else {
    showError("User not found.");
  }
};

// verify user email
export const sendUserEmailVerification = async () => {
  const user = auth.currentUser;
  if (user) {
    await sendEmailVerification(user);
    showSuccess("Verification email sent! Please check your inbox.");
  } else {
    showError("User not found.");
  }
};

// Reset user password
export const resetUserPassword = async (email: string) => {
  if (!email) {
    showError("Please enter your email address.");
    return;
  }

  try {
    await sendPasswordResetEmail(auth, email);
    showSuccess("Password reset email sent! Please check your inbox.");
  } catch (error) {
    if (error instanceof Error) {
      console.error("Password reset error:", error.message);
      showError(error.message);
    } else {
      console.error("Unexpected error:", error);
      showError("Something went wrong. Please try again.");
    }
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

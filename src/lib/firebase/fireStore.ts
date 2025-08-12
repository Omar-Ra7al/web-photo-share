import { db, auth } from "./config";
import {
  doc,
  setDoc,
  getDoc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { UserProfile } from "firebase/auth";
// Custom Types >>
import { UserProfileInfo } from "@/types/global";

export const createUserDocProfile = async (
  uid: string,
  profileData: Omit<UserProfile, "createdAt">
) => {
  if (uid) {
    const userRef = doc(db, "users", uid);
    await setDoc(userRef, {
      ...profileData,
      createdAt: serverTimestamp(),
    });
  }
  return null;
};

export const updateUserDocProfile = async (
  profileData: Partial<UserProfile>
) => {
  const user = auth.currentUser;
  if (user) {
    const userRef = doc(db, "users", user.uid);
    await updateDoc(userRef, {
      ...profileData,
    });
  }
  return null;
};

export const getUserDocData = async () => {
  const user = auth.currentUser;
  if (user) {
    const userRef = doc(db, "users", user.uid);
    const userDoc = await getDoc(userRef);
    if (userDoc.exists()) {
      return {
        ...userDoc.data(),
      } as UserProfileInfo;
    }
  }
  return null;
};

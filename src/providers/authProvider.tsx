"use client";
import { useEffect } from "react";
// Firebase imports
import app from "@/lib/firebase/config";
import { onAuthStateChanged, getAuth } from "firebase/auth";
// Zustand store for auth state
import { useAuthStore } from "@/lib/store/authStore";
// Function to get user document data
import { getUserDocData } from "@/lib/firebase/fireStore";

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const setUser = useAuthStore((state) => state.setUser);
  const clearUser = useAuthStore((state) => state.clearUser);
  const setLoading = useAuthStore((state) => state.setLoading);

  useEffect(() => {
    // Initialize Firebase Auth and listen for auth state changes
    const auth = getAuth(app);

    // Subscribe to auth state changes
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        console.log("AuthProvider initialized", "user signed in", firebaseUser);

        // Set the user in the Zustand store and update loading state
        const userProfile = await getUserDocData();
        if (userProfile) {
          setUser(userProfile);
          setLoading(false);
        }
      } else {
        console.log(
          "User signed out or not authenticated",
          "usrer: ",
          firebaseUser
        );

        // Clear the user in the Zustand store and update loading state
        clearUser();
        setLoading(false);
      }
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, [setUser, clearUser, setLoading]);

  return <>{children}</>;
}

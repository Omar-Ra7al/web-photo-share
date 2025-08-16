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
  const getUser = useAuthStore((state) => state.getUser);
  const clearUser = useAuthStore((state) => state.clearUser);
  const setLoading = useAuthStore((state) => state.setLoading);

  // Subscribe to auth state changes
  useEffect(() => {
    // Initialize Firebase Auth and listen for auth state changes
    const auth = getAuth(app);

    // Check if the user is already signed in
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // Set the user in the Zustand store and update loading state
        console.log("User signed in", "usrer: ", firebaseUser);
        const userProfile = await getUserDocData();
        if (userProfile) {
          setUser({
            ...userProfile,
            emailProvider: firebaseUser.providerData.map(
              (provider) => provider.providerId
            ),
          });
          getUser();
          setLoading(false);
        }
      } else {
        console.log(
          "User signed out or not authenticated",
          "usrer: ",
          firebaseUser
        );
        setLoading(false);
        // Clear the user in the Zustand store and update loading state
        clearUser();
      }
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, [setUser, clearUser, setLoading]);

  return <>{children}</>;
}

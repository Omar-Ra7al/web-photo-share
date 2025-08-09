"use client";
import { useEffect } from "react";
// Firebase imports
import app from "@/lib/firebase/config";
import { onAuthStateChanged, getAuth } from "firebase/auth";
// Zustand store
import { useAuthStore } from "@/lib/store/authStore";

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const setUser = useAuthStore((state) => state.setUser);
  const clearUser = useAuthStore((state) => state.clearUser);
  const setLoading = useAuthStore((state) => state.setLoading);

  useEffect(() => {
    const auth = getAuth(app);
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        console.log("AuthProvider initialized", "user signed in", firebaseUser);
        // Set the user in the Zustand store
        // and update loading state
        setUser(firebaseUser);
        setLoading(false);
      } else {
        console.log(
          "User signed out or not authenticated",
          "usrer: ",
          firebaseUser
        );

        // Clear the user in the Zustand store
        // and update loading state
        clearUser();
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [setUser, clearUser, setLoading]);

  return <>{children}</>;
}

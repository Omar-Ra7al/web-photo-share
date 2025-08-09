"use client";
import { useAuthStore } from "@/lib/store/authStore";
import SignInWithGoogle from "@/components/auth/signInWithGoogle";
import LogOutButton from "@/components/auth/signOut";

const AuthActionButton = () => {
  const user = useAuthStore((state) => state.user);
  const loading = useAuthStore((state) => state.loading);

  if (loading) {
    return <div>Loading...</div>;
  }
  return user ? <LogOutButton /> : <SignInWithGoogle />;
};

export default AuthActionButton;

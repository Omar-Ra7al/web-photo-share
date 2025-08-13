"use client";
import { useAuthStore } from "@/lib/store/authStore";
import UserProfile from "./userProfile";
import LoginSingUpBtns from "../../../auth/buttons/loginSingUpBtns";

const AuthActionButton = () => {
  const user = useAuthStore((state) => state.user);
  const loading = useAuthStore((state) => state.loading);

  if (loading) {
    return <div className="h-full w-[60px]"></div>;
  }
  return user ? <UserProfile /> : <LoginSingUpBtns />;
};

export default AuthActionButton;

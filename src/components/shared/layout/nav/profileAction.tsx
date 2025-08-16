"use client";
import { useAuthStore } from "@/lib/store/authStore";
import UserProfile from "./userProfile";
import LoginSingUpBtns from "@/components/auth/buttons/signInSingUpBtns";
import { motion } from "motion/react";

const AuthActionButton = () => {
  const user = useAuthStore((state) => state.user);
  const loading = useAuthStore((state) => state.loading);

  if (loading) {
    return <div className="h-full w-[60px]">loading..</div>;
  }
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      {user ? <UserProfile /> : <LoginSingUpBtns />}
    </motion.div>
  );
};

export default AuthActionButton;

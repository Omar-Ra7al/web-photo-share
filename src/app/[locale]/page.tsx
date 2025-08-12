"use client";
import AuthActionButton from "@/components/auth/authActionButton";
import DeleteAccButton from "@/components/auth/deleteAccButton";
import UpdateProfile from "@/components/auth/updateProfile";
import { useAuthStore } from "@/lib/store/authStore";
export default function Home() {
  const user = useAuthStore((state) => state.user);
  const loading = useAuthStore((state) => state.loading);
  return (
    <div className="font-sans flex flex-col items-center justify-center min-h-screen gap-15">
      <div>
        <h1 className="text-2xl font-bold bg-red-700">
          {loading ? "Loading..." : `Welcome, ${user?.firstName}`}
        </h1>
        <UpdateProfile />
      </div>
      <AuthActionButton />
      <DeleteAccButton />
    </div>
  );
}

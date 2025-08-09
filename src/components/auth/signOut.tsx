"use client";
import { signOutUser } from "@/lib/firebase/auth";
export default function LogOutButton() {
  return (
    <button className="btn btn-primary bg-red-800" onClick={signOutUser}>
      <span>Log out</span>
    </button>
  );
}

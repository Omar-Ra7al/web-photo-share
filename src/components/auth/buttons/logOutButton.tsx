"use client";
import { InteractiveHoverButton } from "@/components/magicui/interactive-hover-button";
import { signOutUser } from "@/lib/firebase/auth";
export default function LogOutButton() {
  return (
    <InteractiveHoverButton
      bg="bg-red-600"
      textColor="text-white"
      className="w-full"
      onClick={signOutUser}
    >
      <span>Log out</span>
    </InteractiveHoverButton>
  );
}

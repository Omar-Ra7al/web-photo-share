"use client";
import { InteractiveHoverButton } from "@/components/magicui/interactive-hover-button";
import { signOutUser } from "@/lib/firebase/auth";
import { useRouter } from "next/navigation";
export default function LogOutButton() {
  const router = useRouter();
  return (
    <InteractiveHoverButton
      bg="bg-red-600"
      textColor="text-white"
      className="w-full"
      onClick={() => {
        signOutUser(router);
      }}
    >
      <span>Log out</span>
    </InteractiveHoverButton>
  );
}

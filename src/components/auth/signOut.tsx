"use client";
import { signOutUser } from "@/lib/firebase/auth";
import { Button } from "@/components/ui/button";
export default function LogOutButton() {
  return (
    <Button variant="destructive" onClick={signOutUser}>
      <span>Log out</span>
    </Button>
  );
}

"use client";
import { signInWithGoogle } from "@/lib/firebase/auth";
import { Button } from "@/components/ui/button";

const SignInWithGoogle = ({ className }: { className?: string }) => {
  return (
    <Button
      className={className}
      variant="secondary"
      onClick={signInWithGoogle}
    >
      Login with Google
    </Button>
  );
};

export default SignInWithGoogle;

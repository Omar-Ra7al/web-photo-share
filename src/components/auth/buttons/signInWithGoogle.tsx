"use client";
import { signInWithGoogle } from "@/lib/firebase/auth";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation"; // ✅ Correct import

const SignInWithGoogle = ({ className }: { className?: string }) => {
  const router = useRouter();
  return (
    <Button
      className={className}
      variant="secondary"
      onClick={() => {
        signInWithGoogle(router);
      }}
    >
      Login with Google
    </Button>
  );
};

export default SignInWithGoogle;

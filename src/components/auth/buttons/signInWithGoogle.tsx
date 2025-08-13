"use client";
import { signInWithGoogle } from "@/lib/firebase/auth";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useRouter } from "next/navigation"; // ✅ Correct import

const SignInWithGoogle = ({ className }: { className?: string }) => {
  const router = useRouter();

  return (
    <Button
      className={className}
      variant="secondary"
      onClick={() => {
        signInWithGoogle()
          .then(() => {
            toast.success("Account Logged in successfully!");
            setTimeout(() => {
              router.push("/");
            }, 1500);
          })
          .catch((error) => {
            toast.error("Login failed. Please check your credentials.", {
              className: "!bg-red-500 text-white",
            });
            if (error instanceof Error) {
              console.error(error.message);
            } else {
              console.error("Unexpected error:", error);
            }
          });
      }}
    >
      Login with Google
    </Button>
  );
};

export default SignInWithGoogle;

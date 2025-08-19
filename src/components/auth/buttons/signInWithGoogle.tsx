import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { signInWithGoogle } from "@/lib/firebase/auth";

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

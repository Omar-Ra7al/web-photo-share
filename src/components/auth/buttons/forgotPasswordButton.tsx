import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";

const ForgotPasswordButton = () => {
  return (
    <Button variant="link" className="w-full h-0">
      <Link href="/forgot-password">Forgot password?</Link>
    </Button>
  );
};

export default ForgotPasswordButton;

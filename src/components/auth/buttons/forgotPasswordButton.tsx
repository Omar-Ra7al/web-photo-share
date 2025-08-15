"use client";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";

const ForgotPasswordButton = () => {
  return (
    <Button variant="link" className="w-full h-0">
      <Link href="/forgot-password">Forgot password?</Link>
    </Button>
  );
};

export default ForgotPasswordButton;

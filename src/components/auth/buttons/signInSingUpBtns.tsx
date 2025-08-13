import React from "react";
import Link from "next/link";
import { RainbowButton } from "@/components/magicui/rainbow-button";

const LoginSingUpBtns = () => {
  return (
    <div className="flex items-center justify-center gap-4">
      <Link
        href="/login"
        className="active:scale-95 transition duration-300 w-[100px] h-full"
      >
        <RainbowButton className="w-full h-full" variant="outline">
          Login
        </RainbowButton>
        {/* Filled button */}
      </Link>
      <Link
        href="/signup"
        className="active:scale-95 transition duration-300 w-[100px] h-full"
      >
        <RainbowButton className="w-full h-full" variant="outline">
          Sign Up
        </RainbowButton>
        {/* Outline button */}
      </Link>
    </div>
  );
};

export default LoginSingUpBtns;

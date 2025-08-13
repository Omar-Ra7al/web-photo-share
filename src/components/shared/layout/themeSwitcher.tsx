"use client";
import { AnimatedThemeToggler } from "@/components/magicui/animated-theme-toggler";
import RippleButton from "@/components/magicui/ripple-button";
export default function AnimatedThemeTogglerDemo() {
  return (
    <RippleButton>
      <AnimatedThemeToggler className="flex items-center justify-center h-full cursor-pointer" />
    </RippleButton>
  );
}

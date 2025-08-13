"use client";

import { Moon, SunDim } from "lucide-react";
import { useState, useRef } from "react";
import { flushSync } from "react-dom";
import { cn } from "@/lib/utils";
import { useTheme } from "@/lib/store/themeStore";

type props = {
  className?: string;
};

export const AnimatedThemeToggler = ({ className }: props) => {
  const setTheme = useTheme((state) => state.setTheme);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(true);
  const spanRef = useRef<HTMLButtonElement | null>(null);
  const changeTheme = async () => {
    if (!spanRef.current) return;

    await document.startViewTransition(() => {
      flushSync(() => {
        const dark = document.documentElement.classList.toggle("dark");
        setTheme(dark ? "dark" : "light");
        setIsDarkMode(dark);
      });
    }).ready;

    const { top, left, width, height } =
      spanRef.current.getBoundingClientRect();
    const y = top + height / 2;
    const x = left + width / 2;

    const right = window.innerWidth - left;
    const bottom = window.innerHeight - top;
    const maxRad = Math.hypot(Math.max(left, right), Math.max(top, bottom));

    document.documentElement.animate(
      {
        clipPath: [
          `circle(0px at ${x}px ${y}px)`,
          `circle(${maxRad}px at ${x}px ${y}px)`,
        ],
      },
      {
        duration: 700,
        easing: "ease-in-out",
        pseudoElement: "::view-transition-new(root)",
      }
    );
  };
  return (
    <span ref={spanRef} onClick={changeTheme} className={cn(className)}>
      {isDarkMode ? <SunDim /> : <Moon />}
    </span>
  );
};

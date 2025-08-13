"use client";

import { usePathname, useRouter } from "next/navigation";
import { Globe } from "lucide-react";
import RippleButton from "@/components/magicui/ripple-button";
export default function LocaleSwitcher() {
  const router = useRouter();
  const pathname = usePathname();

  const currentLocale = pathname.startsWith("/ar") ? "ar" : "en";

  function switchLocale() {
    const newLocale = currentLocale === "en" ? "ar" : "en";
    const newPathname = pathname.replace(`/${currentLocale}`, `/${newLocale}`);
    setTimeout(() => {
      router.push(newPathname);
    }, 300);
  }

  return (
    <RippleButton
      className="flex items-center justify-center min-h-[40px] h-full"
      onClick={switchLocale}
      aria-label={`Switch language to ${
        currentLocale === "en" ? "Arabic" : "English"
      }`}
    >
      <Globe /> {currentLocale === "en" ? "En" : "Ar"}
    </RippleButton>
  );
}

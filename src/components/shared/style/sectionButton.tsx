/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from "@/components/ui/button";
import Link from "next/link";
interface sectionButtonPops {
  text: string;
  href: string;
  className?: string;
  buttonClassName?: string;
  size: "sm" | "md";
  width?: "fit" | "full";
  color?: "primary" | "secondary";
  onClick?: (x?: any) => void;
}
const SectionButton = ({
  text,
  href,
  className,
  buttonClassName,
  size = "md",
  width = "fit",
  color = "primary",
  onClick,
}: sectionButtonPops) => {
  return (
    <Link
      href={href}
      className={`${className} ${width === "fit" ? "w-fit" : "w-full"}`}
    >
      <Button
        className={`${buttonClassName} w-fit ${
          width === "fit" ? "w-fit" : "w-full"
        } py-2 px-6 uppercase rounded-2xl cursor-pointer`}
        size={size === "sm" ? "sm" : "lg"}
        variant={color === "primary" ? "default" : "secondary"}
        onClick={onClick}
      >
        {text}
      </Button>
    </Link>
  );
};

export default SectionButton;

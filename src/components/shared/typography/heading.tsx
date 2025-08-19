import React from "react";

interface HeadingProps {
  size: "sm" | "md" | "lg";
  children: React.ReactNode;
  className?: string;
}

function Heading({ size, children, className }: HeadingProps) {
  return (
    <h1
      className={`
      uppercase text-center
      ${
        size === "sm"
          ? "text-[24px] weight-600"
          : size === "md"
            ? "text-[40px] weight-600"
            : size === "lg"
              ? "text-[64px] weight-700"
              : ""
      }
      ${className}
      `}
    >
      {children}
    </h1>
  );
}

export default Heading;

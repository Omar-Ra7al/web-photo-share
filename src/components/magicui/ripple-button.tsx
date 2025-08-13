"use client";

import React, { useState, useEffect, MouseEvent } from "react";

interface Ripple {
  x: number;
  y: number;
  size: number;
  key: number;
}

interface RippleButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  rippleColor?: string;
  duration?: number; // in ms, not string
}

const RippleButton: React.FC<RippleButtonProps> = ({
  children,
  className = "",
  rippleColor = "rgba(137, 66, 167, 1)",
  duration = 600,
  onClick,
  ...props
}) => {
  const [ripples, setRipples] = useState<Ripple[]>([]);

  const createRipple = (event: MouseEvent<HTMLButtonElement>) => {
    const button = event.currentTarget;
    const rect = button.getBoundingClientRect();

    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;

    const newRipple = { x, y, size, key: Date.now() };

    setRipples((prev) => [...prev, newRipple]);
  };

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    createRipple(event);
    if (onClick) onClick(event);
  };

  useEffect(() => {
    if (ripples.length === 0) return;

    const timeout = setTimeout(() => {
      setRipples((prev) => prev.slice(1));
    }, duration);

    return () => clearTimeout(timeout);
  }, [ripples, duration]);

  return (
    <>
      <button
        {...props}
        onClick={handleClick}
        className={`relative  cursor-pointer flex items-center justify-center gap-1 overflow-hidden rounded-md border px-4 py-2${className}`}
        style={{ position: "relative" }}
      >
        {children}
        <span
          aria-hidden="true"
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            overflow: "hidden",
            pointerEvents: "none",
          }}
        >
          {ripples.map(({ x, y, size, key }) => (
            <span
              key={key}
              className="ripple"
              style={{
                position: "absolute",
                borderRadius: "50%",
                width: size,
                height: size,
                top: y,
                left: x,
                backgroundColor: rippleColor,
                opacity: 0.5,
                transform: "scale(0)",
                animation: `rippleEffect ${duration}ms linear forwards`,
                pointerEvents: "none",
              }}
            />
          ))}
        </span>
      </button>

      <style jsx>{`
        @keyframes rippleEffect {
          to {
            transform: scale(4);
            opacity: 0;
          }
        }
      `}</style>
    </>
  );
};

export default RippleButton;

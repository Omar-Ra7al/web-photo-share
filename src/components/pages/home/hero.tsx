"use client";

import React, { useEffect } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import Section from "@/components/shared/style/section";

const sentence = "Welcome to Your Awesome Website";
const subtitle = "Create beautiful experiences with React and Tailwind CSS.";

export default function Hero() {
  // Motion values for position (x,y) and scale
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const scale = useMotionValue(1);

  // Smooth springs for natural animation
  const smoothX = useSpring(x, { stiffness: 100, damping: 20 });
  const smoothY = useSpring(y, { stiffness: 100, damping: 20 });
  const smoothScale = useSpring(scale, { stiffness: 120, damping: 20 });

  useEffect(() => {
    function handleMouseMove(e: MouseEvent) {
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;

      // Normalize cursor position between -1 and 1
      const offsetX = (e.clientX - centerX) / centerX;
      const offsetY = (e.clientY - centerY) / centerY;

      // Map to movement range, e.g., ±20px
      x.set(offsetX * 20);
      y.set(offsetY * 20);

      // Scale bigger near center, smaller near edges
      const distance = Math.sqrt(offsetX * offsetX + offsetY * offsetY);
      scale.set(1.1 - Math.min(distance, 1) * 0.2);
    }

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [x, y, scale]);

  return (
    <Section
      type="inner"
      className="relative min-h-screen w-full text-center flex flex-col items-center justify-center  overflow-hidden"
    >
      {/* Background blur overlay with position animation */}
      <motion.div className="absolute bottom-0 left-0 w-full h-full backdrop-blur-2xl z-10" />
      {/* Gradient box with position and scale animation */}
      <motion.div
        style={{
          x: smoothX,
          y: smoothY,
          scale: smoothScale,
          willChange: "transform",
        }}
        className="absolute top-1/2 left-1/2 w-[100px] h-[100px] bg-gradient-to-r from-indigo-600 via-purple-700 to-pink-600 -translate-x-1/2 -translate-y-1/2 z-2 "
      />

      <motion.div
        style={{
          x: smoothX,
          y: smoothY,
          scale: smoothScale,
          willChange: "transform",
        }}
        className="absolute top-1/2 left-1/2 w-[800px] h-[500px] rounded-full bg-gradient-to-r from-indigo-600/20 via-purple-700/20 to-pink-600/20 -translate-x-1/2 -translate-y-1/2 z-1"
      />

      {/* Text content (static) */}
      <div className="w-full z-30 flex flex-col items-center justify-center h-full px-4">
        <motion.h1
          className="text-5xl md:text-7xl font-extrabold leading-tight max-w-4xl"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.05 } },
          }}
        >
          {sentence.split("").map((char, index) => (
            <motion.span
              key={index}
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 },
              }}
              className={char === " " ? "mx-1" : ""}
            >
              {char}
            </motion.span>
          ))}
        </motion.h1>

        <motion.p
          className="mt-6 text-lg md:text-xl max-w-xl"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 0.85, y: 0 }}
          transition={{ delay: 1.5, duration: 0.8 }}
        >
          {subtitle}
        </motion.p>

        <motion.div
          className="mt-10"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            delay: 2.3,
            duration: 0.5,
            type: "spring",
            stiffness: 120,
          }}
        >
          <a
            href="#"
            className="inline-block px-8 py-3 bg-white text-indigo-700 font-semibold rounded-lg shadow-lg hover:shadow-2xl hover:bg-indigo-100 transition"
          >
            Get Started
          </a>
        </motion.div>
      </div>
    </Section>
  );
}

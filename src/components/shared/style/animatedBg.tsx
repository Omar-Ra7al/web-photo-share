"use client";

import React, { useEffect } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export default function AnimatedBackground() {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const scale = useMotionValue(1);

  const smoothX = useSpring(x, { stiffness: 200, damping: 10 });
  const smoothY = useSpring(y, { stiffness: 200, damping: 10 });
  const smoothScale = useSpring(scale, { stiffness: 120, damping: 20 });

  // Floating animation
  useEffect(() => {
    let startTime: number;
    function animate(time: number) {
      if (!startTime) startTime = time;
      const progress = (time - startTime) / 1000;
      x.set(Math.sin(progress) * 15);
      y.set(Math.cos(progress / 1.5) * 15);
      scale.set(1 + Math.sin(progress / 2) * 0.05);
      requestAnimationFrame(animate);
    }
    const id = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(id);
  }, [x, y, scale]);

  // Mouse interaction
  useEffect(() => {
    function handleMouseMove(e: MouseEvent) {
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;
      const offsetX = (e.clientX - centerX) / centerX;
      const offsetY = (e.clientY - centerY) / centerY;
      x.set(offsetX * 20);
      y.set(offsetY * 20);
      const distance = Math.sqrt(offsetX ** 2 + offsetY ** 2);
      scale.set(1.1 - Math.min(distance, 1) * 0.2);
    }
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [x, y, scale]);

  const gradient = "linear-gradient(270deg, #4f46e5, #6d28d9, #db2777)";

  return (
    <>
      <motion.div className="absolute bottom-0 left-0 w-full h-full backdrop-blur-2xl z-30" />

      {/* Small core gradient */}
      <motion.div
        style={{
          x: smoothX,
          y: smoothY,
          scale: smoothScale,
          backgroundImage: gradient,
          backgroundSize: "300% 300%",
        }}
        className="absolute top-1/2 left-1/2 w-[100px] h-[100px] rounded-full shadow-2xl shadow-white -translate-x-1/2 -translate-y-1/2 z-20"
        animate={{
          backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "linear",
        }}
      />

      {/* Large soft gradient — now smooth */}
      <motion.div
        style={{
          x: smoothX,
          y: smoothY,
          scale: smoothScale,
        }}
        className="absolute top-1/2 left-1/2 w-[800px] h-[500px] rounded-full opacity-30
             -translate-x-1/2 -translate-y-1/2 z-10"
        animate={{
          backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
          background: [
            "linear-gradient(0deg, #4f46e5, #6d28d9, #db2777)",
            "linear-gradient(180deg, #4f46e5, #6d28d9, #db2777)",
            "linear-gradient(360deg, #4f46e5, #6d28d9, #db2777)",
          ],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "linear",
        }}
      />
    </>
  );
}

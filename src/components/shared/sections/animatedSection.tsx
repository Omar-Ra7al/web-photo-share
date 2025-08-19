"use client";
import { motion } from "framer-motion";

interface AnimatedSectionProps {
  children: React.ReactNode;
  fromX?: string;
  fromY?: string;
  className?: string;
}

const AnimatedSection = ({
  fromX,
  fromY,
  className,
  children,
}: AnimatedSectionProps) => {
  return (
    <motion.div
      initial={{ opacity: 0.5, x: fromX, y: fromY }}
      animate={{ opacity: 1, y: 0, x: 0 }}
      transition={{ duration: 0.5 }}
      className={`w-full ${className} z-50`}
    >
      {children}
    </motion.div>
  );
};

export default AnimatedSection;

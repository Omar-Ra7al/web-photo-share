"use client";

// React & core libraries
import React from "react";
import { motion } from "framer-motion";
import { ChevronRightIcon } from "lucide-react";

// MagicUI components
import { MorphingText } from "@/components/magicui/morphing-text";
import RippleButton from "@/components/magicui/ripple-button";
import { TextAnimate } from "@/components/magicui/text-animate";

// Shared components & styles
import Section from "@/components/shared/sections/section";
import AnimatedBackground from "@/components/shared/style/animatedBg";

const sentence = "Share Your Moments With the World";
const subtitle =
  "Upload, explore, and connect through stunning images Your creativity deserves a global stage";

export default function Hero() {
  return (
    <Section
      type="inner"
      className="relative min-h-screen w-full text-center flex flex-col gap-y-[30px] items-center justify-center overflow-hidden"
    >
      {/* Background */}
      <AnimatedBackground />

      <div className="w-full z-30 flex flex-col gap-y-[30px] items-center justify-center h-full px-4">
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

        <motion.div className=" text-lg md:text-xl max-w-xl">
          <TextAnimate animation="blurInUp" by="word">
            {subtitle}
          </TextAnimate>
        </motion.div>

        <div className="z-50 text-center w-full">
          <MorphingText
            className=""
            texts={["Join 12,000+", "photographers ", "and creators", "today."]}
          />
        </div>

        <motion.div
          className=""
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            delay: 2.3,
            duration: 0.5,
            type: "spring",
            stiffness: 120,
          }}
        >
          <RippleButton className="px-8 py-3">
            <a
              href="#"
              className="inline-blockfont-semibold rounded-lg shadow-lg hover:shadow-2xl transition"
            >
              Browse Gallery
              <ChevronRightIcon className="inline-block ml-2" />
            </a>
          </RippleButton>
        </motion.div>
      </div>
    </Section>
  );
}

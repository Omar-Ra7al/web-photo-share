"use client";
import {
  ScrollVelocityContainer,
  ScrollVelocityRow,
} from "@/components/magicui/scroll-based-velocity";
import Image from "next/image";

const IMAGES_ROW_A = [
  "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=2340&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=2340&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1495562569060-2eec283d3391?q=80&w=2340&auto=format&fit=crop",
];

const IMAGES_ROW_B = [
  "https://images.unsplash.com/photo-1521747116042-5a810fda9664?q=80&w=2340&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=2340&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1495562569060-2eec283d3391?q=80&w=2340&auto=format&fit=crop",
];

export function Gallery() {
  return (
    <div className="relative flex w-full flex-col items-center justify-center overflow-hidden py-8">
      <ScrollVelocityContainer className="w-full">
        <ScrollVelocityRow baseVelocity={6} direction={1} className="py-4">
          {IMAGES_ROW_A.map((src, idx) => (
            <Image
              key={idx}
              src={`${src}&ixlib=rb-4.0.3`}
              alt="Unsplash sample"
              width={340}
              height={260}
              loading="lazy"
              decoding="async"
              className="mx-4 inline-block h-60 w-100 rounded-lg object-cover shadow-sm"
            />
          ))}
        </ScrollVelocityRow>
        <ScrollVelocityRow baseVelocity={6} direction={-1} className="py-4">
          {IMAGES_ROW_B.map((src, idx) => (
            <Image
              key={idx}
              src={`${src}&ixlib=rb-4.0.3`}
              alt="Unsplash sample"
              width={340}
              height={260}
              loading="lazy"
              decoding="async"
              className="mx-4 inline-block h-60 w-100 rounded-lg object-cover shadow-sm"
            />
          ))}
        </ScrollVelocityRow>
      </ScrollVelocityContainer>

      <div className="pointer-events-none absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r from-background"></div>
      <div className="pointer-events-none absolute inset-y-0 right-0 w-1/4 bg-gradient-to-l from-background"></div>
    </div>
  );
}

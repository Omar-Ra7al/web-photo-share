import Hero from "@/components/pages/home/hero";
import { Gallery } from "@/components/pages/home/gallery";
import TestFormPage from "@/components/auth/test-form";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-15">
      <Hero />
      <Gallery />
      <TestFormPage />
    </div>
  );
}

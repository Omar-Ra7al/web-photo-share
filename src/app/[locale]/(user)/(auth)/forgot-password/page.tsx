"use client";
// import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import { CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { resetUserPassword } from "@/lib/firebase/auth";
import MagicCardTheme from "@/components/shared/sections/magicCardTheme";
import Section from "@/components/shared/sections/section";
import Heading from "@/components/shared/typography/heading";

// Zod schema
const logInSchema = z.object({
  email: z.string().email("Invalid email"),
});

// Infer TypeScript types from schema
type LogInFormValues = z.infer<typeof logInSchema>;

export default function LogInForm() {
  //   const router = useRouter();

  // Initialize react-hook-form with zodResolver
  const {
    register, // Connect inputs to form
    handleSubmit, // Form submit handler
    reset, // Reset form fields
    formState: { errors, isSubmitting }, // Validation & state & errors
  } = useForm<LogInFormValues>({
    //Types
    resolver: zodResolver(logInSchema), // Give useForm the resolver from zod
  });

  const onSubmit = async (data: LogInFormValues) => {
    resetUserPassword(data.email);
    reset();
  };

  return (
    <Section type="outer">
      <motion.div
        initial={{ opacity: 0.5, y: "-100%" }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex justify-center items-center w-full h-full"
      >
        <MagicCardTheme className="w-full max-w-sm p-6 rounded-2xl">
          <Heading size="sm" className="mb-6">
            Enter your email
          </Heading>

          <CardContent className="space-y-4">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" {...register("email")} />
                {errors.email && (
                  <p className="text-red-500 text-sm">{errors.email.message}</p>
                )}
              </div>

              {/* Submit */}
              <Button type="submit" disabled={isSubmitting} className="w-full">
                {isSubmitting ? "Submitting" : "Submit"}
              </Button>
            </form>
          </CardContent>
        </MagicCardTheme>
      </motion.div>
    </Section>
  );
}

"use client";
import { motion } from "motion/react";
import { CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { linkGoogleUserToEmail } from "@/lib/firebase/auth";
import { useAuthStore } from "@/lib/store/authStore";
import MagicCardTheme from "@/components/shared/style/magicCardTheme";
import Section from "@/components/shared/style/section";
import Heading from "@/components/shared/style/heading";
import ForgotPasswordButton from "@/components/auth/buttons/forgotPasswordButton";
import { showError } from "@/utils/notifications";
import { Link } from "@/i18n/navigation";

// Zod schema
const updateProfileSchema = z.object({
  password: z
    .string()
    .optional()
    .refine((val) => !val || val.length >= 6, {
      message: "Password must be at least 6 characters",
    }),
});

type LogInFormValues = z.infer<typeof updateProfileSchema>;

export default function UpdateProfile() {
  const user = useAuthStore((state) => state.user);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<LogInFormValues>({
    resolver: zodResolver(updateProfileSchema),
  });

  const onSubmit = async (data: LogInFormValues) => {
    const isEmpty = Object.values(data).every((value) => value === "");
    if (isEmpty) {
      showError("Please fill in at least one field.");
      return;
    }
    await linkGoogleUserToEmail(data.password!);
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
        <MagicCardTheme className="w-full max-w-sm rounded-2xl p-6">
          <Heading size="sm" className="mb-6">
            Link Google Account
          </Heading>

          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-4">
                <Label
                  htmlFor="password"
                  className="flex flex-col items-center justify-center"
                >
                  Set password for the curent email
                  <span className="active">{user?.email}</span>
                </Label>
                <Input
                  id="password"
                  type="password"
                  {...register("password")}
                />
                {errors.password && (
                  <p className="text-red-500 text-sm">
                    {errors.password.message}
                  </p>
                )}
              </div>
              <ForgotPasswordButton />

              {/* Submit */}
              <Button type="submit" disabled={isSubmitting} className="w-full">
                {isSubmitting ? "Linking..." : "Link"}
              </Button>
            </form>
          </CardContent>
        </MagicCardTheme>
      </motion.div>
    </Section>
  );
}

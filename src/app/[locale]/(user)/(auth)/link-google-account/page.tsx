"use client";
// 📦 External libraries
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

// 🎨 UI components (shadcn/ui)
import { CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

// 🧩 Shared styled components
import MagicCardTheme from "@/components/shared/sections/magicCardTheme";
import Section from "@/components/shared/sections/section";
import Heading from "@/components/shared/typography/heading";

// 🔐 Auth components & store
import ForgotPasswordButton from "@/components/auth/buttons/forgotPasswordButton";
import { linkGoogleUserToEmail } from "@/lib/firebase/auth";
import { useAuthStore } from "@/lib/store/authStore";

// ⚙️ Utils
import { showError } from "@/utils/notifications";
import AnimatedSection from "@/components/shared/sections/animatedSection";

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
      <AnimatedSection
        fromY="-100%"
        className="flex justify-center items-center w-full h-full"
      >
        <MagicCardTheme className="w-full max-w-sm rounded-2xl p-6">
          {/* Header */}
          <Heading size="sm" className="mb-6">
            Link Google Account
          </Heading>

          {/* Form */}
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {/* Password input */}
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
              {/* Forgot password */}
              <ForgotPasswordButton />

              {/* Submit */}
              <Button type="submit" disabled={isSubmitting} className="w-full">
                {isSubmitting ? "Linking..." : "Link"}
              </Button>
            </form>
          </CardContent>
        </MagicCardTheme>
      </AnimatedSection>
    </Section>
  );
}

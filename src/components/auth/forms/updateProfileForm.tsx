"use client";
import { motion } from "motion/react";
import { CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { updateUserProfile } from "@/lib/firebase/auth";
import { useAuthStore } from "@/lib/store/authStore";
import MagicCardTheme from "@/components/shared/style/magicCardTheme";
import Section from "@/components/shared/style/section";
import Heading from "@/components/shared/style/heading";
import ForgotPasswordButton from "@/components/auth/buttons/forgotPasswordButton";
import { showError } from "@/utils/notifications";
import { Link } from "@/i18n/navigation";

// Zod schema
const updateProfileSchema = z.object({
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  email: z
    .string()
    .optional()
    .refine((val) => !val || z.string().email().safeParse(val).success, {
      message: "Invalid email",
    }),
  password: z
    .string()
    .optional()
    .refine((val) => !val || val.length >= 6, {
      message: "Password must be at least 6 characters",
    }),
});

// Infer TypeScript types from schema
type LogInFormValues = z.infer<typeof updateProfileSchema>;

export default function UpdateProfile() {
  const getUser = useAuthStore((state) => state.getUser);
  const setUser = useAuthStore((state) => state.setUser);
  const user = useAuthStore((state) => state.user);
  const isGoogleProvider =
    user?.emailProvider?.includes("google.com") &&
    user?.emailProvider?.length === 1;
  // Initialize react-hook-form with zodResolver
  const {
    register, // Connect inputs to form
    handleSubmit, // Form submit handler
    reset, // Reset form fields
    formState: { errors, isSubmitting }, // Validation & state & errors
  } = useForm<LogInFormValues>({
    //Types
    resolver: zodResolver(updateProfileSchema), // Give useForm the resolver from zod
  });

  const onSubmit = async (data: LogInFormValues) => {
    // await updateUserDocProfile(data);
    const isEmpty = Object.values(data).every((value) => value === "");
    if (isEmpty) {
      showError("Please fill in at least one field.");
      return;
    }
    await updateUserProfile(data).then(() => {
      if (user) {
        setUser({ ...user, ...data });
      }
    });

    // Refresh user data in store to apply changes immediately
    getUser();
    reset();
  };
  return (
    <Section type="outer">
      <Heading size="md" className="mb-6">
        Welcome <span className="active">{user?.firstName || "User"}</span>
      </Heading>
      <motion.div
        initial={{ opacity: 0.5, y: "-100%" }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex justify-center items-center w-full h-full"
      >
        <MagicCardTheme className="w-full max-w-sm rounded-2xl p-6">
          <Heading size="sm" className="mb-6">
            Update Profile
          </Heading>

          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {/* First Name and Last Name */}
              <div className="flex items-center justify-between gap-2">
                {/* First Name */}
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input id="firstName" {...register("firstName")} />
                  {errors.firstName && (
                    <p className="text-red-500 text-sm">
                      {errors.firstName.message}
                    </p>
                  )}
                </div>

                {/* Last Name */}
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input id="lastName" {...register("lastName")} />
                  {errors.lastName && (
                    <p className="text-red-500 text-sm">
                      {errors.lastName.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Email and Password checking if email provider is email or google */}
              {isGoogleProvider ? (
                <p className="text-muted-foreground text-sm animate-pulse">
                  Since you are logging in with Google provider only, you cannot
                  change your email or password.
                </p>
              ) : (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" {...register("email")} />
                    {errors.email && (
                      <p className="text-red-500 text-sm">
                        {errors.email.message}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
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
                </>
              )}
              {isGoogleProvider && (
                <Button variant="link" className="w-full h-0">
                  <Link href="/link-google-account">
                    Link Google Account to Email Account
                  </Link>
                </Button>
              )}
              {/* Submit */}
              <Button type="submit" disabled={isSubmitting} className="w-full">
                {isSubmitting ? "Updating Profile" : "Update Profile"}
              </Button>
            </form>
          </CardContent>
        </MagicCardTheme>
      </motion.div>
    </Section>
  );
}

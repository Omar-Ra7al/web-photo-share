"use client";

// External libraries
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

// UI components (shadcn/ui)
import { Button } from "@/components/ui/button";
import { CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// Shared styled components
import Heading from "@/components/shared/typography/heading";
import MagicCardTheme from "@/components/shared/sections/magicCardTheme";
import Section from "@/components/shared/sections/section";

// Auth components & store
import ForgotPasswordButton from "@/components/auth/buttons/forgotPasswordButton";
import { updateUserProfile } from "@/lib/firebase/auth";
import { useAuthStore } from "@/lib/store/authStore";

// Navigation & utils
import { Link } from "@/i18n/navigation";
import { showError } from "@/utils/notifications";
import AnimatedSection from "@/components/shared/sections/animatedSection";

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

type LogInFormValues = z.infer<typeof updateProfileSchema>;

export default function UpdateProfile() {
  const setUser = useAuthStore((state) => state.setUser);
  const user = useAuthStore((state) => state.user);
  const isGoogleProvider = useAuthStore((state) => state.isGoogleProvider);

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

    await updateUserProfile(data).then(() => {
      if (user) {
        setUser({ ...user, ...data });
      }
    });

    reset();
  };
  return (
    <Section type="outer">
      <Heading size="md" className="mb-6">
        Welcome <span className="active">{user?.firstName || "User"}</span>
      </Heading>
      <AnimatedSection
        fromY="-100%"
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
                    <Label htmlFor="password">New Password</Label>
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
      </AnimatedSection>
    </Section>
  );
}

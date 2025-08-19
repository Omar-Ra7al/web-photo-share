"use client";

// External libraries
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";

// UI components (shadcn/ui)
import { Button } from "@/components/ui/button";
import { CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// Shared styled components
import AnimatedSection from "@/components/shared/sections/animatedSection";
import MagicCardTheme from "@/components/shared/sections/magicCardTheme";
import Section from "@/components/shared/sections/section";
import Heading from "@/components/shared/typography/heading";

// Auth components & logic
import SignInWithGoogle from "../buttons/signInWithGoogle";
import { signUpUser } from "@/lib/firebase/auth";

// Navigation
import { Link } from "@/i18n/navigation";

// Zod schema
const signUpSchema = z
  .object({
    firstName: z.string().min(2, "First name is too short"),
    lastName: z.string().min(2, "Last name is too short"),
    email: z.string().email("Invalid email"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

type SignUpFormValues = z.infer<typeof signUpSchema>;

export default function SignUpForm() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<SignUpFormValues>({
    resolver: zodResolver(signUpSchema),
  });

  const onSubmit = async (data: SignUpFormValues) => {
    await signUpUser(
      data.email,
      data.password,
      data.firstName,
      data.lastName,
      router
    );

    reset();
  };

  return (
    <Section type="outer">
      <AnimatedSection
        fromX="100%"
        className="flex justify-center items-center w-full h-full"
      >
        <MagicCardTheme className="w-full max-w-sm rounded-2xl p-6">
          {/* Header */}
          <Heading size="sm" className="mb-6">
            Sign Up
          </Heading>

          {/* Form */}
          <CardContent className="space-y-4">
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

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" {...register("email")} />
                {errors.email && (
                  <p className="text-red-500 text-sm">{errors.email.message}</p>
                )}
              </div>

              {/* Password */}
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

              {/* Confirm Password */}
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  {...register("confirmPassword")}
                />
                {errors.confirmPassword && (
                  <p className="text-red-500 text-sm">
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>

              {/* Submit */}
              <Button type="submit" disabled={isSubmitting} className="w-full">
                {isSubmitting ? "Creating Account..." : "Sign Up"}
              </Button>
            </form>
            <SignInWithGoogle className="w-full" />
          </CardContent>

          {/* Footer */}
          <CardFooter>
            <Button variant="link" className="w-full">
              <Link href="/login">Already have an account? Log in</Link>
            </Button>
          </CardFooter>
        </MagicCardTheme>
      </AnimatedSection>
    </Section>
  );
}

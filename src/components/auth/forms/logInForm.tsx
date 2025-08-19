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
import ForgotPasswordButton from "../buttons/forgotPasswordButton";
import SignInWithGoogle from "../buttons/signInWithGoogle";
import { signInUser } from "@/lib/firebase/auth";

// Navigation
import { Link } from "@/i18n/navigation";

// Zod schema
const logInSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

// Infer TypeScript types from schema
type LogInFormValues = z.infer<typeof logInSchema>;

export default function LogInForm() {
  const router = useRouter();

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
    await signInUser(data.email, data.password, router);

    reset();
  };

  return (
    <Section type="outer">
      <AnimatedSection
        fromX="-100%"
        className="flex justify-center items-center w-full h-full"
      >
        <MagicCardTheme className="w-full max-w-sm p-6 rounded-2xl space-y-4">
          {/* Header */}
          <Heading size="sm" className="mb-6">
            Log In
          </Heading>

          {/* Form */}
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

              {/* Submit */}
              <Button type="submit" disabled={isSubmitting} className="w-full">
                {isSubmitting ? "Logging in..." : "Log In"}
              </Button>
            </form>

            <SignInWithGoogle className="w-full" />
          </CardContent>

          {/* Footer */}
          <CardFooter className="flex flex-col gap-4 my-4">
            <ForgotPasswordButton />
            <Button variant="link" className="w-full h-0">
              <Link href="/signup">Don&apos;t have an account?</Link>
            </Button>
          </CardFooter>
        </MagicCardTheme>
      </AnimatedSection>
    </Section>
  );
}

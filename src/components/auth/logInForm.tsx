"use client";
import { Link } from "@/i18n/navigation";
import { useRouter } from "next/navigation";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { signInUser } from "@/lib/firebase/auth";

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
    try {
      await signInUser(data.email, data.password);
      toast.success("Logged in successfully!");
      setTimeout(() => {
        router.push("/");
      }, 1500);
    } catch (error) {
      toast.error("Login failed. Please check your credentials.", {
        className: "!bg-red-500 text-white",
      });
      if (error instanceof Error) {
        console.error(error.message);
      } else {
        console.error("Unexpected error:", error);
      }
    }
    reset();
  };

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>Log In</CardTitle>
      </CardHeader>

      <CardContent>
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
            <Input id="password" type="password" {...register("password")} />
            {errors.password && (
              <p className="text-red-500 text-sm">{errors.password.message}</p>
            )}
          </div>

          {/* Submit */}
          <Button type="submit" disabled={isSubmitting} className="w-full">
            {isSubmitting ? "Logging in..." : "Log In"}
          </Button>
        </form>
      </CardContent>

      <CardFooter>
        <Button variant="link" className="w-full">
          <Link href="/signup">Don&apos;t have an account?</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}

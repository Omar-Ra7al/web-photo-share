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
import { updateUserProfile } from "@/lib/firebase/auth";
import { updateUserDocProfile } from "@/lib/firebase/fireStore";
import { useAuthStore } from "@/lib/store/authStore";
// Zod schema
const updateProfileSchema = z.object({
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  // email: z
  //   .string()
  //   .optional()
  //   .refine((val) => !val || z.string().email().safeParse(val).success, {
  //     message: "Invalid email",
  //   }),
  // password: z
  //   .string()
  //   .optional()
  //   .refine((val) => !val || val.length >= 6, {
  //     message: "Password must be at least 6 characters",
  //   }),
});

// Infer TypeScript types from schema
type LogInFormValues = z.infer<typeof updateProfileSchema>;

export default function UpdateProfile() {
  const router = useRouter();

  const getUser = useAuthStore((state) => state.getUser);
  const user = useAuthStore((state) => state.user);
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
    try {
      const userUpdatedData = {
        displayName: `${data.firstName || user?.firstName} ${
          data.lastName || user?.lastName
        }`,
      };
      updateUserDocProfile(data);

      updateUserProfile(userUpdatedData);

      // Refresh user data in store to apply changes immediately
      getUser();

      toast.success("Updated successfully!");

      setTimeout(() => {
        router.push("/");
      }, 1500);
    } catch (error) {
      toast.error("Failed to update.", {
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
    <Card className="w-full max-w-sm  h-[290px]">
      <CardHeader>
        <CardTitle>Update Profile</CardTitle>
      </CardHeader>

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

          {/*
          // Email and Password
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" {...register("email")} />
            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" {...register("password")} />
            {errors.password && (
              <p className="text-red-500 text-sm">{errors.password.message}</p>
            )}
          </div>
          */}

          {/* Submit */}
          <Button type="submit" disabled={isSubmitting} className="w-full">
            {isSubmitting ? "Updating Profile" : "Update Profile"}
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

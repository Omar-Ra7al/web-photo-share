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
import { CloudUploadIcon, User2Icon } from "lucide-react";

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
import Image from "next/image";
import DeleteProfile from "../../auth/buttons/deleteProfile";
import DeleteAcc from "@/components/pages/update/deleteAcc";

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
  photoURL: z
    .any()
    .refine(
      (files) => !files || files.length === 0 || files[0] instanceof File,
      "Must be a file"
    )
    .transform((files) => (files && files.length > 0 ? files[0] : undefined))
    .refine(
      (file) => !file || file.size <= 5 * 1024 * 1024,
      "File must be less than 5MB"
    )
    .refine(
      (file) => !file || file.type.startsWith("image/"),
      "File must be an image"
    )
    .optional(),
});

type LogInFormValues = z.infer<typeof updateProfileSchema>;

export default function UpdateProfile() {
  const setUser = useAuthStore((state) => state.setUser);
  const user = useAuthStore((state) => state.user);
  const isGoogleProvider = useAuthStore((state) => state.isGoogleProvider);
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<LogInFormValues>({
    resolver: zodResolver(updateProfileSchema),
  });

  const watchedPhoto = watch("photoURL");
  const previewFile = watchedPhoto
    ? watchedPhoto[0]
    : watchedPhoto instanceof File
    ? watchedPhoto
    : null;

  const onSubmit = async (data: LogInFormValues) => {
    const isEmpty = Object.values(data).every((value) => value === "");

    if (isEmpty) {
      showError("Please fill in at least one field.");
      return;
    }

    await updateUserProfile(data).then(() => {
      if (user) {
        setUser({
          ...user,
          ...data,
          photoURL:
            (data.photoURL !== undefined &&
              URL.createObjectURL(data.photoURL)) ||
            user.photoURL,
        });
      }
    });

    reset();
  };
  if (user)
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
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Photo */}
                <div className="w-full flex flex-col items-center justify-between gap-2 border-0 border-b-2 pb-4">
                  {/* Current Profile */}
                  <div className="w-full flex items-center justify-between">
                    <p className="font-bold">Current Profile</p>
                    <div className="flex items-center justify-center w-[50px] h-[50px] rounded-full overflow-hidden cursor-pointer">
                      {user?.photoURL ? (
                        <Image
                          src={(user?.photoURL as string) || ""}
                          width={50}
                          height={50}
                          alt="user photo"
                          className="rounded-full object-cover w-full h-full"
                        />
                      ) : (
                        <User2Icon />
                      )}
                    </div>
                  </div>

                  {/* New Profile */}
                  <div className="w-full flex flex-col gap-2">
                    <label
                      htmlFor="photoURL"
                      className="cursor-pointer flex items-center justify-between"
                    >
                      <span className="flex items-center gap-1 transition-all duration-300 hover:text-sky-400">
                        Upload New
                        <CloudUploadIcon />
                      </span>
                      {/* Show file name or fallback text */}
                      {/* Show preview if a file is selected */}
                      {previewFile ? (
                        <div className="flex items-center justify-between w-[50px] h-[50px] rounded-full overflow-hidden border-2 border-primary">
                          <Image
                            src={URL.createObjectURL(previewFile)}
                            alt="Preview"
                            width={50}
                            height={50}
                            className="rounded-full object-cover"
                          />
                        </div>
                      ) : (
                        <DeleteProfile />
                      )}
                    </label>

                    <input
                      type="file"
                      id="photoURL"
                      {...register("photoURL")}
                      className="hidden"
                    />
                  </div>
                </div>

                {/* First Name and Last Name */}
                <div className="flex items-center justify-between gap-2 border-0 border-b-2 pb-4">
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
                    Since you are logging in with Google provider only, you
                    cannot change your email or password.
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
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full"
                >
                  {isSubmitting ? "Updating Profile" : "Update Profile"}
                </Button>
              </form>
            </CardContent>
          </MagicCardTheme>
        </AnimatedSection>
      </Section>
    );
}

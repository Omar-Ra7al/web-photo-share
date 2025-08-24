"use client";

import { UserIcon } from "lucide-react";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"; // Adjust path based on your setup
import LogOutButton from "@/components/auth/buttons/logOutButton";
import { Link } from "@/i18n/navigation";
import { InteractiveHoverButton } from "@/components/magicui/interactive-hover-button";
import { useAuthStore } from "@/lib/store/authStore";
import Image from "next/image";

export default function UserProfileMenu() {
  const user = useAuthStore((state) => state.user);
  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger className="p-2 min-h-[40px] h-full">
            <span className="animate-pulse bg"></span>
            {user?.photoURL ? (
              <Image
                src={user?.photoURL as string}
                width={40}
                height={40}
                alt="user"
                className="rounded-full h-8 w-8"
              />
            ) : (
              <UserIcon />
            )}
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <div className="min-w-[210px] max-w-[300px] flex flex-col items-center gap-4">
              <InteractiveHoverButton
                bg="bg-black/30 dark:bg-white"
                className="w-full dark:text-white"
                textColor="text-black"
              >
                <Link href={"/update"}>Update Profile</Link>
              </InteractiveHoverButton>
              <LogOutButton />
            </div>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}

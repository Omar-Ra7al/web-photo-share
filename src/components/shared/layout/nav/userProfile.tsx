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

export default function UserProfileMenu() {
  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger className="p-2 min-h-[40px] h-full">
            <span className="animate-pulse bg"></span>
            <UserIcon className="h-5 w-5" />
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

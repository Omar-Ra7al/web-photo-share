"use client";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDownIcon, ChevronUpIcon, MenuIcon, XIcon } from "lucide-react";
import { CircleCheckIcon, CircleHelpIcon, CircleIcon } from "lucide-react";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import LoginSingUpBtns from "@/components/auth/buttons/signInSingUpBtns";
import AnimatedThemeTogglerDemo from "../themeSwitcher";
import LocaleSwitcher from "../localeSwitcher";
import { useState } from "react";
import AuthActionButton from "./profileAction";

type MenuChild = {
  type?: string;
  href: string;
  title: string;
  description?: string;
  big?: boolean;
  icon?: React.ElementType;
};

type MenuConfigItem = {
  label: string;
  href?: string;
  children?: MenuChild[];
  gridClass?: string; // Responsive width/grid layout per menu
};

const menuConfig: MenuConfigItem[] = [
  {
    label: "Home",
    gridClass: "md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]",
    children: [
      {
        type: "feature",
        href: "/",
        title: "shadcn/ui",
        description: "Beautifully designed components built with Tailwind CSS.",
        big: true,
      },
      {
        href: "/docs",
        title: "Introduction",
        description:
          "Re-usable components built using Radix UI and Tailwind CSS.",
      },
      {
        href: "/docs/installation",
        title: "Installation",
        description: "How to install dependencies and structure your app.",
      },
      {
        href: "/docs/primitives/typography",
        title: "Typography",
        description: "Styles for headings, paragraphs, lists...etc",
      },
    ],
  },
  {
    label: "About",
    href: "/about",
  },
  {
    label: "Gallery",
    href: "/gallery",
  },
  {
    label: "Contact Us",
    gridClass: "w-[200px] sm:w-[250px]",
    children: [
      { href: "#", title: "Backlog", icon: CircleHelpIcon },
      { href: "#", title: "To Do", icon: CircleIcon },
      { href: "#", title: "Done", icon: CircleCheckIcon },
    ],
  },
];

export function NavLinks() {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      <NavigationMenu className="hidden lg:flex" viewport={false}>
        <NavigationMenuList>
          {menuConfig.map((item, idx) => (
            <NavigationMenuItem key={idx}>
              {item.href ? (
                <NavigationMenuLink
                  asChild
                  className={navigationMenuTriggerStyle()}
                >
                  <Link href={item.href}>{item.label}</Link>
                </NavigationMenuLink>
              ) : item.children && item.children.length > 0 ? (
                <>
                  <NavigationMenuTrigger>{item.label}</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul
                      className={`grid gap-2 ${
                        item.gridClass || "w-[300px]" // Default size if not provided
                      }`}
                    >
                      {item.children.map((child, cIdx) =>
                        child.type === "feature" ? (
                          <li key={cIdx} className="row-span-3">
                            <NavigationMenuLink asChild>
                              <Link
                                className="from-muted/50 to-muted flex h-full w-full flex-col justify-end rounded-md bg-linear-to-b p-6 no-underline outline-hidden select-none focus:shadow-md"
                                href={child.href}
                              >
                                <div className="mt-4 mb-2 text-lg font-medium">
                                  {child.title}
                                </div>
                                <p className="text-muted-foreground text-sm leading-tight">
                                  {child.description}
                                </p>
                              </Link>
                            </NavigationMenuLink>
                          </li>
                        ) : (
                          <ListItem
                            key={cIdx}
                            href={child.href}
                            title={child.title}
                            icon={child.icon}
                          >
                            {child.description}
                          </ListItem>
                        )
                      )}
                    </ul>
                  </NavigationMenuContent>
                </>
              ) : (
                <span className="px-3 py-2 text-muted-foreground cursor-default">
                  {item.label}
                </span>
              )}
            </NavigationMenuItem>
          ))}
        </NavigationMenuList>
      </NavigationMenu>

      {/* Animated hamburger/close button */}
      <button
        className="lg:hidden p-2 rounded-md focus:outline-none relative w-8 h-8 z-50"
        onClick={() => setIsOpen(!isOpen)}
        aria-label={isOpen ? "Close menu" : "Open menu"}
      >
        {/* Hamburger Icon */}
        <motion.div
          key="menu"
          initial={{ opacity: 1, scale: 1 }}
          animate={{ opacity: isOpen ? 0 : 1, scale: isOpen ? 0.8 : 1 }}
          transition={{ duration: 0.3 }}
          className="absolute top-0 left-0"
        >
          <MenuIcon size={30} />
        </motion.div>

        {/* Close Icon */}
        <motion.div
          key="close"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: isOpen ? 1 : 0, scale: isOpen ? 1 : 0.8 }}
          transition={{ duration: 0.3 }}
          className="absolute top-0 left-0"
        >
          <XIcon size={24} />
        </motion.div>
      </button>

      {/* Mobile popup menu */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Sliding menu panel */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed top-[100px] right-0 bottom-0 w-[80%] h-screen
               dark:bg-black/70 bg-white/70 !backdrop-blur-2xl shadow-2xl z-50 flex flex-col rounded-l-xl border-l border-gray-200/30 ring-1 ring-gray-300/20 overflow-hidden
              "
            >
              <div className="flex justify-between items-center p-4 border-b border-gray-300/20">
                <h2 className="font-bold text-lg">Menu</h2>
                {/* Optional: you can remove this close button inside if you want only the animated icon */}
                <button
                  className="p-2 rounded-md hover:bg-gray-200/40 transition"
                  onClick={() => setIsOpen(false)}
                  aria-label="Close menu"
                >
                  <XIcon size={24} className="" />
                </button>
              </div>

              <nav className="flex-1 overflow-y-auto p-4 space-y-5">
                {menuConfig.map((item, idx) => (
                  <div key={idx}>
                    {item.href ? (
                      <Link
                        href={item.href}
                        className="block font-semibold  hover:text-indigo-600 transition"
                        onClick={() => setIsOpen(false)}
                      >
                        {item.label}
                      </Link>
                    ) : (
                      <MobileSubMenu
                        item={item}
                        closeMenu={() => setIsOpen(false)}
                      />
                    )}
                  </div>
                ))}
                <div className="flex flex-col items-center gap-4 z-50">
                  <AuthActionButton />
                  <div className="w-full h-[40px] flex items-center justify-center gap-4">
                    <AnimatedThemeTogglerDemo />
                    <LocaleSwitcher />
                  </div>
                </div>
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

function ListItem({
  title,
  children,
  href,
  icon: Icon,
  ...props
}: React.ComponentPropsWithoutRef<"li"> & {
  href: string;
  icon?: React.ElementType;
}) {
  return (
    <li {...props}>
      <NavigationMenuLink asChild>
        <Link href={href} className="flex items-start gap-2">
          {Icon && <Icon className="flex-shrink-0" />}
          <div>
            <div className="text-sm leading-none font-medium">{title}</div>
            {children && (
              <p className="text-muted-foreground line-clamp-2 text-sm leading-snug">
                {children}
              </p>
            )}
          </div>
        </Link>
      </NavigationMenuLink>
    </li>
  );
}

// MobileSubMenu component for mobile navigation
function MobileSubMenu({
  item,
  closeMenu,
}: {
  item: MenuConfigItem;
  closeMenu: () => void;
}) {
  const [open, setOpen] = useState(false);

  if (!item.children || item.children.length === 0) return null;

  return (
    <div>
      <button
        className="w-full flex justify-between items-center font-semibold  transition"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls={`submenu-${item.label}`}
        type="button"
      >
        <span>{item.label}</span>
        <span>{open ? <ChevronUpIcon /> : <ChevronDownIcon />}</span>
      </button>
      {open && (
        <ul id={`submenu-${item.label}`} className="pl-4 mt-2 space-y-2">
          {item.children.map((child, idx) => (
            <li key={idx}>
              <Link
                href={child.href}
                className="block text-gray-700 hover:text-indigo-600 transition"
                onClick={closeMenu}
              >
                {child.icon && <child.icon className="inline mr-2" />}
                {child.title}
              </Link>
              {child.description && (
                <div className="text-xs text-gray-500">{child.description}</div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

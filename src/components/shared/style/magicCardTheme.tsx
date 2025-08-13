"use client";
import { useTheme } from "@/lib/store/themeStore";
import { MagicCard } from "@/components/magicui/magic-card";
const MagicCardTheme = ({
  children,
  className,
  ...props
}: {
  className?: string;
  children: React.ReactNode;
}) => {
  const theme: string = useTheme((state) => state.theme);

  return (
    <>
      {theme === "dark" ? (
        <MagicCard className={className} {...props} gradientColor="#262626">
          {children}
        </MagicCard>
      ) : (
        <MagicCard className={className} {...props} gradientColor="#ddd">
          {children}
        </MagicCard>
      )}
    </>
  );
};

export default MagicCardTheme;

interface SectionProps {
  children: React.ReactNode;
  type: "outer" | "inner";
  className?: string;
}

function Section({ type = "outer", children, className }: SectionProps) {
  return (
    <section
      className={`w-[90%] max-w-[1440px] mx-auto ${type !== "outer" && "py-[60px]"} ${className}`}
    >
      {children}
    </section>
  );
}

export default Section;

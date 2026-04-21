import { cn } from "@/lib/utils";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "pink" | "lavender" | "mint" | "peach" | "green" | "red" | "outline";
  size?: "sm" | "md";
  className?: string;
}

export default function Badge({
  children,
  variant = "default",
  size = "md",
  className,
}: BadgeProps) {
  const variants = {
    default: "bg-bg-tertiary text-text-secondary",
    pink: "bg-accent-soft text-accent-deep",
    lavender: "bg-[rgba(212,184,224,0.3)] text-[#7B5EA7]",
    mint: "bg-[rgba(184,224,210,0.3)] text-[#3D8B70]",
    peach: "bg-[rgba(255,203,164,0.3)] text-[#C47B3A]",
    green: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
    red: "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400",
    outline: "bg-transparent border border-border-soft text-text-secondary",
  };

  const sizes = {
    sm: "text-[10px] px-2 py-0.5 font-mono",
    md: "text-xs px-2.5 py-1 font-mono",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full font-medium",
        variants[variant],
        sizes[size],
        className
      )}
    >
      {children}
    </span>
  );
}

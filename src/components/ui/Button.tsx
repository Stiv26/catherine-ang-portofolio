"use client";

import { forwardRef } from "react";
import { cn } from "@/lib/utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger" | "outline";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", loading, children, disabled, ...props }, ref) => {
    const base =
      "inline-flex items-center justify-center gap-2 font-body font-medium rounded-full transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed";

    const variants = {
      primary:
        "bg-accent-deep text-white hover:bg-accent-primary hover:shadow-soft active:scale-95",
      secondary:
        "bg-bg-secondary text-text-primary border border-border-soft hover:bg-bg-tertiary active:scale-95",
      ghost:
        "bg-transparent text-text-secondary hover:text-text-primary hover:bg-bg-secondary active:scale-95",
      danger:
        "bg-red-500 text-white hover:bg-red-600 active:scale-95",
      outline:
        "bg-transparent text-accent-deep border border-accent-primary hover:bg-accent-soft active:scale-95",
    };

    const sizes = {
      sm: "text-xs px-3 py-1.5 h-8",
      md: "text-sm px-5 py-2.5 h-10",
      lg: "text-base px-7 py-3.5 h-12",
    };

    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={cn(base, variants[variant], sizes[size], className)}
        {...props}
      >
        {loading && (
          <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";

export default Button;

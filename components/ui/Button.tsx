"use client";

import { cn } from "@/lib/utils";
import { type ButtonHTMLAttributes, forwardRef } from "react";

type Variant = "primary" | "secondary" | "ghost" | "danger";
type Size = "sm" | "md" | "lg" | "icon";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
}

const variants: Record<Variant, string> = {
  primary:   "bg-purple-600 text-white hover:bg-purple-500 border-transparent",
  secondary: "bg-white/10 text-white hover:bg-white/20 border-white/10",
  ghost:     "bg-transparent text-white/60 hover:bg-white/10 hover:text-white border-transparent",
  danger:    "bg-red-600 text-white hover:bg-red-500 border-transparent",
};

const sizes: Record<Size, string> = {
  sm:   "h-8 px-3 text-xs gap-1.5",
  md:   "h-9 px-4 text-sm gap-2",
  lg:   "h-11 px-6 text-base gap-2",
  icon: "h-9 w-9 p-0",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "secondary", size = "md", loading, disabled, children, ...props }, ref) => (
    <button
      ref={ref}
      disabled={disabled || loading}
      className={cn(
        "inline-flex items-center justify-center rounded-lg border font-medium",
        "transition-all duration-150 active:scale-95 cursor-pointer",
        "disabled:opacity-40 disabled:cursor-not-allowed disabled:active:scale-100",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-1 focus-visible:ring-offset-black",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {loading
        ? <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
        : children}
    </button>
  )
);
Button.displayName = "Button";
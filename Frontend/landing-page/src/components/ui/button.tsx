import * as React from "react";
import { cn } from "@/lib/utils";
import { Slot } from "@radix-ui/react-slot"; // Let's not use radix if not installed.

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "ghost" | "link" | "glass";
  size?: "default" | "sm" | "lg" | "icon";
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 disabled:pointer-events-none disabled:opacity-50",
          {
            "bg-brand-600 text-white hover:bg-brand-700 shadow-md hover:shadow-lg":
              variant === "default",
            "border border-gray-200 bg-white hover:bg-gray-50 text-gray-900":
              variant === "outline",
            "hover:bg-gray-100 text-gray-700": variant === "ghost",
            "underline-offset-4 hover:underline text-brand-600": variant === "link",
            "bg-white/80 backdrop-blur-md border border-gray-200 hover:bg-white text-gray-900 shadow-sm": variant === "glass",
            "h-10 px-4 py-2": size === "default",
            "h-9 px-3": size === "sm",
            "h-11 px-8 text-base font-semibold": size === "lg",
            "h-10 w-10": size === "icon",
          },
          className
        )}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button };

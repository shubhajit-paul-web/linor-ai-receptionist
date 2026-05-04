import * as React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon";
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center font-medium transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50",
          {
            "bg-white text-[#09090b] hover:bg-white/90":
              variant === "default",
            "border border-white/10 bg-transparent text-white/80 hover:text-white hover:bg-white/[0.04]":
              variant === "outline",
            "text-white/70 hover:text-white hover:bg-white/[0.04]": variant === "ghost",
            "underline-offset-4 hover:underline text-brand-400": variant === "link",
            "h-9 px-4 text-sm rounded-lg": size === "default",
            "h-8 px-3 text-[13px] rounded-md": size === "sm",
            "h-10 px-6 text-sm rounded-lg": size === "lg",
            "h-9 w-9 rounded-lg": size === "icon",
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

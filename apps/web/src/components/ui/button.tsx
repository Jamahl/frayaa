import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import "./button.css";

export type ButtonVariant =
  | "default"
  | "destructive"
  | "outline"
  | "secondary"
  | "ghost"
  | "link";

export type ButtonSize = "default" | "sm" | "lg" | "icon";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  asChild?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { variant = "default", size = "default", className, asChild = false, ...props },
    ref,
  ) => {
    const Comp: React.ElementType = asChild ? Slot : "button";

    const classes = [
      "button",
      `button--${variant}`,
      `button--size-${size}`,
      className,
    ]
      .filter(Boolean)
      .join(" ");

    return <Comp ref={ref} className={classes} {...props} />;
  },
);

Button.displayName = "Button";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import "./badge.css";

export type BadgeVariant = "default" | "secondary" | "destructive" | "outline";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  asChild?: boolean;
}

export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  (
    { variant = "default", className, asChild = false, ...props },
    ref,
  ) => {
    const Comp: React.ElementType = asChild ? Slot : "span";
    const classes = [
      "badge",
      `badge--${variant}`,
      className,
    ]
      .filter(Boolean)
      .join(" ");
    return <Comp ref={ref} className={classes} {...props} />;
  },
);

Badge.displayName = "Badge";
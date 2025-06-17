import * as React from "react";
import "./input.css";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        ref={ref}
        type={type}
        data-slot="input"
        className={["input", className].filter(Boolean).join(" ")}
        {...props}
      />
    );
  }
);

Input.displayName = "Input";

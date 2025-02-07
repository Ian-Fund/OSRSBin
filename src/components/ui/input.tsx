import * as React from "react";
import { cn } from "@lib/utils";
import { cva, type VariantProps } from "class-variance-authority"

const inputVariants = cva(
  "flex h-10 w-full rounded-md border border-border bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
  {
    variants: {
      sz: {
        default: "h-10",
        sm: "h-8 text-sm",
        lg: "h-12 text-lg",
      },
    },
    defaultVariants: {
      sz: "default",
    },
  }
);

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement>, VariantProps<typeof inputVariants> {}

  const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({ className, type, sz, ...props }, ref) => {
      return (
        <input
          type={type}
          className={cn(
            inputVariants({ sz, className }),
          )}
          ref={ref}
          {...props}
        />
      );
    }
  );
Input.displayName = "Input";

export { Input };

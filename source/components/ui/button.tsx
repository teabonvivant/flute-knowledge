import * as React from "react";
import { cn } from "@/lib/utils";

const variants = {
  default: "bg-primary text-primary-foreground hover:bg-primary/90",
  secondary: "border border-border bg-card text-primary hover:bg-accent",
  ghost: "text-primary hover:bg-muted",
  link: "px-0 text-wine underline decoration-wine/30 underline-offset-4 hover:text-primary"
};

const sizes = {
  default: "h-11",
  sm: "h-11 px-3",
  lg: "h-12 px-6"
};

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
  variant?: keyof typeof variants;
  size?: keyof typeof sizes;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", asChild, children, ...props }, ref) => {
    const classes = cn(
      "atlas-button inline-flex min-h-11 shrink-0 whitespace-nowrap items-center justify-center gap-2 rounded-md px-5 py-2 font-sans text-sm font-semibold transition-[background-color,color,border-color,transform] duration-200 ease-out active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
      variants[variant],
      sizes[size],
      className
    );
    if (asChild && React.isValidElement<{ className?: string }>(children)) {
      return React.cloneElement(children, {
        className: cn(classes, children.props.className)
      });
    }
    return (
      <button className={classes} ref={ref} {...props}>
        {children}
      </button>
    );
  }
);
Button.displayName = "Button";

export { Button };

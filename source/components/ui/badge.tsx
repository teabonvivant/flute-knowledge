import * as React from "react";
import { cn } from "@/lib/utils";

export function Badge({ className, variant, ...props }: React.HTMLAttributes<HTMLSpanElement> & { variant?: "outline" }) {
  return (
    <span
      className={cn(
        "inline-flex min-h-7 max-w-full items-center rounded-md border border-primary/15 bg-accent/60 px-2.5 py-1 font-sans text-xs font-bold text-primary",
        variant === "outline" ? "bg-transparent" : "",
        className
      )}
      {...props}
    />
  );
}

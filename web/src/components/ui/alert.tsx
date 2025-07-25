import type * as React from "react";

import { cn } from "@/utils";

function Alert({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert"
      role="alert"
      className={cn(
        [
          "relative",
          "w-full",
          "rounded-lg",
          "border",
          "px-4",
          "py-3",
          "text-sm",
          "grid",
          "bg-card",
          "text-card-foreground",
          "has-[>svg]:grid-cols-[calc(var(--spacing)*4)_1fr]",
          "grid-cols-[0_1fr]",
          "has-[>svg]:gap-x-3",
          "gap-y-0.5",
          "items-start",
          "[&>svg]:size-4",
          "[&>svg]:translate-y-0.5",
          "[&>svg]:text-current",
        ],
        className
      )}
      {...props}
    />
  );
}

function AlertTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-title"
      className={cn(
        [
          "col-start-2",
          "line-clamp-1",
          "min-h-4",
          "font-medium",
          "tracking-tight",
        ],
        className
      )}
      {...props}
    />
  );
}

function AlertDescription({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-description"
      className={cn(
        [
          "text-muted-foreground",
          "col-start-2",
          "grid",
          "justify-items-start",
          "gap-1",
          "text-sm",
          "[&_p]:leading-relaxed",
        ],
        className
      )}
      {...props}
    />
  );
}

export { Alert, AlertDescription, AlertTitle };

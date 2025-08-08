import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
  {
    variants: {
      variant: {
        primary:
          "bg-[var(--token-color-surface-action)] text-[var(--token-color-surface-primary)] border border-transparent hover:bg-[var(--token-color-surface-action-hover)] focus-visible:ring-[var(--token-color-border-action)] active:bg-[var(--token-color-surface-action-active)]",
        secondary:
          "bg-[var(--token-color-surface-secondary)] text-[var(--token-color-foreground-primary)] border border-[var(--token-color-border-primary)] hover:bg-[var(--token-color-surface-interactive-hover)] focus-visible:ring-[var(--token-color-border-action)]",
        outline:
          "bg-transparent text-[var(--token-color-foreground-primary)] border border-[var(--token-color-border-primary)] hover:bg-[var(--token-color-surface-interactive-hover)] focus-visible:ring-[var(--token-color-border-action)]",
        ghost:
          "bg-transparent text-[var(--token-color-foreground-primary)] border border-transparent hover:bg-[var(--token-color-surface-interactive-hover)] focus-visible:ring-[var(--token-color-border-action)]",
        destructive:
          "bg-[var(--red-500)] text-white border border-transparent hover:bg-[var(--red-400)] focus-visible:ring-[var(--red-500)] active:bg-[var(--red-500)]",
        success:
          "bg-[var(--green-500)] text-white border border-transparent hover:bg-[var(--green-400)] focus-visible:ring-[var(--green-500)] active:bg-[var(--green-500)]",
        warning:
          "bg-[var(--amber-500)] text-white border border-transparent hover:bg-[var(--amber-400)] focus-visible:ring-[var(--amber-500)] active:bg-[var(--amber-500)]",
        link: "bg-transparent text-[var(--token-color-foreground-action)] underline-offset-4 hover:underline focus-visible:ring-[var(--token-color-border-action)]",
      },
      size: {
        sm: "h-8 px-3 text-sm",
        default: "h-10 px-4 text-sm",
        lg: "h-12 px-6 text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  }
)

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot : "button"

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button }
// eslint-disable-next-line react-refresh/only-export-components
export { buttonVariants }

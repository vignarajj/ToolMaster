import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-[#d45202] text-white hover:bg-[#b8460a] shadow-sm font-medium transform hover:scale-105 hover:-translate-y-1 hover:shadow-lg active:scale-95 transition-all duration-200",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-sm",
        outline:
          "border border-input bg-card text-card-foreground hover:bg-[#d45202] hover:text-white hover:border-[#d45202] shadow-sm transition-all font-medium transform hover:scale-105 hover:-translate-y-1 hover:shadow-lg",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-[#d45202] hover:text-white shadow-sm transform hover:scale-105 hover:-translate-y-1",
        ghost: "hover:bg-[#d45202] hover:text-white transition-all duration-200 transform hover:scale-105 hover:-translate-y-1",
        link: "text-primary underline-offset-4 hover:underline",
        orange: "bg-[#d45202] text-white hover:bg-[#b8460a] shadow-sm font-medium transform hover:scale-105 hover:-translate-y-1 hover:shadow-lg active:scale-95 transition-all duration-200",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }

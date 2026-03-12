import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "select-none inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        dropdownItem: "bg-transparent cursor-pointer",
        default:
          "bg-background hover:bg-accent hover:text-accent-foreground cursor-pointer dark:backdrop-blur-sm dark:text-white dark:hover:bg-white/20 dark:bg-transparent",
        destructive:
          "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90 cursor-pointer dark:backdrop-blur-sm dark:bg-transparent dark:text-white",
        outline:
          "border border-input shadow-sm bg-transparent hover:bg-white/20 cursor-pointer dark:text-white",
        secondary:
          "bg-secondary text-secondary-foreground dark:shadow-white/20 shadow-sm hover:shadow-black hover:shadow-[0_4px_6px] transition duration-200 cursor-pointer dark:backdrop-blur-sm dark:text-white dark:bg-transparent",
        ghost:
          "hover:bg-accent hover:text-accent-foreground cursor-pointer dark:backdrop-blur-sm dark:text-white dark:bg-transparent",
        link:
          "text-primary underline-offset-4 hover:underline cursor-pointer dark:backdrop-blur-sm dark:text-white dark:bg-transparent",
        main_menu: "bg-black text-white text-primary-foreground shadow hover:bg-primary/90 cursor-pointer dark:bg-white dark:text-black",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 px-3 text-xs",
        lg: "h-10 px-8",
        icon: "h-9 w-9",
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

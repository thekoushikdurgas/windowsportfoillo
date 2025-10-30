import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 hover:scale-105",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-gradient-primary text-primary-foreground hover:shadow-lg hover:shadow-primary/25",
        secondary:
          "border-transparent bg-gradient-secondary text-secondary-foreground hover:shadow-lg hover:shadow-secondary/25",
        destructive:
          "border-transparent bg-gradient-to-r from-red-500 to-red-600 text-white hover:shadow-lg hover:shadow-red-500/25",
        success:
          "border-transparent bg-gradient-to-r from-green-500 to-green-600 text-white hover:shadow-lg hover:shadow-green-500/25",
        warning:
          "border-transparent bg-gradient-to-r from-yellow-500 to-yellow-600 text-white hover:shadow-lg hover:shadow-yellow-500/25",
        info:
          "border-transparent bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:shadow-lg hover:shadow-blue-500/25",
        outline: "text-foreground border-border hover:bg-accent hover:text-accent-foreground",
        glass: "glass text-foreground border-white/20 hover:bg-white/20",
        gradient: "border-transparent bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:shadow-lg",
      },
      size: {
        default: "px-3 py-1 text-xs",
        sm: "px-2 py-0.5 text-xs",
        lg: "px-4 py-1.5 text-sm",
        xl: "px-5 py-2 text-base",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export type BadgeVariant = "default" | "secondary" | "destructive" | "success" | "warning" | "info" | "outline" | "glass" | "gradient";

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement> {
  variant?: BadgeVariant;
  size?: VariantProps<typeof badgeVariants>['size'];
}

function Badge({ className, variant, size, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant, size }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
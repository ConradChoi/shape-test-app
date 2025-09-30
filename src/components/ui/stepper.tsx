import * as React from "react"
import { cn } from "../../lib/utils"

interface StepperProps {
  activeStep: number
  steps: string[]
  className?: string
}

const Stepper = React.forwardRef<HTMLDivElement, StepperProps>(
  ({ activeStep, steps, className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("flex items-center justify-between", className)}
        {...props}
      >
        {steps.map((step, index) => (
          <div key={step} className="flex items-center">
            <div className="flex items-center">
              <div
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-full border-2 text-sm font-medium",
                  index <= activeStep
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-muted-foreground bg-background text-muted-foreground"
                )}
              >
                {index + 1}
              </div>
              <span
                className={cn(
                  "ml-2 text-sm font-medium",
                  index <= activeStep
                    ? "text-foreground"
                    : "text-muted-foreground"
                )}
              >
                {step}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div
                className={cn(
                  "mx-4 h-0.5 w-16",
                  index < activeStep ? "bg-primary" : "bg-muted-foreground"
                )}
              />
            )}
          </div>
        ))}
      </div>
    )
  }
)
Stepper.displayName = "Stepper"

export { Stepper }

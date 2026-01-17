import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProgressBarProps {
  currentStep: number;
  steps: { label: string; description: string }[];
}

const ProgressBar = ({ currentStep, steps }: ProgressBarProps) => {
  return (
    <div className="w-full py-6">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => {
          const stepNumber = index + 1;
          const isCompleted = currentStep > stepNumber;
          const isCurrent = currentStep === stepNumber;

          return (
            <div key={index} className="flex flex-1 items-center">
              <div className="flex flex-col items-center">
                <div
                  className={cn(
                    "flex h-10 w-10 items-center justify-center rounded-full border-2 text-sm font-semibold transition-all duration-300",
                    isCompleted && "border-accent bg-accent text-accent-foreground",
                    isCurrent && "border-accent bg-accent/10 text-accent animate-pulse-orange",
                    !isCompleted && !isCurrent && "border-border bg-secondary text-muted-foreground"
                  )}
                >
                  {isCompleted ? (
                    <Check className="h-5 w-5" />
                  ) : (
                    stepNumber
                  )}
                </div>
                <div className="mt-2 text-center">
                  <p
                    className={cn(
                      "text-xs font-medium transition-colors",
                      isCurrent ? "text-foreground" : "text-muted-foreground"
                    )}
                  >
                    {step.label}
                  </p>
                  <p className="hidden text-xs text-muted-foreground sm:block">
                    {step.description}
                  </p>
                </div>
              </div>
              {index < steps.length - 1 && (
                <div
                  className={cn(
                    "mx-2 h-0.5 flex-1 transition-colors duration-300",
                    currentStep > stepNumber + 1 || (currentStep === stepNumber + 1 && isCompleted)
                      ? "bg-accent"
                      : "bg-border"
                  )}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProgressBar;

import React from 'react';

interface Step {
  number: number;
  title: string;
  description: string;
}

interface WizardStepperProps {
  steps: readonly Step[];
  currentStep: number;
  completedSteps: number[];
}

export const WizardStepper: React.FC<WizardStepperProps> = ({
  steps,
  currentStep,
  completedSteps,
}) => {
  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Mobile view: condensed top-stepper */}
      <div className="md:hidden flex items-center justify-between bg-white border border-border-muted p-4 rounded-lg">
        <div>
          <span className="text-xs font-bold text-primary uppercase tracking-wider">Step {currentStep} of {steps.length}</span>
          <h3 className="text-base font-bold text-text-main mt-0.5">{steps[currentStep - 1].title}</h3>
        </div>
        <div className="flex gap-1">
          {steps.map((step) => {
            const isCompleted = completedSteps.includes(step.number);
            const isActive = currentStep === step.number;
            return (
              <div
                key={step.number}
                className={`h-2 w-6 rounded-full transition-all duration-300 ${
                  isActive
                    ? 'bg-primary w-8'
                    : isCompleted
                    ? 'bg-success'
                    : 'bg-surface-container-highest'
                }`}
              />
            );
          })}
        </div>
      </div>

      {/* Desktop/Tablet view: Vertical Stepper */}
      <div className="hidden md:flex flex-col relative pl-4">
        {/* Vertical line connector */}
        <div className="absolute left-[31px] top-6 bottom-6 w-[2px] bg-border-muted z-0" />

        <div className="flex flex-col gap-8 z-10">
          {steps.map((step) => {
            const isCompleted = completedSteps.includes(step.number);
            const isActive = currentStep === step.number;

            return (
              <div key={step.number} className="flex gap-4 items-start group">
                {/* Step indicator circle */}
                <div className="relative flex items-center justify-center">
                  {isCompleted ? (
                    <div className="w-8 h-8 rounded-full bg-success text-white flex items-center justify-center shadow-sm">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    </div>
                  ) : isActive ? (
                    <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold ring-4 ring-primary-fixed-dim border border-primary">
                      {step.number}
                    </div>
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-white text-text-muted border-2 border-border-muted flex items-center justify-center font-bold">
                      {step.number}
                    </div>
                  )}
                </div>

                {/* Step Label */}
                <div className="flex flex-col pt-0.5">
                  <span className={`text-xs font-bold uppercase tracking-wider transition-colors ${
                    isActive ? 'text-primary' : isCompleted ? 'text-success' : 'text-text-muted'
                  }`}>
                    Step {step.number}
                  </span>
                  <span className={`text-sm font-semibold mt-0.5 transition-colors ${
                    isActive ? 'text-text-main' : 'text-text-muted'
                  }`}>
                    {step.title}
                  </span>
                  <span className="text-xs text-text-muted mt-0.5 leading-relaxed hidden lg:block max-w-[200px]">
                    {step.description}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

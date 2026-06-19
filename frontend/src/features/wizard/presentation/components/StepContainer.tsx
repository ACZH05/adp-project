import React from 'react';

interface StepContainerProps {
  title: string;
  description: string;
  children: React.ReactNode;
}

export const StepContainer: React.FC<StepContainerProps> = ({ title, description, children }) => {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-xl font-bold text-primary">{title}</h2>
        <p className="text-sm text-text-muted mt-1">{description}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {children}
      </div>
    </div>
  );
};

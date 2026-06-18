import React from 'react';
import { Card } from '@/src/shared/components/Card';

interface ChartContainerProps {
  title: string;
  subtitle?: string;
  headerAction?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export const ChartContainer: React.FC<ChartContainerProps> = ({
  title,
  subtitle,
  headerAction,
  children,
  className = '',
}) => {
  return (
    <Card className={`flex flex-col gap-4 border-border-muted shadow-sm hover:shadow-md transition-shadow duration-200 ${className}`}>
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div className="flex flex-col gap-0.5">
          <h3 className="text-sm font-bold text-primary tracking-tight uppercase">
            {title}
          </h3>
          {subtitle && (
            <p className="text-xs text-text-muted font-medium">
              {subtitle}
            </p>
          )}
        </div>
        {headerAction && (
          <div className="flex items-center shrink-0">
            {headerAction}
          </div>
        )}
      </div>
      <div className="flex-1 w-full min-h-[260px] flex items-center justify-center">
        {children}
      </div>
    </Card>
  );
};

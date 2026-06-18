import React from 'react';
import { Card } from '@/src/shared/components/Card';

interface KPICardProps {
  title: string;
  value: string | number;
  subtitle: string;
  icon: React.ReactNode;
  variant?: 'neutral' | 'success' | 'danger' | 'info';
}

export const KPICard: React.FC<KPICardProps> = ({
  title,
  value,
  subtitle,
  icon,
  variant = 'neutral',
}) => {
  const variantStyles = {
    neutral: {
      iconBg: 'bg-primary/10 text-primary',
      borderHover: 'hover:border-primary/30',
    },
    success: {
      iconBg: 'bg-success/10 text-success',
      borderHover: 'hover:border-success/30',
    },
    danger: {
      iconBg: 'bg-error/10 text-error',
      borderHover: 'hover:border-error/30',
    },
    info: {
      iconBg: 'bg-info/10 text-info',
      borderHover: 'hover:border-info/30',
    },
  };

  const styles = variantStyles[variant];

  return (
    <Card className={`transition-all duration-200 border-border-muted hover:shadow-sm ${styles.borderHover}`}>
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <span className="text-xs font-semibold uppercase tracking-wider text-text-muted">
            {title}
          </span>
          <span className="text-3xl font-bold text-text-main tracking-tight">
            {value}
          </span>
          <span className="text-xs text-text-muted mt-1 font-medium">
            {subtitle}
          </span>
        </div>
        <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${styles.iconBg}`}>
          {icon}
        </div>
      </div>
    </Card>
  );
};

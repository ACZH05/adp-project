import React from 'react';
import { Card } from '@/src/shared/components/Card';

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle: string;
  icon: React.ReactNode;
  variant?: 'neutral' | 'success' | 'danger' | 'info' | 'warning';
  trend?: {
    value: string;
    isPositive: boolean;
  };
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  subtitle,
  icon,
  variant = 'neutral',
  trend,
}) => {
  const variantStyles = {
    neutral: {
      iconBg: 'bg-primary/10 text-primary',
      borderHover: 'hover:border-primary/30',
      badgeBg: 'bg-slate-100 text-slate-700',
    },
    success: {
      iconBg: 'bg-success/10 text-success',
      borderHover: 'hover:border-success/30',
      badgeBg: 'bg-success/10 text-success',
    },
    danger: {
      iconBg: 'bg-error/10 text-error',
      borderHover: 'hover:border-error/30',
      badgeBg: 'bg-error/10 text-error',
    },
    info: {
      iconBg: 'bg-info/10 text-info',
      borderHover: 'hover:border-info/30',
      badgeBg: 'bg-info/10 text-info',
    },
    warning: {
      iconBg: 'bg-warning/10 text-warning',
      borderHover: 'hover:border-warning/30',
      badgeBg: 'bg-warning/10 text-warning',
    },
  };

  const styles = variantStyles[variant];

  return (
    <Card className={`transition-all duration-200 border-border-muted hover:shadow-sm ${styles.borderHover}`}>
      <div className="flex items-start justify-between">
        <div className="flex flex-col gap-1 flex-1">
          <span className="text-xs font-semibold uppercase tracking-wider text-text-muted">
            {title}
          </span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-3xl font-bold text-text-main tracking-tight">
              {value}
            </span>
            {trend && (
              <span className={`inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[10px] font-bold ${styles.badgeBg}`}>
                {trend.value}
              </span>
            )}
          </div>
          <span className="text-xs text-text-muted mt-2 font-medium">
            {subtitle}
          </span>
        </div>
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${styles.iconBg}`}>
          {icon}
        </div>
      </div>
    </Card>
  );
};

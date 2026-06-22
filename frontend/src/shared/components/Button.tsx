import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'deep-navy';
  className?: string;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  className = '',
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center px-5 py-2.5 text-sm font-semibold transition-colors rounded-default focus:outline-none focus:ring-2 focus:ring-offset-2';
  
  const variants = {
    primary: 'bg-primary text-on-primary hover:bg-primary-container',
    secondary: 'bg-surface-container text-primary hover:bg-surface-container-high',
    ghost: 'bg-transparent text-primary hover:bg-surface-container-low',
    danger: 'bg-transparent text-error border border-error hover:bg-error/10',
    'deep-navy': 'bg-primary-container text-white hover:bg-primary',
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

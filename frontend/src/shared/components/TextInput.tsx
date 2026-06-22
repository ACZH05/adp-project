import React from 'react';

interface TextInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const TextInput: React.FC<TextInputProps> = ({
  label,
  error,
  icon,
  rightIcon,
  className = '',
  id,
  ...props
}) => {
  return (
    <div className="flex flex-col gap-1.5 w-full">
      {label && (
        <label htmlFor={id} className="text-sm font-semibold text-text-main">
          {label}
        </label>
      )}
      <div className="relative flex items-center">
        {icon && (
          <div className="absolute left-3 text-text-muted">
            {icon}
          </div>
        )}
        <input
          id={id}
          className={`
            w-full h-11 px-3 py-2 bg-white border rounded-default text-sm
            focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary
            transition-all placeholder:text-text-muted
            ${icon ? 'pl-10' : ''}
            ${rightIcon ? 'pr-10' : ''}
            ${error ? 'border-error ring-1 ring-error' : 'border-border-muted'}
            ${className}
          `}
          {...props}
        />
        {rightIcon && (
          <div className="absolute right-3 cursor-pointer text-text-muted hover:text-text-main">
            {rightIcon}
          </div>
        )}
      </div>
      {error && (
        <p className="text-xs text-error font-medium">
          {error}
        </p>
      )}
    </div>
  );
};

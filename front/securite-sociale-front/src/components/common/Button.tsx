import type { ButtonHTMLAttributes } from 'react';
import clsx from 'clsx';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

const sizeStyles = {
  sm: 'px-2 py-1 text-sm',
  md: 'px-4 py-2 text-base',
  lg: 'px-6 py-3 text-lg',
};

const variantStyles = {
  primary: 'bg-blue-500 hover:bg-blue-600 text-white',
  secondary: 'bg-gray-500 hover:bg-gray-600 text-white',
  danger: 'bg-red-500 hover:bg-red-600 text-white',
  outline: 'border border-gray-500 text-gray-500 hover:bg-gray-100',
  ghost: 'bg-transparent text-gray-700 hover:bg-gray-200', // Nouveau style "ghost"
};

const Button: React.FC<ButtonProps> = ({ variant = 'primary', size = 'md', isLoading, children, className, ...props }) => {
  return (
    <button
      type="submit"
      className={clsx(
        'px-4 py-2 rounded flex items-center justify-center',
        variantStyles[variant],
        sizeStyles[size],
        isLoading && 'opacity-50 cursor-not-allowed',
        className || ''
      )}
      disabled={props.disabled || isLoading}
      {...props}
    >
      {isLoading ? <span className="animate-spin mr-2">⏳</span> : null}
      {children}
    </button>
  );
};

export default Button;

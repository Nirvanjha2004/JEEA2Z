import React from 'react';

export function Button({
  children,
  variant = 'primary',
  size = 'standard',
  className = '',
  disabled = false,
  type = 'button',
  onClick,
  ...props
}) {
  // Styles compiling
  const baseStyle =
    'inline-flex items-center justify-center font-medium rounded-md transition-all duration-150 active:scale-[0.97] cursor-pointer disabled:opacity-50 disabled:pointer-events-none disabled:active:scale-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent';

  const variants = {
    primary: 'bg-text-primary text-bg-app hover:opacity-90 border border-border-default',
    secondary: 'bg-transparent border border-border-default text-text-primary hover:bg-bg-subtle',
    danger: 'bg-transparent border border-danger/30 text-danger hover:bg-danger/5',
    ghost: 'bg-transparent text-text-secondary hover:bg-bg-elevated hover:text-text-primary',
  };

  const sizes = {
    standard: 'h-[34px] px-3.5 text-[13px]',
    compact: 'h-[28px] px-2.5 text-[11.5px]',
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyle} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

export default Button;

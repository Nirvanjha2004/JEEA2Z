import React, { forwardRef } from 'react';

const Input = forwardRef(
  (
    {
      type = 'text',
      placeholder = '',
      value,
      onChange,
      className = '',
      disabled = false,
      error = false,
      size = 'standard', // 'standard' | 'large'
      ...props
    },
    ref
  ) => {
    const sizeClasses = {
      standard: 'h-[34px] py-1.5 px-3 text-[13px]',
      large: 'h-[40px] py-2 px-3.5 text-[14px]',
    };

    const isCheckbox = type === 'checkbox';

    const inputClasses = isCheckbox
      ? `w-3.5 h-3.5 rounded border border-border-default bg-transparent text-accent focus:ring-accent accent-accent transition-all cursor-pointer ${className}`
      : `w-full bg-bg-surface light:bg-white border text-text-primary placeholder:text-text-muted rounded-md focus:outline-none focus:border-accent transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
          error ? 'border-danger focus:border-danger' : 'border-border-default focus:border-border-focus'
        } ${sizeClasses[size]} ${className}`;

    return (
      <input
        ref={ref}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        disabled={disabled}
        className={inputClasses}
        {...props}
      />
    );
  }
);

Input.displayName = 'Input';

export default Input;
export { Input };

import React from 'react';

export function Alert({ children, className = '', variant = 'default' }) {
  const baseStyles = 'rounded-md border p-4 flex items-center gap-2';
  const variantStyles = {
    default: 'bg-green-50 border-green-500 text-green-700',
    error: 'bg-red-50 border-red-500 text-red-700',
    warning: 'bg-yellow-50 border-yellow-500 text-yellow-700',
  };
  return (
    <div className={`${baseStyles} ${variantStyles[variant] || variantStyles.default} ${className}`}>
      {children}
    </div>
  );
}

export function AlertTitle({ children }) {
  return <h4 className="font-semibold">{children}</h4>;
}

export function AlertDescription({ children }) {
  return <p className="text-sm">{children}</p>;
}

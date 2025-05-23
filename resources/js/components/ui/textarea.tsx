import React from 'react';

export const Textarea = React.forwardRef(({ className, ...props }, ref) => (
  <textarea
    ref={ref}
    className={`border border-input bg-background p-2 text-sm rounded-md ${className}`}
    {...props}
  />
));

Textarea.displayName = 'Textarea';

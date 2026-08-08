import React from 'react';

export default function Input({
  value,
  onChange,
  placeholder = '',
  icon: Icon,
  className = '',
  type = 'text',
  ...props
}) {
  return (
    <div className={`relative flex items-center w-full ${className}`}>
      {Icon && (
        <Icon className="absolute left-3.5 w-4 h-4 text-f1-muted pointer-events-none" />
      )}
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`w-full bg-f1-card py-2.5 rounded-xl shadow-soft-inset border border-f1-border text-sm text-f1-dark placeholder:text-f1-muted focus:outline-none focus:ring-2 focus:ring-f1-red/50 transition-all duration-200 ${
          Icon ? 'pl-10 pr-4' : 'px-4'
        }`}
        {...props}
      />
    </div>
  );
}

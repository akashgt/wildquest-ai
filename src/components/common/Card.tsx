import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'forest' | 'sage' | 'elevated' | 'glass';
  interactive?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  variant = 'default',
  interactive = false,
  className = '',
  ...props
}) => {
  const baseStyles = 'rounded-3xl p-5 md:p-6 transition-all duration-200 border';

  const variantStyles = {
    default: 'bg-ivory-50/90 border-sage-200/80 shadow-soft text-forest-900',
    forest: 'bg-forest-800 border-forest-700/60 shadow-soft text-ivory-100',
    sage: 'bg-sage-100/80 border-sage-200 shadow-soft-sm text-forest-900',
    elevated: 'bg-ivory-50 border-sage-200/90 shadow-soft-md text-forest-900',
    glass: 'nature-glass text-forest-900'
  };

  const interactiveStyles = interactive
    ? 'cursor-pointer hover:border-forest-600/40 hover:shadow-soft-md active:scale-[0.99]'
    : '';

  return (
    <div
      className={`${baseStyles} ${variantStyles[variant]} ${interactiveStyles} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'forest' | 'sage' | 'sunlight' | 'terracotta' | 'outline';
  size?: 'sm' | 'md';
  icon?: React.ReactNode;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'sage',
  size = 'md',
  icon,
  className = ''
}) => {
  const sizeStyles = {
    sm: 'text-xs px-2.5 py-0.5 gap-1 font-medium',
    md: 'text-xs md:text-sm px-3 py-1 gap-1.5 font-medium'
  };

  const variantStyles = {
    forest: 'bg-forest-700/10 text-forest-800 border border-forest-700/20',
    sage: 'bg-sage-200/60 text-forest-800 border border-sage-300/60',
    sunlight: 'bg-sunlight-200/70 text-forest-900 border border-sunlight-400/50',
    terracotta: 'bg-terracotta-100 text-terracotta-700 border border-terracotta-300/60',
    outline: 'bg-transparent text-forest-700 border border-forest-300'
  };

  return (
    <span
      className={`inline-flex items-center rounded-full transition-colors ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      <span>{children}</span>
    </span>
  );
};

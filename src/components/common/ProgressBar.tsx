import React from 'react';

interface ProgressBarProps {
  progress: number; // 0 to 100
  label?: string;
  showPercentage?: boolean;
  color?: 'forest' | 'sunlight' | 'sage';
  className?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  label,
  showPercentage = false,
  color = 'forest',
  className = ''
}) => {
  const clamped = Math.min(100, Math.max(0, progress));

  const colorStyles = {
    forest: 'bg-forest-600',
    sunlight: 'bg-sunlight-500',
    sage: 'bg-sage-500'
  };

  return (
    <div className={`w-full ${className}`}>
      {(label || showPercentage) && (
        <div className="flex justify-between items-center text-xs text-forest-700/80 mb-1.5 font-medium">
          {label && <span>{label}</span>}
          {showPercentage && <span>{Math.round(clamped)}%</span>}
        </div>
      )}
      <div 
        className="w-full h-2.5 bg-sage-200/60 rounded-full overflow-hidden p-0.5 border border-sage-300/40"
        role="progressbar"
        aria-valuenow={clamped}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div
          className={`h-full rounded-full transition-all duration-300 ease-out ${colorStyles[color]}`}
          style={{ width: `${clamped}%` }}
        />
      </div>
    </div>
  );
};

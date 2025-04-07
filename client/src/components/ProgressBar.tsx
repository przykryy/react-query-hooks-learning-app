import React from 'react';

interface ProgressBarProps {
  value: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ value }) => {
  return (
    <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
      <div 
        className="h-full bg-primary rounded-full transition-all duration-300 ease-in-out" 
        style={{ width: `${value}%` }}
      />
    </div>
  );
};

export default ProgressBar;

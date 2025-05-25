import React from 'react';

interface ChevronIconProps {
  isExpanded: boolean;
  className?: string;
}

const ChevronIcon: React.FC<ChevronIconProps> = ({ isExpanded, className }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className={`w-6 h-6 transition-transform duration-200 ${
        isExpanded ? 'rotate-180' : ''
      } ${className}`}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
    </svg>
  );
};

export default ChevronIcon;


import React from 'react';

export interface NavLinkItem {
  label: string;
  path: string;
}

export const NAV_LINKS: NavLinkItem[] = [
  { label: "Home", path: "/" },
  { label: "Trainingsleer", path: "/trainingsleer" },
  { label: "Trainingsmethode", path: "/trainingsmethode" },
  { label: "Looptechniek", path: "/looptechniek" },
  { label: "Training geven", path: "/training-geven" },
];

export const RunningShoeIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" 
    fill="currentColor" 
    role="img"
    aria-label="Hardloop Kennisbank Logo"
    {...props}
  >
    <path d="M18.535 6.035a2 2 0 10-2.829-2.829 2 2 0 002.829 2.829zM7.5 10.5c-.36 0-.713.073-1.036.214l-2.5 1.072A1.25 1.25 0 003 12.896V14.5a.75.75 0 001.5 0v-1.32l1.543-.662A3.233 3.233 0 017.5 12c.876 0 1.694.353 2.293.952l3.353 3.353a.75.75 0 101.06-1.06L10.854 11.9a3.25 3.25 0 01-.925-2.216L10.5 7.5a.75.75 0 00-1.5 0l-.57 2.444A3.234 3.234 0 017.5 10.5zm9.974 5.224a.75.75 0 00-1.01-.036l-2.5 2.083a.75.75 0 10.972 1.144L16.5 17.604V19.5a.75.75 0 001.5 0v-2.396a1.25 1.25 0 00-.526-1.006v.001z"/>
  </svg>
);
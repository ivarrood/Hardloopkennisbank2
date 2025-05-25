
import React from 'react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="bg-sky-800 text-sky-100 py-6 text-center">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <p>&copy; {currentYear} Hardloop Kennisbank. Alle rechten voorbehouden.</p>
        <p className="text-sm text-sky-300 mt-1">Gemaakt met ❤️ en React</p>
      </div>
    </footer>
  );
};

export default Footer;
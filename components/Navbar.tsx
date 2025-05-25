
import React, { useState, useEffect, useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { NAV_LINKS, NavLinkItem, RunningShoeIcon } from '../constants';
import { EditModeContext } from './EditModeContext';

// Fix: Define the expected type for the EditModeContext value
interface EditModeContextType {
  isEditing: boolean;
  toggleEditMode: () => void;
}

// Fix: Ensure Navbar is a valid React.FC and add default export
const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  // Fix: Cast the context value to the defined type
  const { isEditing, toggleEditMode } = useContext(EditModeContext) as EditModeContextType;

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    // Initial check
    handleScroll(); 
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Dynamic classes for navbar elements based on scroll
  const navHeightClass = isScrolled ? 'h-12 md:h-16' : 'h-16 md:h-20';
  const logoSizeClass = isScrolled ? 'h-6 w-auto md:h-7' : 'h-8 w-auto md:h-9';
  const brandTextSizeClass = isScrolled ? 'text-lg md:text-xl' : 'text-xl md:text-2xl';
  const linkPaddingClass = isScrolled ? 'px-2 py-1 md:px-3 md:py-1.5' : 'px-3 py-2 md:px-4 md:py-2';

  return (
    <nav className={`fixed w-full top-0 z-50 transition-all duration-300 ease-in-out ${isScrolled ? 'bg-sky-700 shadow-lg backdrop-blur-md bg-opacity-95' : 'bg-sky-800'}`}>
      <div className={`container mx-auto px-4 sm:px-6 lg:px-8 transition-all duration-300 ease-in-out ${navHeightClass}`}>
        <div className="flex items-center justify-between h-full">
          <div className="flex items-center">
            <NavLink to="/" className="flex-shrink-0 flex items-center text-white">
              <RunningShoeIcon className={`${logoSizeClass} mr-2 transition-all duration-300 ease-in-out`} />
              <span className={`font-heading font-semibold tracking-tight ${brandTextSizeClass} transition-all duration-300 ease-in-out`}>Hardloop Kennisbank</span>
            </NavLink>
          </div>
          <div className="hidden md:flex items-center space-x-1">
            {NAV_LINKS.map((link: NavLinkItem) => (
              <NavLink
                key={link.label}
                to={link.path}
                className={({ isActive }) =>
                  `${linkPaddingClass} rounded-md text-sm font-medium transition-all duration-300 ease-in-out ${
                    isActive
                      ? 'bg-sky-900 text-white'
                      : 'text-sky-100 hover:bg-sky-600 hover:text-white'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </div>
          <div className="flex items-center">
            <button
              onClick={toggleEditMode}
              className={`${linkPaddingClass} ml-2 md:ml-4 rounded-md text-sm font-medium text-white bg-orange-500 hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-opacity-75 transition-colors`}
              aria-live="polite"
            >
              {isEditing ? 'View Mode' : 'Edit Mode'}
            </button>
            {/* Mobile menu button can be added here if needed */}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
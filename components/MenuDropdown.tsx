import React, { useState, useRef, useEffect } from 'react';
import { User } from '../types';
import { SunIcon, MoonIcon } from './icons/ThemeIcons';

interface MenuDropdownProps {
  user: User | null;
  isDarkMode: boolean;
  toggleTheme: () => void;
  onLoginClick: () => void;
  onLogoutClick: () => void;
  onDashboardClick: () => void;
  onHomeClick: () => void;
  onContactClick: () => void;
}

export const MenuDropdown: React.FC<MenuDropdownProps> = ({ 
  user, isDarkMode, toggleTheme, onLoginClick, onLogoutClick, onDashboardClick, onHomeClick, onContactClick
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="absolute top-4 right-4 z-50" ref={menuRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-12 h-12 rounded-full bg-white dark:bg-gray-800 border-4 border-black dark:border-white shadow-pop flex items-center justify-center text-brand-dark dark:text-white hover:scale-105 transition-transform"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-3 w-64 bg-white dark:bg-gray-800 rounded-2xl border-4 border-black dark:border-white shadow-pop-hover animate-pop-in overflow-hidden p-2 flex flex-col gap-1">
          {user ? (
             <div className="px-4 py-3 border-b-2 border-gray-100 dark:border-gray-700 mb-1">
               <p className="text-sm font-bold text-gray-500 dark:text-gray-400">Signed in as</p>
               <p className="text-lg font-black text-brand-primary truncate">{user.name}</p>
             </div>
          ) : (
            <div className="px-4 py-3 border-b-2 border-gray-100 dark:border-gray-700 mb-1">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Welcome Guest!</p>
            </div>
          )}

          <button onClick={() => { onHomeClick(); setIsOpen(false); }} className="text-left px-4 py-3 font-bold text-brand-dark dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors">
            🏠 Home
          </button>

          {user && (
            <button onClick={() => { onDashboardClick(); setIsOpen(false); }} className="text-left px-4 py-3 font-bold text-brand-dark dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors">
              📂 My Quizzes
            </button>
          )}

          <div className="h-px bg-gray-200 dark:bg-gray-600 my-1"></div>

          <button onClick={toggleTheme} className="flex items-center justify-between px-4 py-3 font-bold text-brand-dark dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors">
            <span>{isDarkMode ? 'Light Mode' : 'Dark Mode'}</span>
            {isDarkMode ? <SunIcon className="w-5 h-5" /> : <MoonIcon className="w-5 h-5" />}
          </button>

           <button onClick={() => { onContactClick(); setIsOpen(false); }} className="text-left px-4 py-3 font-bold text-brand-dark dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors">
            ❓ Help & Contact
          </button>

          <div className="h-px bg-gray-200 dark:bg-gray-600 my-1"></div>

          {user ? (
            <button onClick={() => { onLogoutClick(); setIsOpen(false); }} className="text-left px-4 py-3 font-bold text-red-500 hover:bg-red-50 dark:hover:bg-gray-700 rounded-xl transition-colors">
              Log Out
            </button>
          ) : (
            <button onClick={() => { onLoginClick(); setIsOpen(false); }} className="text-left px-4 py-3 font-bold text-brand-primary hover:bg-blue-50 dark:hover:bg-gray-700 rounded-xl transition-colors">
              Log In / Sign Up
            </button>
          )}
        </div>
      )}
    </div>
  );
};
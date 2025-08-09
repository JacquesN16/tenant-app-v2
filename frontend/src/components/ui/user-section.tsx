import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@/hooks/useUser.ts';
import { LogOut, User } from 'lucide-react';
import {t} from "i18next";

export const UserSection: React.FC = () => {
  const { data: user, isLoading, error } = useUser();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const getUserInitials = (firstName?: string, lastName?: string): string => {
    if (!firstName && !lastName) return 'U';
    const firstInitial = firstName?.charAt(0).toUpperCase() || '';
    const lastInitial = lastName?.charAt(0).toUpperCase() || '';
    return firstInitial + lastInitial;
  };

  // Helper function to get display name
  const getDisplayName = (firstName?: string, lastName?: string): string => {
    if (!firstName && !lastName) return 'User Account';
    return `${firstName || ''} ${lastName || ''}`.trim();
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  if (isLoading) {
    return (
      <div className="relative">
        <button 
          className="flex items-center space-x-2 p-2 rounded-md"
          style={{ 
            backgroundColor: 'var(--token-color-surface-faint)',
            color: 'var(--token-color-foreground-primary)'
          }}
          disabled
        >
          <div 
            className="w-8 h-8 rounded-full flex items-center justify-center animate-pulse"
            style={{ backgroundColor: 'var(--token-color-surface-action)' }}
          >
            <span 
              className="text-sm font-medium"
              style={{ color: 'var(--token-color-surface-primary)' }}
            >
              ...
            </span>
          </div>
        </button>
      </div>
    );
  }

  if (error) {
    return (
      <div className="relative">
        <button 
          className="flex items-center space-x-2 p-2 rounded-md"
          style={{ 
            backgroundColor: 'var(--token-color-surface-faint)',
            color: 'var(--token-color-foreground-primary)'
          }}
          disabled
        >
          <div 
            className="w-8 h-8 rounded-full flex items-center justify-center"
            style={{ backgroundColor: 'var(--token-color-surface-action)' }}
          >
            <span 
              className="text-sm font-medium"
              style={{ color: 'var(--token-color-surface-primary)' }}
            >
              !
            </span>
          </div>
        </button>
      </div>
    );
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={toggleDropdown}
        className="flex items-center space-x-2 p-2 rounded-md hover:bg-gray-100 transition-colors"
        style={{ 
          color: 'var(--token-color-foreground-primary)'
        }}
      >
        {user?.avatarUrl ? (
          <img
            src={user.avatarUrl}
            alt={`${getDisplayName(user.firstName, user.lastName)} avatar`}
            className="w-8 h-8 rounded-full object-cover"
          />
        ) : (
          <div 
            className="w-8 h-8 rounded-full flex items-center justify-center"
            style={{ backgroundColor: 'var(--token-color-surface-action)' }}
          >
            <span 
              className="text-sm font-medium"
              style={{ color: 'var(--token-color-surface-primary)' }}
            >
              {getUserInitials(user?.firstName, user?.lastName)}
            </span>
          </div>
        )}
        <div className="hidden md:flex flex-col items-start">
          <p 
            className="text-sm font-medium truncate max-w-32"
            style={{ color: 'var(--token-color-foreground-primary)' }}
          >
            {getDisplayName(user?.firstName, user?.lastName)}
          </p>
          <p 
            className="text-xs truncate max-w-32"
            style={{ color: 'var(--token-color-foreground-faint)' }}
          >
            {user?.email || 'No email'}
          </p>
        </div>
      </button>

      {/* Dropdown Menu */}
      {isDropdownOpen && (
        <div 
          className="absolute right-0 mt-2 w-48 rounded-md shadow-lg z-50"
          style={{ 
            backgroundColor: 'var(--token-color-surface-primary)',
            border: '1px solid var(--token-color-border-faint)'
          }}
        >
          <div className="py-1">
            <button
              onClick={() => {
                setIsDropdownOpen(false);
                navigate('/account-settings');
              }}
              className="flex items-center w-full px-4 py-2 text-sm hover:bg-gray-50 transition-colors"
              style={{ color: 'var(--token-color-foreground-primary)' }}
            >
              <User className="w-4 h-4 mr-3" />
              {t("accountSettings.title")}
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center w-full px-4 py-2 text-sm hover:bg-gray-50 transition-colors"
              style={{ color: 'var(--token-color-foreground-primary)' }}
            >
              <LogOut className="w-4 h-4 mr-3" />
              Sign Out
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
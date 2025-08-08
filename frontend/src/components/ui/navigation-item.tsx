import React from 'react';
import { Link } from 'react-router-dom';

interface NavigationItemProps {
  path: string;
  label: string;
  icon: React.ReactNode;
  isActive: boolean;
  onItemClick: () => void;
}

export const NavigationItem: React.FC<NavigationItemProps> = ({ 
  path, 
  label, 
  icon, 
  isActive, 
  onItemClick 
}) => {
  return (
    <Link
      to={path}
      className="flex items-center px-3 py-2 rounded-md transition-colors duration-150 ease-in-out hds-typography-body-200"
      style={{
        backgroundColor: isActive 
          ? 'var(--token-color-surface-action)' 
          : 'transparent',
        color: isActive 
          ? 'var(--token-color-surface-primary)' 
          : 'var(--token-color-foreground-primary)',
        textDecoration: 'none'
      }}
      onClick={onItemClick}
      onMouseEnter={(e) => {
        if (!isActive) {
          e.currentTarget.style.backgroundColor = 'var(--token-color-surface-interactive-hover)';
        }
      }}
      onMouseLeave={(e) => {
        if (!isActive) {
          e.currentTarget.style.backgroundColor = 'transparent';
        }
      }}
    >
      <span className="mr-3 flex-shrink-0">
        {icon}
      </span>
      <span className="font-medium">
        {label}
      </span>
    </Link>
  );
};
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { NavigationItem } from './navigation-item';
import { navigationItems } from './navigation-data';

interface SidebarProps {
  isOpen: boolean;
  onItemClick: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onItemClick }) => {
  const location = useLocation();

  const isActiveLink = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  return (
    <div 
      className={`${isOpen ? 'translate-x-0' : '-translate-x-full'} fixed inset-y-0 left-0 z-50 w-64 border-r flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0`}
      style={{ 
        backgroundColor: 'var(--token-color-surface-primary)',
        borderColor: 'var(--token-color-border-faint)'
      }}
    >
      {/* Logo/Brand */}
      <div className="px-6 py-5 border-b" style={{ borderColor: 'var(--token-color-border-faint)' }}>
        <Link 
          to="/" 
          className="flex items-center space-x-3"
          style={{ 
            color: 'var(--token-color-foreground-high-contrast)',
            textDecoration: 'none'
          }}
        >
          <img 
            src="/asset/logo.png" 
            alt="Kangal Logo" 
            className="h-8 w-8 object-contain"
          />
          <span className="hds-typography-display-200 font-semibold">
            Kangal
          </span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6">
        <div className="space-y-1">
          <div 
            className="hds-typography-body-100 px-3 py-2 font-medium uppercase tracking-wider"
            style={{ 
              color: 'var(--token-color-foreground-faint)',
              fontWeight: 'var(--font-weight-semibold)'
            }}
          >
            Navigation
          </div>
          
          {navigationItems.map((item) => (
            <NavigationItem
              key={item.path}
              path={item.path}
              label={item.label}
              icon={item.icon}
              isActive={isActiveLink(item.path)}
              onItemClick={onItemClick}
            />
          ))}
        </div>
      </nav>

    </div>
  );
};
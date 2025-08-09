import React from 'react';
import { useLocation } from 'react-router-dom';
import { MobileMenuButton } from './mobile-menu-button';
import { UserSection } from './user-section';
import { navigationItems } from './navigation-data';


interface HeaderProps {
  isMobileMenuOpen: boolean;
  onMobileMenuToggle: () => void;
}

export const Header: React.FC<HeaderProps> = ({ 
  isMobileMenuOpen, 
  onMobileMenuToggle 
}) => {
  const location = useLocation();

  const isActiveLink = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  const getCurrentPageTitle = () => {
    return navigationItems.find(item => isActiveLink(item.path))?.label || 'Dashboard';
  };

  return (
    <header 
      className="border-b px-3 lg:px-4 py-2"
      style={{ 
        backgroundColor: 'var(--token-color-surface-primary)',
        borderColor: 'var(--token-color-border-faint)'
      }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <MobileMenuButton 
            isOpen={isMobileMenuOpen}
            onToggle={onMobileMenuToggle}
          />
          
          <h1 
            className="hds-typography-display-300 text-lg lg:text-xl"
            style={{ color: 'var(--token-color-foreground-high-contrast)' }}
          >
            {getCurrentPageTitle()}
          </h1>
        </div>

        <div className="flex items-center space-x-2 lg:space-x-4">
          <UserSection />
        </div>
      </div>
    </header>
  );
};
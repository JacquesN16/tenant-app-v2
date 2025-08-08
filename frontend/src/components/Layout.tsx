import React, { useState } from 'react';
import { Sidebar } from './ui/sidebar';
import { Header } from './ui/header';

interface HyperLayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<HyperLayoutProps> = ({ children }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleMobileMenuToggle = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleSidebarItemClick = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="flex h-screen" style={{ backgroundColor: 'var(--token-color-page-primary)' }}>
      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <Sidebar 
        isOpen={isMobileMenuOpen}
        onItemClick={handleSidebarItemClick}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <Header 
          isMobileMenuOpen={isMobileMenuOpen}
          onMobileMenuToggle={handleMobileMenuToggle}
        />

        {/* Page Content */}
        <main 
          className="flex-1 overflow-y-auto p-4 lg:p-6"
          style={{ backgroundColor: 'var(--token-color-page-faint)' }}
        >
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
import React from 'react';

interface MobileMenuButtonProps {
  isOpen: boolean;
  onToggle: () => void;
}

export const MobileMenuButton: React.FC<MobileMenuButtonProps> = ({ isOpen, onToggle }) => {
  return (
    <button
      className="lg:hidden p-2 rounded-md mr-3 transition-colors duration-150 ease-in-out"
      style={{ 
        color: 'var(--token-color-foreground-primary)',
        backgroundColor: 'transparent'
      }}
      onClick={onToggle}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = 'var(--token-color-surface-interactive-hover)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = 'transparent';
      }}
      aria-label={isOpen ? 'Close menu' : 'Open menu'}
    >
      <svg width="20" height="20" viewBox="0 0 16 16" fill="currentColor">
        <path d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5z"/>
      </svg>
    </button>
  );
};
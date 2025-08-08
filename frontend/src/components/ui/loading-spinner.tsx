import React from 'react';
import { useTranslation } from 'react-i18next';

interface LoadingSpinnerProps {
  message?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  message, 
  size = 'md' 
}) => {
  const { t } = useTranslation();
  const displayMessage = message || t('common.loading');
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  };

  return (
    <div className="flex items-center justify-center h-64">
      <div className="flex items-center space-x-3">
        <div 
          className={`${sizeClasses[size]} border-2 border-t-transparent rounded-full animate-spin`}
          style={{ borderColor: 'var(--token-color-foreground-action)' }}
        />
        <span 
          className="hds-typography-body-200"
          style={{ color: 'var(--token-color-foreground-faint)' }}
        >
          {displayMessage}
        </span>
      </div>
    </div>
  );
};
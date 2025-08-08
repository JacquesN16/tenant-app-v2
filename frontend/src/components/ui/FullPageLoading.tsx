import React from 'react';
import { useTranslation } from 'react-i18next';

interface FullPageLoadingProps {
  message?: string;
  size?: 'sm' | 'md' | 'lg';
}

const FullPageLoading: React.FC<FullPageLoadingProps> = ({ 
  message, 
  size = 'md' 
}) => {
  const { t } = useTranslation();

  const sizeClasses = {
    sm: 'h-6 w-6',
    md: 'h-8 w-8', 
    lg: 'h-12 w-12'
  };

  const textSizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg'
  };

  return (
    <div 
      className="fixed inset-0 bg-white/80 backdrop-blur-sm z-50 flex items-center justify-center"
      style={{ backgroundColor: 'rgba(255, 255, 255, 0.8)' }}
    >
      <div className="flex flex-col items-center space-y-4 p-8 rounded-lg">
        <div 
          className={`animate-spin rounded-full border-b-2 ${sizeClasses[size]}`}
          style={{ borderColor: 'var(--token-color-surface-action)' }}
        />
        <span 
          className={`${textSizeClasses[size]} font-medium`}
          style={{ color: 'var(--token-color-foreground-primary)' }}
        >
          {message || t('common.loading')}
        </span>
      </div>
    </div>
  );
};

export default FullPageLoading;
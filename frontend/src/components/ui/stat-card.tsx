import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

interface StatCardProps {
  title: string;
  value: number | undefined;
  icon: React.ReactNode;
}

export const StatCard: React.FC<StatCardProps> = ({ title, value, icon }) => {
  const formatValue = (val: number, title: string) => {
    if (title.includes('Revenue') || title.includes('Amount')) {
      return `€${val.toLocaleString()}`;
    }
    if (title.includes('%') || title.includes('Rate')) {
      return `${val}%`;
    }
    return val.toLocaleString();
  };

  return (
    <Card>
      <CardContent className="p-3">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p 
              className="text-sm font-medium mb-2"
              style={{ color: 'var(--token-color-foreground-faint)' }}
            >
              {title}
            </p>
            <p 
              className="text-2xl font-bold"
              style={{ color: 'var(--token-color-foreground-high-contrast)' }}
            >
              {formatValue(value || 0, title)}
            </p>
          </div>
          <div 
            className="p-3 rounded-lg"
            style={{ 
              backgroundColor: 'var(--token-color-surface-action)', 
              color: 'var(--token-color-surface-primary)' 
            }}
          >
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
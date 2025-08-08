import React from 'react';
import { useTranslation } from 'react-i18next';
import PropertyCard from '../components/PropertyCard';
import NiceModal from '@ebay/nice-modal-react';
import CreatePropertyModal from '../components/CreatePropertyModal';
import {useProperties} from "../hooks/useData.ts";
import { Button } from '../components/ui/button';

import CreateTenantModal from '../components/CreateTenantModal';

const PropertiesPage: React.FC = () => {
  const { t } = useTranslation();
  const { data: properties, isLoading, isError, error } = useProperties();

  const handleCreateNewProperty = () => {
    NiceModal.show(CreatePropertyModal);
  };

  const handleCreateNewTenant = () => {
    NiceModal.show(CreateTenantModal);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex items-center space-x-3">
          <div 
            className="w-6 h-6 border-2 border-t-transparent rounded-full animate-spin"
            style={{ borderColor: 'var(--token-color-foreground-action)' }}
          ></div>
          <span 
            className="hds-typography-body-200"
            style={{ color: 'var(--token-color-foreground-faint)' }}
          >
            {t('common.loading')}
          </span>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div 
        className="p-6 rounded-lg border"
        style={{ 
          backgroundColor: 'var(--token-color-surface-critical)',
          borderColor: 'var(--token-color-border-critical)'
        }}
      >
        <div className="flex items-center space-x-3">
          <svg width="20" height="20" viewBox="0 0 16 16" fill="var(--token-color-foreground-critical)">
            <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293 5.354 4.646z"/>
          </svg>
          <div>
            <h2 
              className="hds-typography-display-100 mb-1"
              style={{ color: 'var(--token-color-foreground-critical)' }}
            >
              {t('common.error')}
            </h2>
            <p 
              className="hds-typography-body-200"
              style={{ color: 'var(--token-color-foreground-critical)' }}
            >
              {error?.message}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ color: 'var(--token-color-foreground-primary)' }}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 sm:mb-8 space-y-4 sm:space-y-0">

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-3 w-full sm:w-auto">
          <Button 
            variant="secondary" 
            onClick={handleCreateNewTenant}
            className="flex items-center justify-center space-x-2 w-full sm:w-auto"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
              <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0Zm4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4Zm-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10c-2.29 0-3.516.68-4.168 1.332-.678.678-.83 1.418-.832 1.664h10Z"/>
            </svg>
            <span className="whitespace-nowrap">{t('tenant.createNew')}</span>
          </Button>
          
          <Button 
            variant="primary" 
            onClick={handleCreateNewProperty}
            className="flex items-center justify-center space-x-2 w-full sm:w-auto"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
              <path d="M8 2a.5.5 0 0 1 .5.5v5h5a.5.5 0 0 1 0 1h-5v5a.5.5 0 0 1-1 0v-5h-5a.5.5 0 0 1 0-1h5v-5A.5.5 0 0 1 8 2Z"/>
            </svg>
            <span className="whitespace-nowrap">{t('properties.createNew')}</span>
          </Button>
        </div>
      </div>

      {/* Properties Grid */}
      {properties && properties.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {properties.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
      ) : (
        <div 
          className="text-center p-12 rounded-lg border-2 border-dashed"
          style={{ 
            borderColor: 'var(--token-color-border-faint)',
            backgroundColor: 'var(--token-color-surface-faint)'
          }}
        >
          <div className="max-w-md mx-auto">
            <div 
              className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center"
              style={{ backgroundColor: 'var(--token-color-surface-secondary)' }}
            >
              <svg width="32" height="32" viewBox="0 0 16 16" fill="var(--token-color-foreground-faint)">
                <path d="M8.707 1.5a1 1 0 0 0-1.414 0L.646 8.146a.5.5 0 0 0 .708.707L2 8.207V13.5A1.5 1.5 0 0 0 3.5 15h9a1.5 1.5 0 0 0 1.5-1.5V8.207l.646.646a.5.5 0 0 0 .708-.707L13 5.793V2.5a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v1.293L8.707 1.5ZM13 7.207V13.5a.5.5 0 0 1-.5.5h-9a.5.5 0 0 1-.5-.5V7.207l5-5 5 5Z"/>
              </svg>
            </div>
            <h3 
              className="hds-typography-display-200 mb-2"
              style={{ color: 'var(--token-color-foreground-primary)' }}
            >
              {t('properties.noPropertiesYet')}
            </h3>
            <p 
              className="hds-typography-body-200 mb-6"
              style={{ color: 'var(--token-color-foreground-faint)' }}
            >
              {t('properties.getStartedMessage')}
            </p>
            <Button variant="primary" onClick={handleCreateNewProperty}>
              {t('properties.createFirstProperty')}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PropertiesPage;

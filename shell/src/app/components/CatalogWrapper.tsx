import React from 'react';
import { App as CatalogApp } from '@mfe-multiapp/catalog';

const CatalogWrapper: React.FC = () => {
  return (
    <div style={{ width: '100%', minHeight: 'calc(100vh - 140px)' }}>
      <CatalogApp />
    </div>
  );
};

export default CatalogWrapper;
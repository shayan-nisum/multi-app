import React from 'react';
import { App as CheckoutApp } from '@mfe-multiapp/checkout';

const CheckoutWrapper: React.FC = () => {
  return (
    <div style={{ width: '100%', minHeight: 'calc(100vh - 140px)' }}>
      <CheckoutApp />
    </div>
  );
};

export default CheckoutWrapper;
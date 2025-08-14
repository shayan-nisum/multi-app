import React from 'react';
import { Card, Button } from '@mfe-multiapp/shared-ui';
import { useGlobalStore } from '@mfe-multiapp/shared-state';

const HomePage: React.FC = () => {
  const { setProducts } = useGlobalStore();

  React.useEffect(() => {
    // Initialize sample products
    const sampleProducts = [
      {
        id: '1',
        name: 'Laptop Pro',
        price: 1299.99,
        description: 'High-performance laptop for professionals',
        image: 'https://via.placeholder.com/300x200'
      },
      {
        id: '2',
        name: 'Wireless Headphones',
        price: 199.99,
        description: 'Premium noise-canceling headphones',
        image: 'https://via.placeholder.com/300x200'
      },
      {
        id: '3',
        name: 'Smart Watch',
        price: 299.99,
        description: 'Advanced fitness tracking smartwatch',
        image: 'https://via.placeholder.com/300x200'
      },
      {
        id: '4',
        name: 'Tablet',
        price: 499.99,
        description: 'Lightweight tablet for productivity',
        image: 'https://via.placeholder.com/300x200'
      }
    ];
    setProducts(sampleProducts);
  }, [setProducts]);

  return (
    <div style={{ padding: '40px 20px', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <h1 style={{ fontSize: '48px', marginBottom: '20px', color: '#333' }}>
          Welcome to Our Store
        </h1>
        <p style={{ fontSize: '18px', color: '#666', maxWidth: '600px', margin: '0 auto' }}>
          Discover our amazing collection of products. This is a multi-SPA micro frontend 
          architecture demonstration with shared state management and component libraries.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px', marginBottom: '40px' }}>
        <Card title="🛍️ Product Catalog">
          <p>Browse our extensive collection of products with detailed descriptions and images.</p>
          <Button onClick={() => window.location.href = '/catalog'}>
            View Catalog
          </Button>
        </Card>

        <Card title="🛒 Shopping Cart">
          <p>Review your selected items and proceed to checkout securely.</p>
          <Button onClick={() => window.location.href = '/checkout'}>
            Go to Checkout
          </Button>
        </Card>

        <Card title="🔧 Shared Components">
          <p>Built with a shared design system for consistent user experience.</p>
          <Button variant="secondary" disabled>
            Design System
          </Button>
        </Card>

        <Card title="⚡ Real-time State">
          <p>Global state management with session storage persistence.</p>
          <Button variant="secondary" disabled>
            State Management
          </Button>
        </Card>
      </div>

      <div style={{ 
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        padding: '40px',
        borderRadius: '12px',
        textAlign: 'center'
      }}>
        <h2 style={{ marginBottom: '20px' }}>Micro Frontend Architecture</h2>
        <p style={{ fontSize: '16px', opacity: 0.9, maxWidth: '800px', margin: '0 auto' }}>
          This application demonstrates a modern micro frontend architecture using NX, 
          with independent deployable applications sharing common libraries and state management.
        </p>
      </div>
    </div>
  );
};

export default HomePage;
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Header } from '@mfe-multiapp/shared-ui';
import { useGlobalStore } from '@mfe-multiapp/shared-state';

// Lazy load micro frontends
const CatalogApp = React.lazy(() => import('./components/CatalogWrapper'));
const CheckoutApp = React.lazy(() => import('./components/CheckoutWrapper'));
const HomePage = React.lazy(() => import('./components/HomePage'));

export function App() {
  const { cartItems, setCurrentRoute } = useGlobalStore();

  React.useEffect(() => {
    // Update current route in global state
    const path = window.location.pathname;
    setCurrentRoute(path);
  }, [setCurrentRoute]);

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
      <Header 
        title="Multi-SPA MFE Application" 
        cartCount={cartItems.length}
        onCartClick={() => window.location.href = '/checkout'}
      />
      
      <nav style={{ 
        padding: '10px 20px', 
        backgroundColor: 'white', 
        borderBottom: '1px solid #dee2e6',
        display: 'flex',
        gap: '20px'
      }}>
        <a 
          href="/" 
          style={{ 
            textDecoration: 'none', 
            color: '#007bff',
            fontWeight: window.location.pathname === '/' ? 'bold' : 'normal'
          }}
        >
          Home
        </a>
        <a 
          href="/catalog" 
          style={{ 
            textDecoration: 'none', 
            color: '#007bff',
            fontWeight: window.location.pathname === '/catalog' ? 'bold' : 'normal'
          }}
        >
          Catalog
        </a>
        <a 
          href="/checkout" 
          style={{ 
            textDecoration: 'none', 
            color: '#007bff',
            fontWeight: window.location.pathname === '/checkout' ? 'bold' : 'normal'
          }}
        >
          Checkout
        </a>
      </nav>

      <main style={{ padding: '20px' }}>
        <React.Suspense fallback={<div>Loading...</div>}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/catalog" element={<CatalogApp />} />
            <Route path="/checkout" element={<CheckoutApp />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </React.Suspense>
      </main>
    </div>
  );
}

export default App;

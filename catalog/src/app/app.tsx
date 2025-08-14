import React from 'react';
import { Card, Button } from '@mfe-multiapp/shared-ui';
import { useGlobalStore, type Product } from '@mfe-multiapp/shared-state';
import { formatUtils } from '@mfe-multiapp/shared-utils';
import { Route, Routes, Link } from 'react-router-dom';

export function App() {
  const { products, addToCart, cartItems } = useGlobalStore();

  const handleAddToCart = (product: Product) => {
    addToCart(product);
    // Notify parent shell about cart update
    window.parent.postMessage({ 
      type: 'CART_UPDATED', 
      cartCount: cartItems.length + 1 
    }, '*');
  };

  return (
    <div style={{ padding: '20px', minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <h1 style={{ textAlign: 'center', marginBottom: '30px', color: '#333' }}>
          Product Catalog
        </h1>
        
        {products.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px' }}>
            <p style={{ fontSize: '18px', color: '#666' }}>
              No products available. Please go back to the home page to load products.
            </p>
            <Button onClick={() => window.parent.postMessage({ type: 'NAVIGATE', path: '/' }, '*')}>
              Go to Home
            </Button>
          </div>
        ) : (
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', 
            gap: '25px' 
          }}>
            {products.map((product) => (
              <Card key={product.id}>
                <div style={{ textAlign: 'center', height: 'fit-content' }}>
                  {product.image && (
                    <img 
                      src={product.image} 
                      alt={product.name}
                      style={{ 
                        width: '100%', 
                        height: '200px', 
                        objectFit: 'cover', 
                        borderRadius: '8px',
                        marginBottom: '15px'
                      }}
                    />
                  )}
                  <h3 style={{ margin: '0 0 10px 0', color: '#333' }}>
                    {product.name}
                  </h3>
                  <p style={{ 
                    margin: '0 0 15px 0', 
                    color: '#666', 
                    fontSize: '14px',
                    lineHeight: '1.5'
                  }}>
                    {product.description}
                  </p>
                  <p style={{ 
                    fontSize: '24px', 
                    fontWeight: 'bold', 
                    color: '#28a745',
                    margin: '0 0 20px 0'
                  }}>
                    {formatUtils.currency(product.price)}
                  </p>
                  <div style={{ width: '100%' }}>
                    <Button onClick={() => handleAddToCart(product)}>
                      Add to Cart
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        <div style={{ 
          marginTop: '40px', 
          padding: '20px', 
          backgroundColor: 'white', 
          borderRadius: '8px',
          textAlign: 'center'
        }}>
          <h3>Cart Summary</h3>
          <p>Items in cart: {cartItems.length}</p>
          <p>Total: {formatUtils.currency(
            cartItems.reduce((sum, item) => sum + item.price, 0)
          )}</p>
          {cartItems.length > 0 && (
            <Button 
              onClick={() => window.parent.postMessage({ type: 'NAVIGATE', path: '/checkout' }, '*')}
              variant="primary"
            >
              Proceed to Checkout
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;

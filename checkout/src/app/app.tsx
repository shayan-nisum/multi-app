import React from 'react';
import { Card, Button } from '@mfe-multiapp/shared-ui';
import { useGlobalStore } from '@mfe-multiapp/shared-state';
import { formatUtils, validationUtils } from '@mfe-multiapp/shared-utils';

export function App() {
  const { cartItems, removeFromCart, clearCart, setUser } = useGlobalStore();
  const [customerInfo, setCustomerInfo] = React.useState({
    name: '',
    email: '',
    address: '',
    city: '',
    zipCode: ''
  });
  const [errors, setErrors] = React.useState<Record<string, string>>({});
  const [isProcessing, setIsProcessing] = React.useState(false);

  const total = cartItems.reduce((sum, item) => sum + item.price, 0);
  const tax = total * 0.08; // 8% tax
  const grandTotal = total + tax;

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!validationUtils.isRequired(customerInfo.name)) {
      newErrors.name = 'Name is required';
    }

    if (!validationUtils.isEmail(customerInfo.email)) {
      newErrors.email = 'Valid email is required';
    }

    if (!validationUtils.isRequired(customerInfo.address)) {
      newErrors.address = 'Address is required';
    }

    if (!validationUtils.isRequired(customerInfo.city)) {
      newErrors.city = 'City is required';
    }

    if (!validationUtils.isRequired(customerInfo.zipCode)) {
      newErrors.zipCode = 'ZIP code is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: string, value: string) => {
    setCustomerInfo(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleSubmitOrder = async () => {
    if (!validateForm()) return;

    setIsProcessing(true);
    
    // Simulate order processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Save user info
    setUser({ name: customerInfo.name, email: customerInfo.email });
    
    // Clear cart
    clearCart();
    
    // Show success message
    alert('Order placed successfully! Thank you for your purchase.');
    
    // Notify parent shell
    window.parent.postMessage({ type: 'ORDER_COMPLETED' }, '*');
    
    setIsProcessing(false);
  };

  return (
    <div style={{ padding: '20px', minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        <h1 style={{ textAlign: 'center', marginBottom: '30px', color: '#333' }}>
          Checkout
        </h1>

        {cartItems.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px' }}>
            <p style={{ fontSize: '18px', color: '#666', marginBottom: '20px' }}>
              Your cart is empty. Please add some products to continue.
            </p>
            <Button onClick={() => window.parent.postMessage({ type: 'NAVIGATE', path: '/catalog' }, '*')}>
              Browse Products
            </Button>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 400px', gap: '30px' }}>
            {/* Customer Information */}
            <Card title="Customer Information">
              <div style={{ display: 'grid', gap: '15px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                    Full Name *
                  </label>
                  <input
                    type="text"
                    value={customerInfo.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px',
                      border: errors.name ? '2px solid #dc3545' : '1px solid #ddd',
                      borderRadius: '4px',
                      fontSize: '14px'
                    }}
                    placeholder="Enter your full name"
                  />
                  {errors.name && (
                    <p style={{ color: '#dc3545', fontSize: '12px', margin: '5px 0 0 0' }}>
                      {errors.name}
                    </p>
                  )}
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                    Email Address *
                  </label>
                  <input
                    type="email"
                    value={customerInfo.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px',
                      border: errors.email ? '2px solid #dc3545' : '1px solid #ddd',
                      borderRadius: '4px',
                      fontSize: '14px'
                    }}
                    placeholder="Enter your email"
                  />
                  {errors.email && (
                    <p style={{ color: '#dc3545', fontSize: '12px', margin: '5px 0 0 0' }}>
                      {errors.email}
                    </p>
                  )}
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                    Address *
                  </label>
                  <input
                    type="text"
                    value={customerInfo.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px',
                      border: errors.address ? '2px solid #dc3545' : '1px solid #ddd',
                      borderRadius: '4px',
                      fontSize: '14px'
                    }}
                    placeholder="Enter your address"
                  />
                  {errors.address && (
                    <p style={{ color: '#dc3545', fontSize: '12px', margin: '5px 0 0 0' }}>
                      {errors.address}
                    </p>
                  )}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 120px', gap: '15px' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                      City *
                    </label>
                    <input
                      type="text"
                      value={customerInfo.city}
                      onChange={(e) => handleInputChange('city', e.target.value)}
                      style={{
                        width: '100%',
                        padding: '10px',
                        border: errors.city ? '2px solid #dc3545' : '1px solid #ddd',
                        borderRadius: '4px',
                        fontSize: '14px'
                      }}
                      placeholder="City"
                    />
                    {errors.city && (
                      <p style={{ color: '#dc3545', fontSize: '12px', margin: '5px 0 0 0' }}>
                        {errors.city}
                      </p>
                    )}
                  </div>

                  <div>
                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                      ZIP Code *
                    </label>
                    <input
                      type="text"
                      value={customerInfo.zipCode}
                      onChange={(e) => handleInputChange('zipCode', e.target.value)}
                      style={{
                        width: '100%',
                        padding: '10px',
                        border: errors.zipCode ? '2px solid #dc3545' : '1px solid #ddd',
                        borderRadius: '4px',
                        fontSize: '14px'
                      }}
                      placeholder="ZIP"
                    />
                    {errors.zipCode && (
                      <p style={{ color: '#dc3545', fontSize: '12px', margin: '5px 0 0 0' }}>
                        {errors.zipCode}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </Card>

            {/* Order Summary */}
            <div>
              <Card title="Order Summary">
                <div style={{ marginBottom: '20px' }}>
                  {cartItems.map((item) => (
                    <div key={item.id} style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'center',
                      padding: '10px 0',
                      borderBottom: '1px solid #eee'
                    }}>
                      <div>
                        <h4 style={{ margin: '0 0 5px 0', fontSize: '14px' }}>{item.name}</h4>
                        <p style={{ margin: 0, fontSize: '12px', color: '#666' }}>
                          {formatUtils.currency(item.price)}
                        </p>
                      </div>
                      <div style={{ padding: '5px 10px', fontSize: '12px' }}>
                        <Button 
                          variant="danger" 
                          onClick={() => removeFromCart(item.id)}
                        >
                          Remove
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>

                <div style={{ borderTop: '2px solid #ddd', paddingTop: '15px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                    <span>Subtotal:</span>
                    <span>{formatUtils.currency(total)}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                    <span>Tax (8%):</span>
                    <span>{formatUtils.currency(tax)}</span>
                  </div>
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    fontSize: '18px', 
                    fontWeight: 'bold',
                    paddingTop: '10px',
                    borderTop: '1px solid #ddd'
                  }}>
                    <span>Total:</span>
                    <span>{formatUtils.currency(grandTotal)}</span>
                  </div>
                </div>

                <div style={{ width: '100%', marginTop: '20px', padding: '15px' }}>
                  <Button 
                    onClick={handleSubmitOrder}
                    disabled={isProcessing}
                  >
                    {isProcessing ? 'Processing...' : 'Place Order'}
                  </Button>
                </div>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;

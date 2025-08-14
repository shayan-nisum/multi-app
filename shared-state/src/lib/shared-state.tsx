import styles from './shared-state.module.css';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

// Product interface
export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  image?: string;
}

// Global store interface
interface GlobalStore {
  // Product list state
  products: Product[];
  setProducts: (products: Product[]) => void;
  
  // Cart state
  cartItems: Product[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  
  // User state
  user: { name: string; email: string } | null;
  setUser: (user: { name: string; email: string } | null) => void;
  
  // Navigation state
  currentRoute: string;
  setCurrentRoute: (route: string) => void;
}

// Global store with session storage persistence
export const useGlobalStore = create<GlobalStore>()(
  persist(
    (set, get) => ({
      // Product state
      products: [],
      setProducts: (products) => set({ products }),
      
      // Cart state
      cartItems: [],
      addToCart: (product) => set((state) => ({
        cartItems: [...state.cartItems, product]
      })),
      removeFromCart: (productId) => set((state) => ({
        cartItems: state.cartItems.filter(item => item.id !== productId)
      })),
      clearCart: () => set({ cartItems: [] }),
      
      // User state
      user: null,
      setUser: (user) => set({ user }),
      
      // Navigation state
      currentRoute: '/',
      setCurrentRoute: (route) => set({ currentRoute: route }),
    }),
    {
      name: 'mfe-global-state',
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);

// Export product list component
export const ProductList = () => {
  const { products, addToCart } = useGlobalStore();
  
  return (
    <div style={{ padding: '20px' }}>
      <h2>Product Catalog</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
        {products.map((product) => (
          <div key={product.id} style={{ border: '1px solid #ddd', padding: '15px', borderRadius: '8px' }}>
            <h3>{product.name}</h3>
            <p>{product.description}</p>
            <p style={{ fontSize: '18px', fontWeight: 'bold' }}>${product.price}</p>
            <button 
              onClick={() => addToCart(product)}
              style={{ 
                padding: '10px 20px', 
                backgroundColor: '#007bff', 
                color: 'white', 
                border: 'none', 
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Add to Cart
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export function SharedState() {
  return (
    <div className={styles['container']}>
      <h1>Welcome to SharedState!</h1>
    </div>
  );
}

export default SharedState;

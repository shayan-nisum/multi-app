# Step-by-Step Guide: Building a Micro Frontend Application

## Table of Contents
1. [Introduction & Prerequisites](#introduction--prerequisites)
2. [Step 1: Setting up the Nx Workspace](#step-1-setting-up-the-nx-workspace)
3. [Step 2: Creating Shared Libraries](#step-2-creating-shared-libraries)
4. [Step 3: Building the Shell Application](#step-3-building-the-shell-application)
5. [Step 4: Creating Micro Frontend Applications](#step-4-creating-micro-frontend-applications)
6. [Step 5: Implementing State Management](#step-5-implementing-state-management)
7. [Step 6: Setting up Routing and Navigation](#step-6-setting-up-routing-and-navigation)
8. [Step 7: Inter-Application Communication](#step-7-inter-application-communication)
9. [Step 8: Testing and Development Workflow](#step-8-testing-and-development-workflow)
10. [Key Concepts Explained](#key-concepts-explained)
11. [Common Challenges and Solutions](#common-challenges-and-solutions)

---

## Introduction & Prerequisites

### What We're Building
We'll create a **Multi-Application E-commerce System** using **Micro Frontend Architecture** that includes:
- **Shell App**: Main application that orchestrates everything
- **Catalog App**: Product browsing micro frontend
- **Checkout App**: Order processing micro frontend
- **Shared Libraries**: Common functionality used across apps

### Why Micro Frontends?
- **Team Independence**: Different teams can work on different parts
- **Technology Flexibility**: Each app can use different tech (though we'll use React for consistency)
- **Independent Deployment**: Deploy parts of your application separately
- **Scalability**: Add new features as separate applications

### Prerequisites
- Node.js (v18+)
- Basic React/TypeScript knowledge
- Understanding of npm/package management

---

## Step 1: Setting up the Nx Workspace

### What is Nx?
**Nx** is a build system and toolkit for monorepos. Think of it as a sophisticated project manager that helps you:
- Manage multiple applications in one repository
- Share code between applications
- Build and test applications efficiently
- Generate code templates

### Why Use Nx for MFE?
- **Monorepo Management**: Keep all your micro frontends in one place
- **Code Sharing**: Easily share libraries between applications
- **Build Optimization**: Only build what changed
- **Developer Experience**: Great tooling and generators

### Implementation Steps

#### 1.1 Create the Nx Workspace
```bash
# Install Nx globally
npm install -g nx

# Create a new workspace with React preset
npx create-nx-workspace@latest mfe-multiapp --preset=react --bundler=vite --packageManager=npm

# Navigate to the workspace
cd mfe-multiapp
```

**What happens here?**
- Creates a new folder with Nx configuration
- Sets up TypeScript configuration
- Installs React and Vite dependencies
- Creates initial project structure

#### 1.2 Understanding the Initial Structure
```
mfe-multiapp/
├── nx.json              # Nx workspace configuration
├── package.json         # Root dependencies
├── tsconfig.base.json   # Base TypeScript config
└── apps/               # Will contain our applications
```

**Key Files Explained:**
- **nx.json**: Tells Nx how to build and manage projects
- **package.json**: Contains dependencies shared by all apps
- **tsconfig.base.json**: TypeScript settings inherited by all projects

#### 1.3 Configure Nx for Our MFE Setup
```bash
# Remove the default app (we'll create our own)
nx g remove mfe-multiapp

# Install additional dependencies we'll need
npm install @module-federation/vite react-router-dom zustand
```

**Purpose**: Clean slate to build our specific MFE architecture.

---

## Step 2: Creating Shared Libraries

### What are Shared Libraries?
Shared libraries contain code that multiple applications use. Instead of duplicating code, we centralize it.

### Why Create Libraries First?
- **Foundation**: Apps depend on these libraries
- **Consistency**: Ensures all apps use the same components/utilities
- **Maintainability**: Change once, update everywhere

### Implementation Steps

#### 2.1 Create Shared State Library
```bash
# Generate the shared state library
nx g @nx/react:library shared-state --bundler=vite --unitTestRunner=none --directory=libs

# This creates: libs/shared-state/
```

**What this library will contain:**
- Global application state (cart, user, products)
- State management using Zustand
- State persistence logic

**Purpose**: Centralized state that all applications can access and modify.

#### 2.2 Create Shared UI Library
```bash
# Generate the shared UI components library
nx g @nx/react:library shared-ui --bundler=vite --unitTestRunner=none --directory=libs

# This creates: libs/shared-ui/
```

**What this library will contain:**
- Reusable React components (Button, Card, Header)
- Consistent styling across applications
- Common UI patterns

**Purpose**: Ensure visual consistency and reduce code duplication.

#### 2.3 Create Shared Utils Library
```bash
# Generate the shared utilities library
nx g @nx/js:library shared-utils --bundler=vite --unitTestRunner=none --directory=libs

# This creates: libs/shared-utils/
```

**What this library will contain:**
- Utility functions (formatting, validation, API calls)
- Helper functions used across applications
- Common business logic

**Purpose**: Centralize common functionality and reduce code duplication.

#### 2.4 Update tsconfig.base.json for Path Mapping
```json
{
  "compilerOptions": {
    "paths": {
      "@mfe-multiapp/shared-state": ["libs/shared-state/src/index.ts"],
      "@mfe-multiapp/shared-ui": ["libs/shared-ui/src/index.ts"],
      "@mfe-multiapp/shared-utils": ["libs/shared-utils/src/index.ts"]
    }
  }
}
```

**Purpose**: Allows clean imports like `import { Button } from '@mfe-multiapp/shared-ui'`

---

## Step 3: Building the Shell Application

### What is a Shell Application?
The shell (or host) application is the **main entry point** of your MFE system. It:
- Handles top-level routing
- Loads and displays micro frontends
- Manages the overall layout
- Coordinates between different applications

### Why Do We Need a Shell?
- **Single Entry Point**: Users access one URL
- **Coordination**: Manages which micro frontend to show
- **Shared Layout**: Common header, navigation, footer
- **State Coordination**: Manages global state

### Implementation Steps

#### 3.1 Generate the Shell Application
```bash
# Create the shell application
nx g @nx/react:app shell --bundler=vite --routing=true --style=css

# This creates: apps/shell/
```

#### 3.2 Configure Shell as Main Application
```bash
# Set shell to run on port 4200 (main port)
# Edit apps/shell/vite.config.ts
```

**Configuration Purpose**: The shell runs on the main port that users will access.

#### 3.3 Install Required Dependencies
```bash
# Install React Router for navigation
npm install react-router-dom

# Install shared libraries dependencies
npm install zustand
```

#### 3.4 Create Shell Application Structure
```
apps/shell/src/app/
├── app.tsx                 # Main app component with routing
├── components/
│   ├── HomePage.tsx        # Landing page
│   ├── CatalogWrapper.tsx  # Wrapper for catalog MFE
│   └── CheckoutWrapper.tsx # Wrapper for checkout MFE
```

**Purpose**: Organize the shell's responsibility for routing and MFE integration.

---

## Step 4: Creating Micro Frontend Applications

### What are Micro Frontend Applications?
These are **independent applications** that handle specific business domains:
- **Catalog**: Product browsing and selection
- **Checkout**: Order processing and payment

### Why Separate Applications?
- **Domain Separation**: Each app has a clear responsibility
- **Team Ownership**: Different teams can own different apps
- **Independent Development**: Can be built and deployed separately
- **Technology Flexibility**: Could use different frameworks if needed

### Implementation Steps

#### 4.1 Create Catalog Application
```bash
# Generate catalog micro frontend
nx g @nx/react:app catalog --bundler=vite --routing=true --style=css

# Configure to run on port 4201
# Edit apps/catalog/vite.config.ts to set port: 4201
```

**Purpose**: Dedicated application for product catalog functionality.

#### 4.2 Create Checkout Application
```bash
# Generate checkout micro frontend
nx g @nx/react:app checkout --bundler=vite --routing=true --style=css

# Configure to run on port 4202
# Edit apps/checkout/vite.config.ts to set port: 4202
```

**Purpose**: Dedicated application for order processing and customer information.

#### 4.3 Configure Port Strategy
```
Shell Application:    localhost:4200 (Main entry point)
Catalog Application:  localhost:4201 (Can run standalone)
Checkout Application: localhost:4202 (Can run standalone)
```

**Purpose**: Each app can run independently for development and testing.

---

## Step 5: Implementing State Management

### What is State Management in MFE?
State management in micro frontends is **sharing data between different applications**. This includes:
- Shopping cart items
- User information
- Product catalog
- Current navigation state

### Why Zustand for MFE?
- **Lightweight**: Minimal boilerplate
- **Framework Agnostic**: Works well across different applications
- **Persistence**: Can save state to localStorage/sessionStorage
- **TypeScript Support**: Great developer experience

### Implementation Steps

#### 5.1 Implement Shared State Library
Create the global store in `libs/shared-state/src/lib/shared-state.tsx`:

```typescript
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

// Define what data we'll share globally
interface GlobalStore {
  // Product catalog
  products: Product[];
  setProducts: (products: Product[]) => void;
  
  // Shopping cart
  cartItems: Product[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  
  // User data
  user: { name: string; email: string } | null;
  setUser: (user: { name: string; email: string } | null) => void;
}

// Create the store with persistence
export const useGlobalStore = create<GlobalStore>()(
  persist(
    (set, get) => ({
      // Implementation details...
    }),
    {
      name: 'mfe-global-state',
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);
```

**Purpose**: Centralized state that persists across page refreshes and is accessible by all applications.

#### 5.2 Build Shared Libraries
```bash
# Build all shared libraries so apps can use them
nx run-many --target=build --projects=shared-state,shared-ui,shared-utils
```

**Purpose**: Libraries must be built before applications can import and use them.

---

## Step 6: Setting up Routing and Navigation

### What is MFE Routing?
Routing in micro frontends involves **coordinating navigation between different applications**. We need:
- Main routing in the shell application
- Integration points for micro frontends
- Communication between applications for navigation

### Why This Approach?
- **Centralized Navigation**: Shell controls the main routes
- **Application Integration**: Each MFE is loaded as a component
- **URL Consistency**: Users see consistent URLs
- **Deep Linking**: Direct links to specific sections work

### Implementation Steps

#### 6.1 Implement Shell Routing
In `apps/shell/src/app/app.tsx`:

```typescript
import { Routes, Route, Navigate } from 'react-router-dom';
import { Header } from '@mfe-multiapp/shared-ui';
import { useGlobalStore } from '@mfe-multiapp/shared-state';

// Lazy load micro frontends for better performance
const CatalogApp = React.lazy(() => import('./components/CatalogWrapper'));
const CheckoutApp = React.lazy(() => import('./components/CheckoutWrapper'));
const HomePage = React.lazy(() => import('./components/HomePage'));

export function App() {
  const { cartItems } = useGlobalStore();

  return (
    <div>
      <Header title="MFE Application" cartCount={cartItems.length} />
      
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/catalog" element={<CatalogApp />} />
        <Route path="/checkout" element={<CheckoutApp />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}
```

**Purpose**: Shell acts as the main router, deciding which micro frontend to display.

#### 6.2 Create MFE Wrapper Components
These components integrate the micro frontends into the shell:

```typescript
// apps/shell/src/app/components/CatalogWrapper.tsx
import { App as CatalogApp } from '@mfe-multiapp/catalog';

const CatalogWrapper = () => {
  return (
    <div style={{ width: '100%', minHeight: 'calc(100vh - 140px)' }}>
      <CatalogApp />
    </div>
  );
};
```

**Purpose**: Wrapper components provide integration points and can handle communication between shell and MFEs.

---

## Step 7: Inter-Application Communication

### What is Inter-App Communication?
Micro frontends need to **communicate with each other** for:
- Sharing state changes
- Navigation requests
- Event notifications
- Data synchronization

### Communication Patterns We Use

#### 7.1 Shared State (Primary Pattern)
```typescript
// Any application can access the global store
const { cartItems, addToCart } = useGlobalStore();

// Add item to cart from catalog
addToCart(product);

// Cart count automatically updates in header
```

**Purpose**: Most communication happens through shared state.

#### 7.2 PostMessage API (For Navigation)
```typescript
// From micro frontend to shell
window.parent.postMessage({ 
  type: 'NAVIGATE', 
  path: '/checkout' 
}, '*');

// Shell listens and navigates
window.addEventListener('message', (event) => {
  if (event.data.type === 'NAVIGATE') {
    navigate(event.data.path);
  }
});
```

**Purpose**: Allows micro frontends to request navigation changes.

#### 7.3 Custom Events (For Notifications)
```typescript
// Emit custom event
const event = new CustomEvent('cart-updated', { 
  detail: { cartCount: cartItems.length } 
});
window.dispatchEvent(event);

// Listen for custom event
window.addEventListener('cart-updated', (event) => {
  console.log('Cart updated:', event.detail);
});
```

**Purpose**: Loose coupling for notifications and events.

---

## Step 8: Testing and Development Workflow

### Development Commands

#### 8.1 Build Shared Libraries First
```bash
# Always build shared libraries before running apps
nx run-many --target=build --projects=shared-state,shared-ui,shared-utils
```

**Purpose**: Applications depend on these libraries, so they must be built first.

#### 8.2 Start Development Servers
```bash
# Option 1: Start all applications in parallel
nx run-many --target=serve --projects=shell,catalog,checkout --parallel

# Option 2: Start individually
nx serve shell    # localhost:4200
nx serve catalog  # localhost:4201
nx serve checkout # localhost:4202
```

**Purpose**: Run all applications simultaneously for integrated development.

#### 8.3 Development Workflow
1. **Make changes to shared libraries** → Rebuild them
2. **Make changes to applications** → Hot reload automatically
3. **Test in browser** → Check all applications work together
4. **Build for production** → Ensure everything builds correctly

---

## Key Concepts Explained

### 1. Monorepo
**What it is**: Single repository containing multiple related projects.
**Why use it**: 
- Easier dependency management
- Code sharing between projects
- Atomic commits across projects
- Simplified CI/CD

### 2. Micro Frontends
**What it is**: Architectural pattern where frontend is composed of independent applications.
**Benefits**:
- Team autonomy
- Independent deployment
- Technology diversity
- Fault isolation

### 3. Shell/Host Application
**What it is**: Main application that orchestrates micro frontends.
**Responsibilities**:
- Routing coordination
- Layout management
- MFE integration
- Global state coordination

### 4. Proxy Pattern
**What it is**: Shell acts as a proxy, directing requests to appropriate micro frontends.
**How it works**:
- User accesses shell URL
- Shell determines which MFE to show
- Shell loads and displays the appropriate MFE
- Shell coordinates communication between MFEs

### 5. Shared Libraries
**What they are**: Common code used across multiple applications.
**Types**:
- **State**: Global application state
- **UI**: Reusable components
- **Utils**: Common functions and helpers

### 6. Build Orchestration
**What it is**: Coordinating builds across multiple applications.
**Process**:
1. Build shared libraries first
2. Build applications that depend on libraries
3. Test integration between applications
4. Package for deployment

---

## Common Challenges and Solutions

### Challenge 1: Dependency Management
**Problem**: Keeping dependencies in sync across multiple applications.
**Solution**: 
- Use monorepo with shared package.json
- Define dependencies at root level
- Use Nx dependency graph to track relationships

### Challenge 2: State Synchronization
**Problem**: Keeping state consistent across multiple applications.
**Solution**:
- Use centralized state management (Zustand)
- Implement state persistence
- Define clear state ownership rules

### Challenge 3: Development Workflow
**Problem**: Complex development setup with multiple applications.
**Solution**:
- Use Nx commands to manage multiple projects
- Implement hot reloading for fast development
- Create scripts for common operations

### Challenge 4: Communication Between Apps
**Problem**: Applications need to communicate but should remain independent.
**Solution**:
- Primary: Shared state for data
- Secondary: PostMessage for navigation
- Tertiary: Custom events for notifications

### Challenge 5: Build and Deployment
**Problem**: Coordinating builds and deployments across multiple applications.
**Solution**:
- Build shared libraries first
- Use Nx task dependencies
- Implement proper CI/CD pipeline
- Consider deployment strategies (monolithic vs independent)

---

## Presentation Tips

### For Technical Audience
1. **Start with Architecture**: Show the high-level diagram
2. **Explain Benefits**: Focus on scalability and team independence
3. **Live Demo**: Show how applications work together
4. **Code Walkthrough**: Highlight key integration points

### For Business Audience
1. **Focus on Benefits**: Team productivity, faster delivery
2. **Use Analogies**: Compare to microservices but for frontend
3. **Show Results**: Demonstrate the working application
4. **Discuss ROI**: Faster development, easier maintenance

### For Beginners
1. **Start with Concepts**: Explain what micro frontends are
2. **Show Simple Examples**: Start with basic communication
3. **Build Gradually**: Add complexity step by step
4. **Emphasize Practice**: Encourage hands-on experimentation

---

## Next Steps

### Immediate Improvements
1. **Add Tests**: Unit and integration tests for all applications
2. **Improve Styling**: Better CSS and responsive design
3. **Error Handling**: Proper error boundaries and fallbacks
4. **Performance**: Lazy loading and optimization

### Advanced Features
1. **Module Federation**: True runtime integration
2. **Independent Deployment**: Deploy MFEs separately
3. **A/B Testing**: Test different versions of MFEs
4. **Monitoring**: Track performance across applications

### Production Readiness
1. **CI/CD Pipeline**: Automated build and deployment
2. **Environment Configuration**: Development, staging, production
3. **Security**: Proper CORS and CSP configuration
4. **Monitoring**: Application performance and error tracking

---

This guide provides a complete foundation for understanding and building micro frontend applications using modern tools and patterns. Each step builds upon the previous one, creating a comprehensive learning experience for developers at any level.
# Micro Frontend (MFE) Multi-Application Documentation

## Table of Contents
1. [Project Overview](#project-overview)
2. [Architecture](#architecture)
3. [Monorepo Structure](#monorepo-structure)
4. [Setup and Installation](#setup-and-installation)
5. [Application Components](#application-components)
6. [Shared Libraries](#shared-libraries)
7. [Routing and Navigation](#routing-and-navigation)
8. [State Management](#state-management)
9. [Development Workflow](#development-workflow)
10. [Communication Patterns](#communication-patterns)
11. [Best Practices](#best-practices)
12. [Deployment](#deployment)

## Project Overview

This project demonstrates a modern **Micro Frontend (MFE)** architecture using a **monorepo setup** with **Nx** as the build system. The project implements a multi-application e-commerce system where different applications handle distinct business domains while sharing common functionality through shared libraries.

### Key Features
- **Monorepo Architecture**: Single repository containing multiple applications and shared libraries
- **Independent Applications**: Each micro frontend can be developed, tested, and deployed independently
- **Shared State Management**: Global state using Zustand with persistence
- **Shared UI Components**: Reusable components across applications
- **Shared Utilities**: Common functions and helpers
- **Shell Application**: Acts as a proxy/orchestrator for routing between micro frontends

### Technology Stack
- **Build System**: Nx (Extensible dev tools for monorepos)
- **Frontend Framework**: React 19 with TypeScript
- **Bundler**: Vite
- **State Management**: Zustand with persistence
- **Routing**: React Router DOM
- **Styling**: CSS Modules
- **Package Management**: npm with workspaces

## Architecture

### High-Level Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                        SHELL APP                            │
│                     (Port: 4200)                           │
│  ┌─────────────────────────────────────────────────────┐   │
│  │              Routing & Navigation                    │   │
│  │  ┌─────────┐  ┌─────────┐  ┌─────────────┐         │   │
│  │  │  Home   │  │ Catalog │  │  Checkout   │         │   │
│  │  │ Wrapper │  │ Wrapper │  │   Wrapper   │         │   │
│  │  └─────────┘  └─────────┘  └─────────────┘         │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
            │                   │                   │
            ▼                   ▼                   ▼
┌─────────────────┐   ┌─────────────────┐   ┌─────────────────┐
│   CATALOG APP   │   │  CHECKOUT APP   │   │    HOME PAGE    │
│  (Port: 4201)   │   │  (Port: 4202)   │   │   (Embedded)    │
│                 │   │                 │   │                 │
│ Product Display │   │ Cart Management │   │ Product Loading │
│ Add to Cart     │   │ Customer Forms  │   │ Welcome Screen  │
│ Browse Products │   │ Order Processing│   │                 │
└─────────────────┘   └─────────────────┘   └─────────────────┘
            │                   │                   │
            └───────────────────┼───────────────────┘
                                │
                   ┌─────────────────────────┐
                   │    SHARED LIBRARIES     │
                   │                         │
                   │ ┌─────────────────────┐ │
                   │ │   Shared State      │ │
                   │ │   (Zustand Store)   │ │
                   │ └─────────────────────┘ │
                   │ ┌─────────────────────┐ │
                   │ │   Shared UI         │ │
                   │ │   (Components)      │ │
                   │ └─────────────────────┘ │
                   │ ┌─────────────────────┐ │
                   │ │   Shared Utils      │ │
                   │ │   (Helpers)         │ │
                   │ └─────────────────────┘ │
                   └─────────────────────────┘
```

### Architecture Principles

1. **Domain-Driven Design**: Each micro frontend represents a specific business domain
2. **Independent Development**: Teams can work on different applications simultaneously
3. **Shared Dependencies**: Common functionality is centralized in shared libraries
4. **Loose Coupling**: Applications communicate through well-defined interfaces
5. **Technology Consistency**: All applications use the same tech stack for simplicity

## Monorepo Structure

```
mfe-multiapp/
├── nx.json                     # Nx workspace configuration
├── package.json                # Root package dependencies
├── tsconfig.base.json          # Base TypeScript configuration
├── README.md                   # Project overview
│
├── shell/                      # Shell/Host Application (Port: 4200)
│   ├── src/
│   │   ├── main.tsx           # Application entry point
│   │   ├── app/
│   │   │   ├── app.tsx        # Main app component with routing
│   │   │   └── components/
│   │   │       ├── CatalogWrapper.tsx   # Catalog MFE wrapper
│   │   │       ├── CheckoutWrapper.tsx  # Checkout MFE wrapper
│   │   │       └── HomePage.tsx         # Home page component
│   │   └── styles.css
│   ├── vite.config.ts         # Vite configuration
│   └── project.json           # Nx project configuration
│
├── catalog/                    # Catalog Micro Frontend (Port: 4201)
│   ├── src/
│   │   ├── main.tsx           # Standalone entry point
│   │   └── app/
│   │       └── app.tsx        # Catalog application logic
│   ├── vite.config.ts
│   └── project.json
│
├── checkout/                   # Checkout Micro Frontend (Port: 4202)
│   ├── src/
│   │   ├── main.tsx           # Standalone entry point
│   │   └── app/
│   │       └── app.tsx        # Checkout application logic
│   ├── vite.config.ts
│   └── project.json
│
├── shared-state/               # Global State Management Library
│   ├── src/
│   │   ├── index.ts           # Export barrel
│   │   └── lib/
│   │       └── shared-state.tsx  # Zustand store definition
│   ├── vite.config.ts
│   └── project.json
│
├── shared-ui/                  # Shared UI Components Library
│   ├── src/
│   │   ├── index.ts           # Export barrel
│   │   └── lib/
│   │       ├── shared-ui.tsx     # UI components
│   │       └── shared-ui.module.css  # Component styles
│   ├── vite.config.ts
│   └── project.json
│
└── shared-utils/               # Shared Utilities Library
    ├── src/
    │   ├── index.ts           # Export barrel
    │   └── lib/
    │       └── shared-utils.ts   # Utility functions
    ├── vite.config.ts
    └── project.json
```

## Setup and Installation

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn package manager

### Installation Steps

1. **Clone the repository**
```bash
git clone <repository-url>
cd mfe-multiapp
```

2. **Install dependencies**
```bash
npm install
```

3. **Build shared libraries**
```bash
npx nx run-many --target=build --projects=shared-state,shared-ui,shared-utils
```

4. **Start development servers**

**Option A: Start all applications simultaneously**
```bash
# Terminal 1: Shell application
npx nx serve shell

# Terminal 2: Catalog application
npx nx serve catalog

# Terminal 3: Checkout application
npx nx serve checkout
```

**Option B: Use Nx to run multiple targets**
```bash
npx nx run-many --target=serve --projects=shell,catalog,checkout --parallel
```

### Application URLs
- **Shell (Main)**: http://localhost:4200
- **Catalog**: http://localhost:4201 (standalone)
- **Checkout**: http://localhost:4202 (standalone)

## Application Components

### 1. Shell Application (Host)

The shell application acts as the **main entry point** and **routing orchestrator** for the entire MFE system.

**Key Responsibilities:**
- Main application routing using React Router
- Navigation between micro frontends
- Shared header and navigation components
- Global layout and styling
- Integration of micro frontend wrappers

**Key Files:**
- `shell/src/app/app.tsx` - Main routing logic
- `shell/src/app/components/CatalogWrapper.tsx` - Catalog integration
- `shell/src/app/components/CheckoutWrapper.tsx` - Checkout integration
- `shell/src/app/components/HomePage.tsx` - Landing page

### 2. Catalog Application

Independent micro frontend for product browsing and catalog management.

**Features:**
- Product grid display with images, descriptions, and prices
- Add to cart functionality
- Product filtering and search (extensible)
- Responsive design
- Integration with shared state for cart management

**Key Components:**
- Product listing with cards
- Add to cart buttons
- Cart summary display
- Navigation to checkout

### 3. Checkout Application

Dedicated micro frontend for order processing and customer information.

**Features:**
- Shopping cart review and management
- Customer information forms with validation
- Order total calculations (including tax)
- Order processing simulation
- Form validation using shared utilities

**Key Components:**
- Customer information form
- Order summary with item management
- Price calculations
- Order submission handling

## Shared Libraries

### 1. Shared State (`shared-state`)

**Purpose**: Centralized state management using Zustand with session storage persistence.

**Key Features:**
- Global product catalog
- Shopping cart state
- User information
- Current route tracking
- Session persistence

**Store Structure:**
```typescript
interface GlobalStore {
  // Product management
  products: Product[];
  setProducts: (products: Product[]) => void;
  
  // Cart management
  cartItems: Product[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  
  // User management
  user: { name: string; email: string } | null;
  setUser: (user: { name: string; email: string } | null) => void;
  
  // Navigation state
  currentRoute: string;
  setCurrentRoute: (route: string) => void;
}
```

### 2. Shared UI (`shared-ui`)

**Purpose**: Reusable UI components with consistent styling across applications.

**Components:**
- **Button**: Configurable button with variants (primary, secondary, danger)
- **Card**: Container component for content sections
- **Header**: Application header with title and cart display
- **Loading**: Loading spinner component

**Styling**: CSS Modules for scoped styling

### 3. Shared Utils (`shared-utils`)

**Purpose**: Common utility functions and helpers used across applications.

**Utility Categories:**
- **API Utils**: HTTP request helpers (GET, POST)
- **Storage Utils**: Session and local storage helpers
- **Format Utils**: Currency, date, and number formatting
- **Validation Utils**: Form validation functions
- **Event Utils**: Custom event handling for MFE communication
- **Performance Utils**: Debounce and throttle functions

## Routing and Navigation

### Router Architecture

The project uses a **hybrid routing approach**:

1. **Shell-Level Routing**: React Router in the shell application handles main navigation
2. **Application-Level Routing**: Each micro frontend can have internal routing
3. **Cross-Application Navigation**: PostMessage API for communication

### Route Structure

```
/ (Shell Application)
├── / → HomePage component
├── /catalog → CatalogWrapper → Catalog App
├── /checkout → CheckoutWrapper → Checkout App
└── /* → Redirect to /
```

### Navigation Implementation

**Shell App Router Setup:**
```typescript
<Routes>
  <Route path="/" element={<HomePage />} />
  <Route path="/catalog" element={<CatalogApp />} />
  <Route path="/checkout" element={<CheckoutApp />} />
  <Route path="*" element={<Navigate to="/" replace />} />
</Routes>
```

**Cross-Application Navigation:**
```typescript
// From Catalog to Checkout
window.parent.postMessage({ 
  type: 'NAVIGATE', 
  path: '/checkout' 
}, '*');
```

## State Management

### Zustand Store Implementation

The project uses **Zustand** for state management with **session storage persistence**.

**Store Features:**
- Lightweight and performant
- TypeScript support
- Session storage persistence
- Subscription-based updates
- No providers needed

**Example Usage:**
```typescript
// In any component
const { cartItems, addToCart, removeFromCart } = useGlobalStore();

// Add product to cart
const handleAddToCart = (product: Product) => {
  addToCart(product);
};
```

### State Persistence

State is automatically persisted to session storage:
- Cart items persist across page refreshes
- User information survives browser sessions
- Current route tracking for navigation state

## Development Workflow

### Development Commands

**Build Commands:**
```bash
# Build specific app
npx nx build shell
npx nx build catalog
npx nx build checkout

# Build shared libraries
npx nx build shared-state
npx nx build shared-ui
npx nx build shared-utils

# Build all projects
npx nx run-many --target=build --all
```

**Development Commands:**
```bash
# Serve specific app
npx nx serve shell
npx nx serve catalog

# Serve multiple apps
npx nx run-many --target=serve --projects=shell,catalog,checkout --parallel
```

**Testing Commands:**
```bash
# Test specific project
npx nx test shell

# Test all projects
npx nx run-many --target=test --all
```

### Development Best Practices

1. **Shared Library Changes**: Always rebuild shared libraries after changes
2. **Port Management**: Each application runs on a different port
3. **Hot Reload**: Changes in applications trigger automatic reloads
4. **Dependency Management**: Shared dependencies are managed at the root level

## Communication Patterns

### 1. Shared State Communication

**Primary Pattern**: Global Zustand store for shared data

```typescript
// Any application can access and modify global state
const { cartItems, addToCart } = useGlobalStore();
```

### 2. PostMessage Communication

**Use Case**: Navigation requests from micro frontends to shell

```typescript
// From micro frontend to shell
window.parent.postMessage({ 
  type: 'NAVIGATE', 
  path: '/checkout' 
}, '*');

// Shell listening for messages
window.addEventListener('message', (event) => {
  if (event.data.type === 'NAVIGATE') {
    navigate(event.data.path);
  }
});
```

### 3. Custom Events

**Use Case**: Decoupled component communication

```typescript
// Emit custom event
eventUtils.emit('cart-updated', { cartCount: cartItems.length });

// Listen for custom event
const cleanup = eventUtils.listen('cart-updated', (data) => {
  console.log('Cart updated:', data);
});
```

## Best Practices

### 1. Micro Frontend Design

- **Single Responsibility**: Each MFE should have a clear, focused purpose
- **Independent Deployment**: Applications should be deployable independently
- **Shared Dependencies**: Use shared libraries for common functionality
- **Consistent UX**: Maintain design consistency across applications

### 2. State Management

- **Minimize Shared State**: Only share state that truly needs to be global
- **Immutable Updates**: Use immutable patterns for state updates
- **Persistence Strategy**: Consider what state needs to persist and for how long

### 3. Communication

- **Prefer Shared State**: Use global state over message passing when possible
- **Type Safety**: Define interfaces for message contracts
- **Error Handling**: Implement proper error handling for cross-app communication

### 4. Development

- **Shared Libraries First**: Develop and test shared libraries before applications
- **Independent Testing**: Each application should be testable in isolation
- **Documentation**: Keep architecture documentation up to date

## Deployment

### Build Process

1. **Build Shared Libraries**
```bash
npx nx run-many --target=build --projects=shared-state,shared-ui,shared-utils
```

2. **Build Applications**
```bash
npx nx run-many --target=build --projects=shell,catalog,checkout
```

3. **Output Structure**
```
dist/
├── shell/          # Shell application build
├── catalog/        # Catalog application build
├── checkout/       # Checkout application build
├── shared-state/   # Shared state library
├── shared-ui/      # Shared UI library
└── shared-utils/   # Shared utils library
```

### Deployment Strategies

#### 1. Independent Deployment
- Deploy each application to separate domains/subdomains
- Use Module Federation or similar for runtime integration
- Requires CORS configuration

#### 2. Monolithic Deployment
- Build all applications together
- Deploy as a single package
- Simpler deployment but loses some MFE benefits

#### 3. Hybrid Deployment
- Deploy shell and some MFEs together
- Deploy other MFEs independently
- Balance between complexity and flexibility

### Environment Configuration

**Development:**
```bash
# Shell: localhost:4200
# Catalog: localhost:4201
# Checkout: localhost:4202
```

**Production:**
```bash
# Shell: https://app.example.com
# Catalog: https://catalog.example.com
# Checkout: https://checkout.example.com
```

### Deployment Checklist

- [ ] All shared libraries built successfully
- [ ] Application builds complete without errors
- [ ] Environment variables configured
- [ ] CORS policies set up (if needed)
- [ ] Health checks implemented
- [ ] Monitoring and logging configured
- [ ] Performance testing completed

## Conclusion

This Micro Frontend architecture provides a scalable foundation for building complex applications while maintaining development team independence and deployment flexibility. The combination of Nx monorepo tooling, shared libraries, and modern React patterns creates a robust and maintainable system.

The key to success with this architecture is:
1. Clear boundaries between applications
2. Well-defined shared contracts
3. Consistent development practices
4. Proper state management strategy
5. Reliable communication patterns

As your application grows, you can extend this pattern by adding new micro frontends, enhancing shared libraries, or implementing more sophisticated deployment strategies.
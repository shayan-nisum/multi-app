// Utility functions for micro frontend applications

// API utilities
export const apiUtils = {
  baseUrl: typeof window !== 'undefined' && window.location.hostname === 'localhost' 
    ? 'http://localhost:3000' 
    : 'https://api.example.com',
  
  async get<T>(endpoint: string): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  },

  async post<T>(endpoint: string, data: any): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  }
};

// Storage utilities
export const storageUtils = {
  // Session storage helpers
  getSessionItem<T>(key: string): T | null {
    try {
      const item = sessionStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch {
      return null;
    }
  },

  setSessionItem<T>(key: string, value: T): void {
    try {
      sessionStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error('Failed to set session storage item:', error);
    }
  },

  removeSessionItem(key: string): void {
    try {
      sessionStorage.removeItem(key);
    } catch (error) {
      console.error('Failed to remove session storage item:', error);
    }
  },

  // Local storage helpers
  getLocalItem<T>(key: string): T | null {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch {
      return null;
    }
  },

  setLocalItem<T>(key: string, value: T): void {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error('Failed to set local storage item:', error);
    }
  }
};

// Format utilities
export const formatUtils = {
  currency(amount: number, currency = 'USD'): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
    }).format(amount);
  },

  date(date: Date | string, options?: Intl.DateTimeFormatOptions): string {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return new Intl.DateTimeFormat('en-US', options).format(dateObj);
  },

  number(num: number, options?: Intl.NumberFormatOptions): string {
    return new Intl.NumberFormat('en-US', options).format(num);
  }
};

// Validation utilities
export const validationUtils = {
  isEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  isRequired(value: any): boolean {
    return value !== null && value !== undefined && value !== '';
  },

  minLength(value: string, min: number): boolean {
    return value.length >= min;
  },

  maxLength(value: string, max: number): boolean {
    return value.length <= max;
  }
};

// Event utilities for micro frontend communication
export const eventUtils = {
  emit(eventName: string, data?: any): void {
    const event = new CustomEvent(eventName, { detail: data });
    window.dispatchEvent(event);
  },

  listen(eventName: string, callback: (data?: any) => void): () => void {
    const handler = (event: CustomEvent) => callback(event.detail);
    window.addEventListener(eventName, handler as EventListener);
    
    // Return cleanup function
    return () => window.removeEventListener(eventName, handler as EventListener);
  }
};

// Debounce utility
export const debounce = <T extends (...args: any[]) => void>(
  func: T,
  delay: number
): ((...args: Parameters<T>) => void) => {
  let timeoutId: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};

// Throttle utility
export const throttle = <T extends (...args: any[]) => void>(
  func: T,
  delay: number
): ((...args: Parameters<T>) => void) => {
  let lastCall = 0;
  return (...args: Parameters<T>) => {
    const now = Date.now();
    if (now - lastCall >= delay) {
      lastCall = now;
      func(...args);
    }
  };
};

export function sharedUtils() {
  return 'shared-utils';
}

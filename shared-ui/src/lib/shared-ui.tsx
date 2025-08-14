import React from 'react';
import styles from './shared-ui.module.css';

// Button component
export interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'danger';
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  onClick, 
  variant = 'primary', 
  disabled = false,
  type = 'button'
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${styles.button} ${styles[variant]}`}
    >
      {children}
    </button>
  );
};

// Card component
export interface CardProps {
  children: React.ReactNode;
  title?: string;
  className?: string;
}

export const Card: React.FC<CardProps> = ({ children, title, className }) => {
  return (
    <div className={`${styles.card} ${className || ''}`}>
      {title && <h3 className={styles.cardTitle}>{title}</h3>}
      <div className={styles.cardContent}>
        {children}
      </div>
    </div>
  );
};

// Header component
export interface HeaderProps {
  title: string;
  cartCount?: number;
  onCartClick?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ title, cartCount = 0, onCartClick }) => {
  return (
    <header className={styles.header}>
      <h1 className={styles.title}>{title}</h1>
      <div className={styles.nav}>
        <button onClick={onCartClick} className={styles.cartButton}>
          Cart ({cartCount})
        </button>
      </div>
    </header>
  );
};

// Loading component
export const Loading: React.FC = () => {
  return (
    <div className={styles.loading}>
      <div className={styles.spinner}></div>
      <p>Loading...</p>
    </div>
  );
};

export function SharedUi() {
  return (
    <div className={styles['container']}>
      <h1>Welcome to SharedUi!</h1>
    </div>
  );
}

export default SharedUi;

import React from 'react';

interface CardProps {
  title?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  variant?: 'elevated' | 'flat';
}

export default function Card({ title, action, children, className = '', variant = 'elevated' }: CardProps) {
  return (
    <div
      style={{
        backgroundColor: 'var(--surface)',
        borderRadius: '24px',
        padding: '32px',
        boxShadow: variant === 'elevated' ? 'var(--shadow-ambient)' : 'none',
        border: variant === 'flat' ? '1px solid var(--outline-variant)' : 'none',
      }}
      className={className}
    >
      {(title || action) && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 24,
        }}>
          {title && (
            <h3 style={{ 
              fontSize: 18, 
              fontWeight: 700, 
              color: 'var(--on-surface)', 
              margin: 0,
              fontFamily: 'Manrope, sans-serif'
            }}>
              {title}
            </h3>
          )}
          {action}
        </div>
      )}
      <div style={{ color: 'var(--on-surface-variant)' }}>
        {children}
      </div>
    </div>
  );
}


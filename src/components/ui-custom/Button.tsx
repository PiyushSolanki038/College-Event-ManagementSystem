import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'success' | 'ghost' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  block?: boolean;
  outline?: boolean;
  children: React.ReactNode;
}

const variantStyles: Record<string, any> = {
  primary: { bg: '#2563eb', text: '#ffffff', border: '#2563eb' },
  secondary: { bg: '#f1f5f9', text: '#334155', border: '#e2e8f0' },
  outline: { bg: 'transparent', text: '#374151', border: '#e2e8f0' },
  danger: { bg: '#fef2f2', text: '#dc2626', border: '#fecaca' },
  success: { bg: '#f0fdf4', text: '#16a34a', border: '#bbf7d0' },
  ghost: { bg: 'transparent', text: '#64748b', border: 'transparent' },
};

export default function Button({ 
  variant = 'primary', 
  size = 'md', 
  block = false,
  outline = false,
  className = '', 
  children, 
  style, 
  ...props 
}: ButtonProps) {
  const base = variantStyles[variant] || variantStyles.primary;
  
  const vs: React.CSSProperties = outline ? {
    backgroundColor: 'transparent',
    color: base.bg === 'transparent' ? base.text : base.bg,
    border: `1.5px solid ${base.bg === 'transparent' ? '#e2e8f0' : base.bg}`,
  } : {
    backgroundColor: base.bg,
    color: base.text,
    border: base.bg === 'transparent' ? 'none' : `1px solid ${base.border}`,
  };
  
  const sizeStyles: React.CSSProperties = {
    sm: { fontSize: 12, padding: '6px 12px', borderRadius: 8 },
    md: { fontSize: 13, padding: '10px 18px', borderRadius: 12 },
    lg: { fontSize: 15, padding: '12px 24px', borderRadius: 14 },
  }[size as any] || { fontSize: 13, padding: '10px 18px', borderRadius: 12 };

  return (
    <button
      style={{
        display: block ? 'flex' : 'inline-flex',
        width: block ? '100%' : 'auto',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        fontWeight: 700,
        cursor: 'pointer',
        transition: 'all 0.2s',
        ...vs,
        ...sizeStyles,
        ...style,
      }}
      className={className}
      {...props}
    >
      {children}
    </button>
  );
}

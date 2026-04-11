import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export default function Input({ label, error, className = '', style, ...props }: InputProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6, width: '100%' }}>
      {label && <label style={{ fontSize: 12, fontWeight: 500, color: '#374151' }}>{label}</label>}
      <input
        style={{
          width: '100%',
          height: 36,
          border: `0.5px solid ${error ? '#dc2626' : '#d1d5db'}`,
          borderRadius: 7,
          padding: '0 12px',
          fontSize: 13,
          fontWeight: 400,
          color: '#0f172a',
          backgroundColor: '#ffffff',
          outline: 'none',
          transition: 'border-color 150ms, box-shadow 150ms',
          ...style,
        }}
        onFocus={(e) => {
          e.currentTarget.style.borderColor = '#2563eb';
          e.currentTarget.style.boxShadow = '0 0 0 3px rgba(37,99,235,0.12)';
        }}
        onBlur={(e) => {
          e.currentTarget.style.borderColor = error ? '#dc2626' : '#d1d5db';
          e.currentTarget.style.boxShadow = 'none';
        }}
        className={className}
        {...props}
      />
      {error && <span style={{ fontSize: 11, color: '#dc2626', marginTop: 4 }}>{error}</span>}
    </div>
  );
}

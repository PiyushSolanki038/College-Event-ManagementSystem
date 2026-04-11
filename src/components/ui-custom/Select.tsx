import React from 'react';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: { value: string; label: string }[];
  error?: string;
}

export default function Select({ label, options, error, className = '', style, ...props }: SelectProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      {label && <label style={{ fontSize: 12, fontWeight: 500, color: '#374151' }}>{label}</label>}
      <select
        style={{
          height: 36,
          border: error ? '1px solid #dc2626' : '0.5px solid #d1d5db',
          borderRadius: 7,
          padding: '0 12px',
          fontSize: 13,
          fontWeight: 400,
          color: '#0f172a',
          backgroundColor: '#ffffff',
          outline: 'none',
          appearance: 'none' as const,
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%2394a3b8' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'right 10px center',
          paddingRight: 32,
          transition: 'border-color 150ms, box-shadow 150ms',
          cursor: 'pointer',
          ...style,
        }}
        onFocus={(e) => {
          e.currentTarget.style.borderColor = error ? '#dc2626' : '#2563eb';
          e.currentTarget.style.boxShadow = error ? '0 0 0 3px rgba(220,38,38,0.1)' : '0 0 0 3px rgba(37,99,235,0.12)';
        }}
        onBlur={(e) => {
          e.currentTarget.style.borderColor = error ? '#dc2626' : '#d1d5db';
          e.currentTarget.style.boxShadow = 'none';
        }}
        className={className}
        {...props}
      >
        {options.map(o => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
      {error && <span style={{ fontSize: 11, color: '#dc2626', fontWeight: 600 }}>{error}</span>}
    </div>
  );
}

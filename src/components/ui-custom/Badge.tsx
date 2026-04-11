import React from 'react';

interface BadgeProps {
  variant: 'approved' | 'pending' | 'rejected' | 'draft' | 'success' | 'warning' | 'danger' | 'info' | 'active' | 'inactive' | 'student' | 'organizer' | 'admin';
  children: React.ReactNode;
  className?: string;
}

const variantStyles: Record<string, React.CSSProperties> = {
  approved: { backgroundColor: '#ecfdf5', color: '#059669' },
  active: { backgroundColor: '#ecfdf5', color: '#059669' },
  success: { backgroundColor: '#ecfdf5', color: '#059669' },
  pending: { backgroundColor: '#fffbeb', color: '#d97706' },
  warning: { backgroundColor: '#fffbeb', color: '#d97706' },
  rejected: { backgroundColor: '#fef2f2', color: '#dc2626' },
  danger: { backgroundColor: '#fef2f2', color: '#dc2626' },
  inactive: { backgroundColor: '#fef2f2', color: '#dc2626' },
  draft: { backgroundColor: '#f1f5f9', color: '#475569' },
  info: { backgroundColor: '#eff6ff', color: '#1d4ed8' },
  student: { backgroundColor: '#eff6ff', color: '#1d4ed8' },
  organizer: { backgroundColor: '#faf5ff', color: '#7c3aed' },
  admin: { backgroundColor: '#fff7ed', color: '#c2410c' },
};

export default function Badge({ variant, children }: BadgeProps) {
  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      fontSize: 10,
      fontWeight: 700,
      padding: '4px 10px',
      borderRadius: '100px',
      textTransform: 'uppercase',
      letterSpacing: '0.05em',
      fontFamily: 'Manrope, sans-serif',
      ...variantStyles[variant],
    }}>
      {children}
    </span>
  );
}


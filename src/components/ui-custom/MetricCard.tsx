import React from 'react';
import type { LucideIcon } from 'lucide-react';

interface MetricCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  change?: string;
  changeType?: 'positive' | 'warning' | 'neutral';
}

export default function MetricCard({ label, value, icon: Icon, change, changeType = 'neutral' }: MetricCardProps) {
  return (
    <div style={{
      backgroundColor: 'var(--surface)',
      borderRadius: '24px',
      padding: '24px',
      boxShadow: 'var(--shadow-ambient)',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      minHeight: 140,
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div style={{ 
          width: 32, 
          height: 32, 
          borderRadius: '10px', 
          backgroundColor: 'var(--surface-low)', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center' 
        }}>
          <Icon size={16} strokeWidth={1.5} color="var(--primary)" />
        </div>
        {change && (
          <div style={{
            fontSize: 11,
            fontWeight: 600,
            padding: '4px 8px',
            borderRadius: '100px',
            backgroundColor: changeType === 'positive' ? '#ecfdf5' : changeType === 'warning' ? '#fffbeb' : '#f1f5f9',
            color: changeType === 'positive' ? '#059669' : changeType === 'warning' ? '#d97706' : '#64748b',
          }}>
            {change}
          </div>
        )}
      </div>
      <div>
        <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--on-surface-variant)', marginBottom: 2 }}>{label}</div>
        <div style={{ 
          fontSize: 32, 
          fontWeight: 700, 
          color: 'var(--on-surface)', 
          letterSpacing: '-0.03em',
          fontFamily: 'Manrope, sans-serif' 
        }}>
          {value}
        </div>
      </div>
    </div>
  );
}


import React from 'react';

interface Column<T> {
  key: string;
  header: string;
  render: (item: T) => React.ReactNode;
  sortable?: boolean;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  onSort?: (key: string) => void;
  sortKey?: string;
  sortDir?: 'asc' | 'desc';
}

export default function DataTable<T extends { id?: string }>({ columns, data, onSort, sortKey, sortDir }: DataTableProps<T>) {
  return (
    <div style={{ overflowX: 'auto', borderRadius: 16, backgroundColor: 'var(--surface)' }}>
      <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: 0 }}>
        <thead>
          <tr>
            {columns.map((col, idx) => (
              <th
                key={col.key}
                onClick={() => col.sortable && onSort?.(col.key)}
                style={{
                  textAlign: 'left',
                  fontSize: 11,
                  fontWeight: 800,
                  textTransform: 'uppercase' as const,
                  color: 'var(--on-surface-variant)',
                  padding: '16px 24px',
                  letterSpacing: '0.1em',
                  fontFamily: 'Manrope, sans-serif',
                  borderBottom: '1px solid var(--outline-variant)',
                  cursor: col.sortable ? 'pointer' : 'default',
                  userSelect: col.sortable ? 'none' : 'auto',
                  borderTopLeftRadius: idx === 0 ? 16 : 0,
                  borderTopRightRadius: idx === columns.length - 1 ? 16 : 0,
                }}
              >
                {col.header}
                {sortKey === col.key && (
                  <span style={{ marginLeft: 6, color: 'var(--primary)', fontSize: 14 }}>
                    {sortDir === 'asc' ? '↑' : '↓'}
                  </span>
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody style={{ verticalAlign: 'middle' }}>
          {data.map((item, i) => (
            <tr
              key={(item as Record<string, unknown>).id as string || i}
              style={{
                transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                cursor: 'default',
              }}
              onMouseEnter={(e) => { 
                const target = e.currentTarget as HTMLElement;
                target.style.backgroundColor = 'var(--surface-low)';
              }}
              onMouseLeave={(e) => { 
                const target = e.currentTarget as HTMLElement;
                target.style.backgroundColor = 'transparent';
              }}
            >
              {columns.map(col => (
                <td key={col.key} style={{
                  padding: '16px 24px',
                  fontSize: 14,
                  fontWeight: 500,
                  color: 'var(--on-surface)',
                  borderBottom: i === data.length - 1 ? 'none' : '1px solid var(--outline-variant)',
                }}>
                  {col.render(item)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

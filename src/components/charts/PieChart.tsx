import React from 'react';
import { PieChart as RePieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const COLORS = ['#2563eb', '#16a34a', '#d97706', '#dc2626', '#7c3aed', '#0891b2'];

interface PieChartProps {
  data: { name: string; value: number }[];
  height?: number;
  innerRadius?: number;
}

export default function PieChartComponent({ data, height = 300, innerRadius = 0 }: PieChartProps) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <RePieChart>
        <Pie data={data} cx="50%" cy="50%" innerRadius={innerRadius} outerRadius={100} dataKey="value" paddingAngle={2}>
          {data.map((_, i) => (
            <Cell key={i} fill={COLORS[i % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip contentStyle={{ background: '#ffffff', border: '0.5px solid #e2e8f0', borderRadius: '8px', fontSize: '12px', color: '#0f172a' }} />
        <Legend wrapperStyle={{ fontSize: '11px', color: '#64748b' }} />
      </RePieChart>
    </ResponsiveContainer>
  );
}

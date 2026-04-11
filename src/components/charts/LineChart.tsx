import React from 'react';
import { LineChart as ReLineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface LineChartProps {
  data: { date: string; count: number }[];
  height?: number;
}

export default function LineChartComponent({ data, height = 300 }: LineChartProps) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <ReLineChart data={data}>
        <CartesianGrid stroke="#f1f5f9" strokeDasharray="3 3" />
        <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#94a3b8' }} />
        <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} />
        <Tooltip contentStyle={{ background: '#ffffff', border: '0.5px solid #e2e8f0', borderRadius: '8px', fontSize: '12px', color: '#0f172a' }} />
        <Line type="monotone" dataKey="count" stroke="#2563eb" strokeWidth={2} dot={{ fill: '#2563eb', r: 3 }} />
      </ReLineChart>
    </ResponsiveContainer>
  );
}

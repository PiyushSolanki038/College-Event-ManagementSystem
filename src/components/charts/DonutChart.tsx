import React from 'react';
import PieChartComponent from './PieChart';

interface DonutChartProps {
  data: { name: string; value: number }[];
  height?: number;
}

export default function DonutChart({ data, height = 300 }: DonutChartProps) {
  return <PieChartComponent data={data} height={height} innerRadius={60} />;
}

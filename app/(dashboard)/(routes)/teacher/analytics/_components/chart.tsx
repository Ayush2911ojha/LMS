"use client";

import {
  Bar,
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Cell,
} from "recharts";
import { Card } from "@/components/ui/card";

interface ChartProps {
  data: {
    name: string;
    total: number;
    // students field can be here, but not required for this fix
  }[];
}

interface CustomTooltipProps {
  active: boolean;
  payload: {
    name: string;
    value: number;
  }[];
}

const CustomTooltip = ({ active, payload }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-gray-300 shadow-md p-3 rounded">
        <p className="font-semibold">{payload[0].name}</p>
        <p className="text-blue-600">${payload[0].value}</p>
      </div>
    );
  }
  return null;
};


const COLORS = ["#4a90e2", "#22c55e", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899", "#10b981"];

export const Chart = ({ data }: ChartProps) => {
  return (
    <Card>
      <ResponsiveContainer width="100%" height={350}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" stroke="#888888" tickLine={false} axisLine={false} />
          <YAxis
            stroke="#888888"
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => `$${value}`}
          />
          <Tooltip content={<CustomTooltip active={false} payload={[]} />} />
          <Legend />

          <Bar dataKey="total" barSize={20} radius={[4, 4, 4, 0]}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
};

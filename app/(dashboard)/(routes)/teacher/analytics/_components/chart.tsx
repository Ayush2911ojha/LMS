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
} from "recharts";
import { Card } from "@/components/ui/card";

// Define the shape of the data
interface ChartProps {
    data: {
        name: string;
        total: number;
    }[];
}

// Define the shape of the tooltip's props
interface CustomTooltipProps {
    active: boolean;
    payload: {
        name: string;
        value: number;
    }[];
}

// Custom Tooltip Component
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

export const Chart = ({ data }: ChartProps) => {
    return (
        <Card>
            <ResponsiveContainer width="100%" height={350}>
                <BarChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                        dataKey="name"
                        stroke="#888888"
                        tickLine={false}
                        axisLine={false}
                    />
                    <YAxis
                        stroke="#888888"
                        tickLine={false}
                        axisLine={false}
                        tickFormatter={(value) => `$${value}`}
                    />
                    <Tooltip content={<CustomTooltip active={false} payload={[]} />} />
                    <Legend />
                    <Bar
                        dataKey="total"
                        fill="#4a90e2"
                        barSize={20}
                        radius={[4, 4, 4, 0]}
                    />
                </BarChart>
            </ResponsiveContainer>
        </Card>
    );
}

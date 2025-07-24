"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import type { SubjectBreakdownProps } from "@/types";

const COLORS = [
  "#16a34a",
  "#3b82f6",
  "#f59e0b",
  "#ef4444",
  "#8b5cf6",
  "#06b6d4",
];

export function SubjectBreakdown({ subjects }: SubjectBreakdownProps) {
  const data = subjects.map((subject, index) => ({
    name: subject.name,
    value: Math.round((subject.marks / subject.maxMarks) * 100),
    color: COLORS[index % COLORS.length],
  }));

  const chartConfig = {
    value: {
      label: "Percentage",
    },
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Subject Distribution</CardTitle>
        <CardDescription>
          Performance distribution across subjects
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <ChartTooltip content={<ChartTooltipContent />} />
            </PieChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

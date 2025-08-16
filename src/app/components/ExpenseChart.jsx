"use client";

import { PieChart } from "lucide-react";
import {
  PieChart as RechartsPieChart,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
  Pie,
} from "recharts";

const chartColors = {
  Food: "#10b981",
  Transport: "#3b82f6",
  Shopping: "#f59e0b",
  Others: "#6b7280",
};

export default function ExpenseChart({ expenses }) {
  const categoryData = Object.entries(
    expenses.reduce((acc, expense) => {
      const category = expense.category;
      acc[category] = (acc[category] || 0) + parseFloat(expense.amount);
      return acc;
    }, {})
  ).map(([category, amount]) => ({
    name: category,
    value: amount,
    color: chartColors[category] || chartColors.Others,
  }));

  if (categoryData.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-white/60">
        <div className="text-center">
          <PieChart className="w-16 h-16 mx-auto mb-4 opacity-50" />
          <p>No data to display</p>
        </div>
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <RechartsPieChart>
        <Pie
          data={categoryData}
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={120}
          paddingAngle={5}
          dataKey="value"
        >
          {categoryData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip
          formatter={(value) => [`$${value.toFixed(2)}`, "Amount"]}
          contentStyle={{
            backgroundColor: "rgba(255, 255, 255, 0.9)",
            border: "none",
            borderRadius: "12px",
            boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)",
          }}
        />
        <Legend
          verticalAlign="bottom"
          height={36}
          formatter={(value) => (
            <span style={{ color: "#fff", fontSize: "14px" }}>{value}</span>
          )}
        />
      </RechartsPieChart>
    </ResponsiveContainer>
  );
}

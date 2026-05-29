"use client";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from "recharts";
import { Card } from "@/components/ui/Card";

interface MonthlyData {
  month: string;
  receitas: number;
  despesas: number;
}

interface CategoryData {
  name: string;
  value: number;
}

const COLORS = ["#7C3AED", "#2563EB", "#06B6D4", "#10B981", "#F59E0B", "#EC4899", "#EF4444", "#94A3B8"];

const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: { name: string; value: number; color: string }[]; label?: string }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass-card border border-purple-500/20 p-3 text-xs shadow-xl">
      <p className="text-gray-300 font-semibold mb-1">{label}</p>
      {payload.map((p) => (
        <p key={p.name} style={{ color: p.color }} className="font-medium">
          {p.name}: R$ {p.value.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
        </p>
      ))}
    </div>
  );
};

export function FinancialBarChart({ data }: { data: MonthlyData[] }) {
  return (
    <Card className="p-4">
      <h3 className="text-sm font-bold text-gray-200 mb-4">Receitas vs Despesas</h3>
      <ResponsiveContainer width="100%" height={180}>
        <BarChart data={data} barCategoryGap="30%">
          <XAxis dataKey="month" tick={{ fill: "#94A3B8", fontSize: 11 }} axisLine={false} tickLine={false} />
          <YAxis hide />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(124,58,237,0.05)" }} />
          <Bar dataKey="receitas" name="Receitas" fill="url(#greenGrad)" radius={[4,4,0,0]} />
          <Bar dataKey="despesas" name="Despesas" fill="url(#redGrad)" radius={[4,4,0,0]} />
          <defs>
            <linearGradient id="greenGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#10B981" />
              <stop offset="100%" stopColor="#059669" />
            </linearGradient>
            <linearGradient id="redGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#EF4444" />
              <stop offset="100%" stopColor="#DC2626" />
            </linearGradient>
          </defs>
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
}

export function ExpensePieChart({ data }: { data: CategoryData[] }) {
  return (
    <Card className="p-4">
      <h3 className="text-sm font-bold text-gray-200 mb-2">Gastos por Categoria</h3>
      <ResponsiveContainer width="100%" height={200}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="45%"
            innerRadius={50}
            outerRadius={75}
            paddingAngle={3}
            dataKey="value"
          >
            {data.map((_, i) => (
              <Cell key={i} fill={COLORS[i % COLORS.length]} stroke="rgba(0,0,0,0.3)" />
            ))}
          </Pie>
          <Tooltip
            formatter={(v: number) => [`R$ ${v.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`, ""]}
            contentStyle={{ background: "rgba(15,15,30,0.9)", border: "1px solid rgba(124,58,237,0.3)", borderRadius: "10px", fontSize: 12 }}
          />
          <Legend
            formatter={(value) => <span style={{ color: "#94A3B8", fontSize: 11 }}>{value}</span>}
            iconSize={8}
            iconType="circle"
          />
        </PieChart>
      </ResponsiveContainer>
    </Card>
  );
}

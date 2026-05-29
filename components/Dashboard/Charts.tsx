"use client";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";
import { Card } from "@/components/ui/Card";

interface MonthlyData { month: string; receitas: number; despesas: number; }
interface CategoryData { name: string; value: number; }

const COLORS = ["#1A2E1A","#B8882A","#2563EB","#10B981","#D4A84B","#06B6D4","#EF4444","#94A3B8"];

const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: { name: string; value: number; color: string }[]; label?: string }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-gray-100 shadow-xl rounded-xl p-3 text-xs">
      <p className="font-bold text-gray-800 mb-1">{label}</p>
      {payload.map((p) => (
        <p key={p.name} style={{ color: p.color }} className="font-semibold">
          {p.name}: R$ {p.value.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
        </p>
      ))}
    </div>
  );
};

export function FinancialBarChart({ data }: { data: MonthlyData[] }) {
  return (
    <Card className="p-4">
      <h3 className="text-sm font-bold text-[#1C1A17] mb-4">Receitas vs Despesas</h3>
      <ResponsiveContainer width="100%" height={180}>
        <BarChart data={data} barCategoryGap="30%">
          <XAxis dataKey="month" tick={{ fill: "#9CA3AF", fontSize: 11 }} axisLine={false} tickLine={false} />
          <YAxis hide />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(27,58,27,0.04)" }} />
          <Bar dataKey="receitas" name="Receitas" fill="url(#greenGrad)" radius={[6,6,0,0]} />
          <Bar dataKey="despesas" name="Despesas" fill="url(#redGrad)" radius={[6,6,0,0]} />
          <defs>
            <linearGradient id="greenGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#10B981" /><stop offset="100%" stopColor="#059669" />
            </linearGradient>
            <linearGradient id="redGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#F87171" /><stop offset="100%" stopColor="#EF4444" />
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
      <h3 className="text-sm font-bold text-[#1C1A17] mb-2">Gastos por Categoria</h3>
      <ResponsiveContainer width="100%" height={200}>
        <PieChart>
          <Pie data={data} cx="50%" cy="45%" innerRadius={50} outerRadius={75} paddingAngle={3} dataKey="value">
            {data.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} stroke="rgba(255,255,255,0.8)" strokeWidth={2} />)}
          </Pie>
          <Tooltip formatter={(v: number) => [`R$ ${v.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`, ""]}
            contentStyle={{ background: "#fff", border: "1px solid #E5E7EB", borderRadius: "10px", fontSize: 12, boxShadow: "0 8px 24px rgba(0,0,0,0.08)" }} />
          <Legend formatter={(v) => <span style={{ color: "#6B7280", fontSize: 11 }}>{v}</span>} iconSize={8} iconType="circle" />
        </PieChart>
      </ResponsiveContainer>
    </Card>
  );
}

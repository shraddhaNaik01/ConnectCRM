'use client';

import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { DEMO_ORDER_ANALYTICS } from '@/data/demoData';
import { ShoppingBag } from 'lucide-react';

interface TooltipPayloadItem {
  value: number;
  payload: {
    revenue?: number;
  };
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: TooltipPayloadItem[];
  label?: string;
}

const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg border border-[#263449] bg-[#1B2840] p-3 shadow-xl backdrop-blur">
        <p className="text-xs font-semibold text-[#94A3B8]">{label} 2026</p>
        <p className="mt-1 text-sm font-bold text-[#A78BFA]">
          {payload[0].value} Orders
        </p>
        {payload[0].payload.revenue && (
          <p className="text-xs font-medium text-[#34D399]">
            ${payload[0].payload.revenue.toLocaleString()} Revenue
          </p>
        )}
      </div>
    );
  }
  return null;
};

export function OrderAnalyticsChart() {
  return (
    <div className="flex flex-col justify-between rounded-xl border border-[#263449] bg-[#151F32] p-5 shadow-lg">
      <div className="flex items-center justify-between border-b border-[#263449] pb-3">
        <div>
          <div className="flex items-center gap-2">
            <ShoppingBag className="h-4 w-4 text-[#A78BFA]" />
            <h3 className="text-sm font-semibold text-[#F1F5F9]">
              Order Analytics
            </h3>
          </div>
          <p className="mt-0.5 text-xs text-[#94A3B8]">
            Monthly fulfilled order volume · Demo Data
          </p>
        </div>
        <div className="flex items-center gap-1 rounded-full border border-violet-500/20 bg-violet-500/10 px-2 py-0.5 text-[11px] font-medium text-[#A78BFA]">
          <span>Avg: 644/mo</span>
        </div>
      </div>

      <div className="mt-4 h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={DEMO_ORDER_ANALYTICS}
            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
          >
            <CartesianGrid stroke="#263449" strokeDasharray="3 3" vertical={false} />
            <XAxis
              dataKey="month"
              stroke="#94A3B8"
              fontSize={12}
              tickLine={false}
              axisLine={{ stroke: '#263449' }}
            />
            <YAxis
              stroke="#94A3B8"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar
              dataKey="orders"
              fill="#A78BFA"
              radius={[4, 4, 0, 0]}
              maxBarSize={40}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-3 flex items-center justify-between border-t border-[#263449] pt-2 text-[11px] text-[#94A3B8]">
        <span>Recent 30d: <strong className="text-[#F1F5F9]">762 orders ($64.2k)</strong></span>
        <span className="text-[#34D399] font-medium">+8.1% vs Sep</span>
      </div>
    </div>
  );
}

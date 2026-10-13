'use client';

import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { DEMO_CUSTOMER_GROWTH } from '@/data/demoData';
import { Users, TrendingUp } from 'lucide-react';

interface TooltipPayloadItem {
  value: number;
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
        <p className="mt-1 text-sm font-bold text-[#60A5FA]">
          {payload[0].value.toLocaleString()} Total Customers
        </p>
        {payload[1] && (
          <p className="text-xs font-medium text-[#A78BFA]">
            +{payload[1].value} new signups
          </p>
        )}
      </div>
    );
  }
  return null;
};

export function CustomerGrowthChart() {
  return (
    <div className="flex flex-col justify-between rounded-xl border border-[#263449] bg-[#151F32] p-5 shadow-lg">
      <div className="flex items-center justify-between border-b border-[#263449] pb-3">
        <div>
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-[#60A5FA]" />
            <h3 className="text-sm font-semibold text-[#F1F5F9]">
              Customer Growth
            </h3>
          </div>
          <p className="mt-0.5 text-xs text-[#94A3B8]">
            Cumulative active accounts (Past 6 Months) · Demo Data
          </p>
        </div>
        <div className="flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2 py-0.5 text-[11px] font-medium text-[#34D399]">
          <TrendingUp className="h-3 w-3" />
          <span>+73.5%</span>
        </div>
      </div>

      <div className="mt-4 h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={DEMO_CUSTOMER_GROWTH}
            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
          >
            <defs>
              <linearGradient id="customerGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#60A5FA" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#60A5FA" stopOpacity={0.0} />
              </linearGradient>
            </defs>
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
              tickFormatter={(v) => `${v}`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="customers"
              stroke="#60A5FA"
              strokeWidth={2.5}
              fillOpacity={1}
              fill="url(#customerGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-3 flex items-center justify-between border-t border-[#263449] pt-2 text-[11px] text-[#94A3B8]">
        <span>Latest total: <strong className="text-[#F1F5F9]">1,284 customers</strong></span>
        <span className="text-[#60A5FA] font-medium">WooCommerce Synced</span>
      </div>
    </div>
  );
}

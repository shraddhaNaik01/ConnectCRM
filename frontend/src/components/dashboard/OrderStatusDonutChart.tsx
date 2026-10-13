'use client';

import React from 'react';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { DEMO_STATUS_DISTRIBUTION } from '@/data/demoData';
import { PieChart as PieChartIcon } from 'lucide-react';

interface TooltipPayloadItem {
  name: string;
  value: number;
  payload: {
    color: string;
  };
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: TooltipPayloadItem[];
}

const CustomTooltip = ({ active, payload }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    const data = payload[0];
    return (
      <div className="rounded-lg border border-[#263449] bg-[#1B2840] p-2.5 shadow-xl backdrop-blur">
        <p className="text-xs font-semibold text-[#F1F5F9]">{data.name}</p>
        <p className="mt-0.5 text-xs font-bold" style={{ color: data.payload.color }}>
          {data.value.toLocaleString()} orders
        </p>
      </div>
    );
  }
  return null;
};

export function OrderStatusDonutChart() {
  const total = DEMO_STATUS_DISTRIBUTION.reduce((acc, curr) => acc + curr.value, 0);

  return (
    <div className="flex flex-col justify-between rounded-xl border border-[#263449] bg-[#151F32] p-5 shadow-lg">
      <div className="flex items-center justify-between border-b border-[#263449] pb-3">
        <div>
          <div className="flex items-center gap-2">
            <PieChartIcon className="h-4 w-4 text-[#34D399]" />
            <h3 className="text-sm font-semibold text-[#F1F5F9]">
              Status Distribution
            </h3>
          </div>
          <p className="mt-0.5 text-xs text-[#94A3B8]">
            WooCommerce lifecycle triage · Demo Data
          </p>
        </div>
        <span className="rounded-full border border-slate-700 bg-[#1B2840] px-2 py-0.5 text-[11px] font-semibold text-[#94A3B8]">
          {total.toLocaleString()} Total
        </span>
      </div>

      <div className="relative mt-4 h-64 w-full flex items-center justify-center">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Tooltip content={<CustomTooltip />} />
            <Pie
              data={DEMO_STATUS_DISTRIBUTION}
              innerRadius={62}
              outerRadius={88}
              paddingAngle={4}
              dataKey="value"
            >
              {DEMO_STATUS_DISTRIBUTION.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} stroke="#151F32" strokeWidth={2} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        {/* Center label */}
        <div className="pointer-events-none absolute flex flex-col items-center justify-center text-center">
          <span className="text-xl font-bold text-[#F1F5F9] leading-tight">
            74%
          </span>
          <span className="text-[10px] uppercase tracking-wider text-[#94A3B8]">
            Fulfilled
          </span>
        </div>
      </div>

      {/* Legend */}
      <div className="mt-3 grid grid-cols-2 gap-2 border-t border-[#263449] pt-2 text-xs">
        {DEMO_STATUS_DISTRIBUTION.map((item) => (
          <div key={item.name} className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full" style={{ backgroundColor: item.color }} />
              <span className="text-[#94A3B8] text-[11px]">{item.name}</span>
            </div>
            <span className="font-medium text-[#F1F5F9] text-[11px]">
              {item.value.toLocaleString()}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

import React from 'react';
import { Users, ShoppingBag, Clock, CalendarCheck, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { MetricCardData } from '@/types/crm';

interface MetricCardProps {
  metric: MetricCardData;
}

const iconMap = {
  'users': Users,
  'shopping-bag': ShoppingBag,
  'clock': Clock,
  'calendar-check': CalendarCheck,
};

const iconThemeMap = {
  'users': {
    bg: 'bg-blue-500/10 text-[#60A5FA] border-blue-500/20',
    glow: 'from-blue-500/10 to-transparent',
  },
  'shopping-bag': {
    bg: 'bg-indigo-500/10 text-[#A78BFA] border-indigo-500/20',
    glow: 'from-indigo-500/10 to-transparent',
  },
  'clock': {
    bg: 'bg-amber-500/10 text-[#FBBF24] border-amber-500/20',
    glow: 'from-amber-500/10 to-transparent',
  },
  'calendar-check': {
    bg: 'bg-emerald-500/10 text-[#34D399] border-emerald-500/20',
    glow: 'from-emerald-500/10 to-transparent',
  },
};

export function MetricCard({ metric }: MetricCardProps) {
  const Icon = iconMap[metric.iconName] || Users;
  const theme = iconThemeMap[metric.iconName] || iconThemeMap.users;

  return (
    <div className="relative overflow-hidden rounded-xl border border-[#263449] bg-[#151F32] p-5 shadow-lg transition-all hover:border-[#3b4f6e] hover:shadow-xl">
      {/* Subtle top ambient glow */}
      <div className={`pointer-events-none absolute -top-12 -right-12 h-28 w-28 rounded-full bg-gradient-to-br ${theme.glow} blur-2xl`} />

      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider text-[#94A3B8]">
          {metric.title}
        </span>
        <div className={`flex h-9 w-9 items-center justify-center rounded-lg border ${theme.bg}`}>
          <Icon className="h-4 w-4" />
        </div>
      </div>

      <div className="mt-3 flex items-baseline gap-2">
        <span className="text-2xl font-bold tracking-tight text-[#F1F5F9] sm:text-3xl">
          {metric.value}
        </span>
      </div>

      <div className="mt-3 flex items-center gap-1.5 text-xs">
        {metric.trend === 'up' && (
          <span className="inline-flex items-center gap-0.5 font-medium text-[#34D399]">
            <TrendingUp className="h-3 w-3" />
            {metric.change}
          </span>
        )}
        {metric.trend === 'down' && (
          <span className="inline-flex items-center gap-0.5 font-medium text-[#FBBF24]">
            <TrendingDown className="h-3 w-3" />
            {metric.change}
          </span>
        )}
        {metric.trend === 'neutral' && (
          <span className="inline-flex items-center gap-0.5 font-medium text-[#60A5FA]">
            <Minus className="h-3 w-3" />
            {metric.change}
          </span>
        )}
        <span className="text-[#94A3B8]">· {metric.subtext}</span>
      </div>
    </div>
  );
}

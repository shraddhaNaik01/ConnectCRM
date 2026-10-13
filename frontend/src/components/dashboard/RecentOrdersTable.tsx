import React from 'react';
import { Order, OrderStatus } from '@/types/crm';
import { ShoppingCart } from 'lucide-react';

interface RecentOrdersTableProps {
  orders: Order[];
}

const statusBadgeStyles: Record<OrderStatus, { bg: string; dot: string; label: string }> = {
  completed: {
    bg: 'bg-emerald-500/10 text-[#34D399] border-emerald-500/20',
    dot: 'bg-[#34D399]',
    label: 'Completed',
  },
  processing: {
    bg: 'bg-blue-500/10 text-[#60A5FA] border-blue-500/20',
    dot: 'bg-[#60A5FA]',
    label: 'Processing',
  },
  pending: {
    bg: 'bg-amber-500/10 text-[#FBBF24] border-amber-500/20',
    dot: 'bg-[#FBBF24]',
    label: 'Pending',
  },
  cancelled: {
    bg: 'bg-slate-500/10 text-[#94A3B8] border-slate-500/20',
    dot: 'bg-[#94A3B8]',
    label: 'Cancelled',
  },
};

export function RecentOrdersTable({ orders }: RecentOrdersTableProps) {
  if (orders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#1B2840] text-[#94A3B8]">
          <ShoppingCart className="h-6 w-6" />
        </div>
        <h4 className="mt-3 text-sm font-semibold text-[#F1F5F9]">No orders found</h4>
        <p className="mt-1 text-xs text-[#94A3B8] max-w-sm">
          No matching demo orders match the current search or filters.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm text-[#94A3B8]">
        <thead className="border-b border-[#263449] bg-[#1B2840]/60 text-[11px] font-semibold uppercase tracking-wider text-[#94A3B8]">
          <tr>
            <th scope="col" className="px-4 py-3 sm:px-6">Order ID</th>
            <th scope="col" className="px-4 py-3 sm:px-6">Customer</th>
            <th scope="col" className="px-4 py-3 sm:px-6">Status</th>
            <th scope="col" className="px-4 py-3 sm:px-6">Date</th>
            <th scope="col" className="px-4 py-3 sm:px-6 text-right">Total</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[#263449]/70">
          {orders.map((order) => {
            const statusConfig = statusBadgeStyles[order.status];
            return (
              <tr 
                key={order.id} 
                className="hover:bg-[#1B2840]/40 transition-colors group"
              >
                <td className="px-4 py-3.5 sm:px-6 font-medium text-[#F1F5F9]">
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono text-xs">{order.orderNumber}</span>
                    <span className="text-[10px] text-[#94A3B8] font-normal">({order.source})</span>
                  </div>
                </td>
                <td className="px-4 py-3.5 sm:px-6">
                  <div>
                    <div className="font-medium text-[#F1F5F9]">{order.customerName}</div>
                    <div className="text-xs text-[#94A3B8]">{order.customerEmail}</div>
                  </div>
                </td>
                <td className="px-4 py-3.5 sm:px-6">
                  <span
                    className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium ${statusConfig.bg}`}
                  >
                    <span className={`h-1.5 w-1.5 rounded-full ${statusConfig.dot}`} />
                    {statusConfig.label}
                  </span>
                </td>
                <td className="px-4 py-3.5 sm:px-6 text-xs text-[#94A3B8] whitespace-nowrap">
                  {order.date}
                </td>
                <td className="px-4 py-3.5 sm:px-6 text-right font-semibold text-[#F1F5F9] whitespace-nowrap">
                  {order.currency}{order.total.toFixed(2)}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

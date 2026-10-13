'use client';

import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { RecentOrdersTable } from '@/components/dashboard/RecentOrdersTable';
import { Order, OrderStatus } from '@/types/crm';
import { api } from '@/services/api';
import { ShoppingBag, RefreshCw, AlertCircle, Download, CheckCircle2 } from 'lucide-react';

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<'all' | OrderStatus>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const fetchOrders = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.getOrders();
      setOrders(data);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to load orders from backend.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customerEmail.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === 'all' ? true : order.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const handleExportCSV = () => {
    const headers = ['OrderNumber', 'Customer', 'Email', 'Status', 'Total', 'Date'];
    const rows = filteredOrders.map(o => [
      o.orderNumber,
      `"${o.customerName}"`,
      o.customerEmail,
      o.status,
      o.total,
      o.date
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `connectcrm_orders_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setToastMessage(`Exported ${filteredOrders.length} orders to CSV successfully.`);
    setTimeout(() => setToastMessage(null), 4000);
  };

  return (
    <DashboardLayout 
      pageTitle="Orders" 
      currentPath="/orders"
      searchQuery={searchQuery}
      onSearchChange={setSearchQuery}
    >
      {/* Toast Alert */}
      {toastMessage && (
        <div className="mb-6 flex items-center justify-between rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-[#34D399] transition-all">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-[#34D399]" />
            <span>{toastMessage}</span>
          </div>
          <button
            onClick={() => setToastMessage(null)}
            className="text-xs font-semibold text-[#34D399] hover:underline"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Header */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-[#F1F5F9] sm:text-2xl flex items-center gap-2">
            <ShoppingBag className="h-6 w-6 text-[#A78BFA]" />
            Order Management
          </h2>
          <p className="mt-1 text-xs sm:text-sm text-[#94A3B8]">
            Manage synchronized orders, fulfillment states, and payment lifecycles.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={handleExportCSV}
            className="inline-flex items-center gap-1.5 rounded-lg border border-[#263449] bg-[#151F32] px-3 py-2 text-xs font-medium text-[#F1F5F9] hover:bg-[#1B2840] transition-colors"
          >
            <Download className="h-3.5 w-3.5 text-[#94A3B8]" />
            <span>Export CSV</span>
          </button>

          <button
            type="button"
            onClick={fetchOrders}
            className="inline-flex items-center gap-1.5 rounded-lg border border-[#263449] bg-[#151F32] px-3 py-2 text-xs font-medium text-[#94A3B8] hover:text-[#F1F5F9] hover:bg-[#1B2840] transition-colors"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Table Card */}
      <div className="rounded-xl border border-[#263449] bg-[#151F32] shadow-lg">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-b border-[#263449] p-4 sm:px-6">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#94A3B8]">
            {loading ? 'Loading orders...' : `Showing ${filteredOrders.length} orders`}
          </span>

          {/* Status Filter Tabs */}
          <div className="flex items-center gap-1 overflow-x-auto rounded-lg border border-[#263449] bg-[#0F172A] p-1 text-xs">
            {(['all', 'completed', 'processing', 'pending', 'cancelled'] as const).map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setStatusFilter(tab)}
                className={`rounded-md px-2.5 py-1 font-medium capitalize transition-colors ${
                  statusFilter === tab
                    ? 'bg-[#1B2840] text-[#60A5FA] shadow-xs'
                    : 'text-[#94A3B8] hover:text-[#F1F5F9]'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {error && (
          <div className="p-8 text-center text-rose-400 text-xs flex flex-col items-center justify-center gap-2">
            <AlertCircle className="h-6 w-6" />
            <span>{error}</span>
            <button
              onClick={fetchOrders}
              className="mt-2 text-xs text-[#60A5FA] underline"
            >
              Try again
            </button>
          </div>
        )}

        {loading && !error && (
          <div className="py-16 text-center text-xs text-[#94A3B8]">
            <RefreshCw className="h-6 w-6 animate-spin mx-auto mb-2 text-[#60A5FA]" />
            Loading orders from backend...
          </div>
        )}

        {!loading && !error && (
          <RecentOrdersTable orders={filteredOrders} />
        )}
      </div>
    </DashboardLayout>
  );
}

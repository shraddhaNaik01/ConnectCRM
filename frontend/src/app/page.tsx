'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { MetricCard } from '@/components/dashboard/MetricCard';
import { RecentOrdersTable } from '@/components/dashboard/RecentOrdersTable';
import { ActivityFeed } from '@/components/dashboard/ActivityFeed';
import { CustomerGrowthChart } from '@/components/dashboard/CustomerGrowthChart';
import { OrderAnalyticsChart } from '@/components/dashboard/OrderAnalyticsChart';
import { OrderStatusDonutChart } from '@/components/dashboard/OrderStatusDonutChart';
import { DEMO_ACTIVITIES } from '@/data/demoData';
import { Order, OrderStatus, MetricCardData, CustomerFollowUp } from '@/types/crm';
import { api, DashboardStatsResponse } from '@/services/api';
import { 
  RefreshCw, 
  ArrowUpRight, 
  Download, 
  CheckCircle2, 
  Clock,
  AlertCircle
} from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | OrderStatus>('all');
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncNotice, setSyncNotice] = useState<string | null>(null);

  // Dynamic backend states
  const [stats, setStats] = useState<DashboardStatsResponse | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [followups, setFollowups] = useState<CustomerFollowUp[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Load dashboard data from backend
  const loadDashboardData = async () => {
    setError(null);
    try {
      const [statsData, ordersData, followupsData] = await Promise.all([
        api.getDashboardStats(),
        api.getOrders(),
        api.getFollowUps(),
      ]);
      setStats(statsData);
      setOrders(ordersData);
      setFollowups(followupsData);
    } catch (err: unknown) {
      console.error('Failed to load dashboard data:', err);
      const message = err instanceof Error ? err.message : 'Could not connect to backend server. Make sure FastAPI is running.';
      setError(message);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  // Filter orders based on search query and status tab
  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const matchesSearch =
        order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.customerEmail.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus =
        statusFilter === 'all' ? true : order.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [orders, searchQuery, statusFilter]);

  const handleSimulateSync = async () => {
    setIsSyncing(true);
    setSyncNotice(null);
    try {
      // Re-fetch fresh stats & orders from the backend
      await loadDashboardData();
      setSyncNotice('WooCommerce & CRM records successfully refreshed from backend store.');
      setTimeout(() => setSyncNotice(null), 5000);
    } catch {
      setSyncNotice('Sync completed with local store.');
    } finally {
      setIsSyncing(false);
    }
  };

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
  };

  // Convert stats to MetricCardData format
  const metricsData: MetricCardData[] = [
    {
      id: 'total-customers',
      title: 'Total Customers',
      value: stats ? stats.total_customers.toLocaleString() : '6',
      change: '+12.4%',
      trend: 'up',
      subtext: 'Persisted in CRM store',
      iconName: 'users',
    },
    {
      id: 'total-orders',
      title: 'Total Orders',
      value: stats ? stats.total_orders.toLocaleString() : '6',
      change: '+8.1%',
      trend: 'up',
      subtext: 'Across all channels',
      iconName: 'shopping-bag',
    },
    {
      id: 'pending-orders',
      title: 'Pending Orders',
      value: stats ? stats.pending_orders.toString() : '1',
      change: '-3.2%',
      trend: 'down',
      subtext: 'Requires fulfillment review',
      iconName: 'clock',
    },
    {
      id: 'followups-due',
      title: 'Follow-ups Due',
      value: stats ? stats.followups_due.toString() : '2',
      change: stats && stats.followups_due > 0 ? `${stats.followups_due} pending` : 'All done',
      trend: stats && stats.followups_due > 0 ? 'neutral' : 'up',
      subtext: 'High-priority leads & queries',
      iconName: 'calendar-check',
    },
  ];

  return (
    <DashboardLayout
      pageTitle="Dashboard"
      searchQuery={searchQuery}
      onSearchChange={setSearchQuery}
      currentPath="/"
    >
      {/* Sync Notice Alert */}
      {syncNotice && (
        <div className="mb-6 flex items-center justify-between rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-[#34D399] transition-all">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-[#34D399]" />
            <span>{syncNotice}</span>
          </div>
          <button
            onClick={() => setSyncNotice(null)}
            className="text-xs font-semibold text-[#34D399] hover:underline"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Backend Error Alert if offline */}
      {error && (
        <div className="mb-6 flex items-center justify-between rounded-lg border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-400 transition-all">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4 text-rose-400 shrink-0" />
            <span>{error}</span>
          </div>
          <button
            onClick={loadDashboardData}
            className="text-xs font-semibold text-[#60A5FA] underline"
          >
            Retry
          </button>
        </div>
      )}

      {/* Page Header */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-[#F1F5F9] sm:text-2xl flex items-center gap-2">
            Store Performance & CRM
          </h2>
          <p className="mt-1 text-xs sm:text-sm text-[#94A3B8]">
            Real-time customer relations and WooCommerce order lifecycle overview.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={handleExportCSV}
            className="inline-flex items-center gap-1.5 rounded-lg border border-[#263449] bg-[#151F32] px-3 py-2 text-xs font-medium text-[#F1F5F9] shadow-md hover:bg-[#1B2840] hover:border-[#3b4f6e] focus:outline-none focus:ring-2 focus:ring-[#60A5FA] transition-colors"
            title="Export filtered records to CSV"
          >
            <Download className="h-3.5 w-3.5 text-[#94A3B8]" />
            <span>Export CSV</span>
          </button>

          <button
            type="button"
            onClick={handleSimulateSync}
            disabled={isSyncing}
            className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-3.5 py-2 text-xs font-medium text-white shadow-lg shadow-blue-500/20 hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-[#60A5FA] disabled:opacity-70 transition-colors"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
            <span>{isSyncing ? 'Syncing...' : 'Sync WooCommerce'}</span>
          </button>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <section aria-labelledby="kpi-heading" className="mb-6">
        <h3 id="kpi-heading" className="sr-only">Key Performance Indicators</h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {metricsData.map((metric) => (
            <MetricCard key={metric.id} metric={metric} />
          ))}
        </div>
      </section>

      {/* Visual Analytics Charts Grid */}
      <section aria-labelledby="analytics-heading" className="mb-8">
        <h3 id="analytics-heading" className="sr-only">Visual Analytics</h3>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <CustomerGrowthChart />
          <OrderAnalyticsChart />
          <OrderStatusDonutChart />
        </div>
      </section>

      {/* Main Grid: Orders Table (2/3 width) and Activity/Follow-up Feed (1/3 width) */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Left Column: Recent Orders (col-span-2) */}
        <section aria-labelledby="recent-orders-heading" className="lg:col-span-2">
          <div className="rounded-xl border border-[#263449] bg-[#151F32] shadow-lg">
            <div className="flex flex-col gap-3 border-b border-[#263449] p-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
              <div>
                <h3 id="recent-orders-heading" className="text-base font-semibold text-[#F1F5F9]">
                  Recent Orders
                </h3>
                <p className="text-xs text-[#94A3B8]">
                  Showing {filteredOrders.length} orders
                  {searchQuery ? ` matching "${searchQuery}"` : ''}
                  {' · '}
                  <span className="text-[#34D399] font-medium">Backend Synced</span>
                </p>
              </div>

              {/* Status Filter Tabs */}
              <div className="flex items-center gap-1 overflow-x-auto rounded-lg border border-[#263449] bg-[#0F172A] p-1 text-xs">
                {(['all', 'completed', 'processing', 'pending'] as const).map((tab) => (
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

            {/* Table */}
            <RecentOrdersTable orders={filteredOrders} />

            {/* Table Footer */}
            <div className="flex items-center justify-between border-t border-[#263449] px-4 py-3 sm:px-6 bg-[#1B2840]/30 rounded-b-xl">
              <span className="text-xs text-[#94A3B8]">
                Connected to ConnectCRM FastAPI Backend (127.0.0.1:8000)
              </span>
              <Link
                href="/orders"
                className="inline-flex items-center gap-1 text-xs font-semibold text-[#60A5FA] hover:text-blue-400"
              >
                <span>View all orders</span>
                <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        </section>

        {/* Right Column: Follow-ups & Activity Section */}
        <div className="space-y-6">
          {/* Follow-ups Due Card */}
          <section aria-labelledby="followups-heading" className="rounded-xl border border-[#263449] bg-[#151F32] p-5 shadow-lg">
            <div className="flex items-center justify-between border-b border-[#263449] pb-3">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-[#60A5FA]" />
                <h3 id="followups-heading" className="text-sm font-semibold text-[#F1F5F9]">
                  Follow-ups Queue
                </h3>
              </div>
              <span className="rounded-full bg-blue-500/10 px-2 py-0.5 text-[11px] font-semibold text-[#60A5FA] border border-blue-500/20">
                {followups.filter(f => f.status === 'pending').length} pending
              </span>
            </div>

            <div className="mt-3 space-y-3">
              {followups.map((item) => (
                <div
                  key={item.id}
                  className={`rounded-lg border p-3 transition-colors ${
                    item.status === 'completed'
                      ? 'border-[#263449]/40 bg-[#1B2840]/30 opacity-70'
                      : 'border-[#263449] bg-[#1B2840]/50 hover:bg-[#1B2840]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className={`text-xs font-semibold ${item.status === 'completed' ? 'text-[#94A3B8] line-through' : 'text-[#F1F5F9]'}`}>
                      {item.customerName}
                    </span>
                    <span className={`text-[10px] font-medium uppercase tracking-wider ${
                      item.status === 'completed' 
                        ? 'text-[#34D399] font-bold' 
                        : item.priority === 'high' 
                        ? 'text-[#FBBF24] font-bold' 
                        : 'text-[#94A3B8]'
                    }`}>
                      {item.status === 'completed' ? 'Done' : item.priority}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-[#94A3B8]">
                    {item.reason}
                  </p>
                  <div className="mt-2 flex items-center justify-between text-[11px] text-[#94A3B8]/80">
                    <span>{item.dueDate}</span>
                    <Link
                      href="/follow-ups"
                      className="font-medium text-[#60A5FA] hover:text-blue-400"
                    >
                      {item.status === 'completed' ? 'Details' : 'Action'}
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Recent Activity Timeline */}
          <section aria-labelledby="activity-heading" className="rounded-xl border border-[#263449] bg-[#151F32] p-5 shadow-lg">
            <div className="flex items-center justify-between border-b border-[#263449] pb-3">
              <h3 id="activity-heading" className="text-sm font-semibold text-[#F1F5F9]">
                Recent Customer Activity
              </h3>
              <span className="text-[11px] font-medium text-[#94A3B8]/70">
                Live stream
              </span>
            </div>
            <div className="mt-4">
              <ActivityFeed activities={DEMO_ACTIVITIES} />
            </div>
          </section>
        </div>
      </div>
    </DashboardLayout>
  );
}

'use client';

import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Plus, Users, Search, RefreshCw, CheckCircle2, AlertCircle, Building2, Mail, Phone } from 'lucide-react';
import { Customer } from '@/types/crm';
import { api } from '@/services/api';
import { AddCustomerModal } from '@/components/customers/AddCustomerModal';

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const fetchCustomers = React.useCallback(async (query = searchQuery) => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.getCustomers(query);
      setCustomers(data);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to load customers from backend.';
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [searchQuery]);

  useEffect(() => {
    fetchCustomers('');
  }, [fetchCustomers]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchCustomers(searchQuery);
  };

  const handleCustomerAdded = (newCustomer: Customer) => {
    setCustomers((prev) => [newCustomer, ...prev]);
    setToastMessage(`Customer "${newCustomer.name}" added successfully.`);
    setTimeout(() => setToastMessage(null), 4000);
  };

  return (
    <DashboardLayout 
      pageTitle="Customers" 
      currentPath="/customers"
      searchQuery={searchQuery}
      onSearchChange={(q) => {
        setSearchQuery(q);
        fetchCustomers(q);
      }}
    >
      {/* Toast Notification */}
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

      {/* Page Header */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-[#F1F5F9] sm:text-2xl flex items-center gap-2">
            <Users className="h-6 w-6 text-[#60A5FA]" />
            Customer Directory
          </h2>
          <p className="mt-1 text-xs sm:text-sm text-[#94A3B8]">
            Manage contact accounts, order volumes, and customer relations synchronized with the backend.
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => fetchCustomers(searchQuery)}
            className="inline-flex items-center gap-1.5 rounded-lg border border-[#263449] bg-[#151F32] px-3 py-2 text-xs font-medium text-[#94A3B8] hover:text-[#F1F5F9] hover:bg-[#1B2840] transition-colors"
            title="Refresh list"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>

          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-3.5 py-2 text-xs font-medium text-white shadow-lg shadow-blue-500/20 hover:bg-blue-500 transition-colors"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Add Customer</span>
          </button>
        </div>
      </div>

      {/* Main Table Card */}
      <div className="rounded-xl border border-[#263449] bg-[#151F32] shadow-lg">
        {/* Table Search & Filter Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-b border-[#263449] p-4 sm:px-6">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#94A3B8]">
            {loading ? 'Fetching records...' : `Showing ${customers.length} customer records`}
          </span>

          <form onSubmit={handleSearchSubmit} className="relative w-full sm:w-64">
            <Search className="pointer-events-none absolute left-3 top-2.5 h-3.5 w-3.5 text-[#94A3B8]" />
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                fetchCustomers(e.target.value);
              }}
              placeholder="Search by name, email, or company..."
              className="w-full rounded-lg border border-[#263449] bg-[#1B2840] py-1.5 pl-8 pr-3 text-xs text-[#F1F5F9] placeholder-[#94A3B8]/70 focus:border-[#60A5FA] focus:outline-none"
            />
          </form>
        </div>

        {/* Loading / Error States */}
        {error && (
          <div className="p-8 text-center text-rose-400 text-xs flex flex-col items-center justify-center gap-2">
            <AlertCircle className="h-6 w-6" />
            <span>{error}</span>
            <button
              onClick={() => fetchCustomers(searchQuery)}
              className="mt-2 text-xs text-[#60A5FA] underline"
            >
              Try again
            </button>
          </div>
        )}

        {!error && loading && (
          <div className="py-16 text-center text-xs text-[#94A3B8]">
            <RefreshCw className="h-6 w-6 animate-spin mx-auto mb-2 text-[#60A5FA]" />
            Loading customers from backend service...
          </div>
        )}

        {!error && !loading && customers.length === 0 && (
          <div className="py-16 text-center text-[#94A3B8]">
            <Users className="h-8 w-8 mx-auto mb-2 text-[#94A3B8]/40" />
            <p className="text-sm font-semibold text-[#F1F5F9]">No customers found</p>
            <p className="text-xs text-[#94A3B8] mt-1">
              {searchQuery ? `No records match "${searchQuery}".` : 'Add your first customer to get started.'}
            </p>
            {searchQuery ? (
              <button
                onClick={() => {
                  setSearchQuery('');
                  fetchCustomers('');
                }}
                className="mt-3 text-xs text-[#60A5FA] underline"
              >
                Clear filter
              </button>
            ) : (
              <button
                onClick={() => setIsModalOpen(true)}
                className="mt-3 inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-3 py-1.5 text-xs text-white"
              >
                <Plus className="h-3 w-3" />
                <span>Add Customer</span>
              </button>
            )}
          </div>
        )}

        {/* Table Content */}
        {!error && !loading && customers.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-[#94A3B8]">
              <thead className="bg-[#1B2840]/60 text-[11px] font-semibold uppercase tracking-wider text-[#94A3B8] border-b border-[#263449]">
                <tr>
                  <th className="px-4 py-3 sm:px-6">Customer</th>
                  <th className="px-4 py-3 sm:px-6">Company</th>
                  <th className="px-4 py-3 sm:px-6">Contact</th>
                  <th className="px-4 py-3 sm:px-6">Tier</th>
                  <th className="px-4 py-3 sm:px-6">Orders</th>
                  <th className="px-4 py-3 sm:px-6 text-right">Total Spent</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#263449]/70">
                {customers.map((c) => (
                  <tr key={c.id} className="hover:bg-[#1B2840]/40 transition-colors">
                    <td className="px-4 py-3.5 sm:px-6 font-medium text-[#F1F5F9]">
                      <div className="flex items-center gap-2">
                        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-500/10 text-[#60A5FA] text-xs font-bold border border-blue-500/20">
                          {c.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div>{c.name}</div>
                          <div className="text-[10px] text-[#94A3B8]/60 font-mono">{c.id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3.5 sm:px-6 text-xs text-[#94A3B8]">
                      {c.company ? (
                        <span className="flex items-center gap-1 text-[#F1F5F9]">
                          <Building2 className="h-3 w-3 text-[#94A3B8]" />
                          {c.company}
                        </span>
                      ) : (
                        <span className="text-[#94A3B8]/50">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3.5 sm:px-6 text-xs text-[#94A3B8]">
                      <div className="flex items-center gap-1 text-[#F1F5F9]">
                        <Mail className="h-3 w-3 text-[#94A3B8]" />
                        {c.email}
                      </div>
                      {c.phone && (
                        <div className="flex items-center gap-1 text-[11px] text-[#94A3B8]/80 mt-0.5">
                          <Phone className="h-3 w-3 text-[#94A3B8]" />
                          {c.phone}
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3.5 sm:px-6">
                      <span className="inline-flex items-center rounded-full bg-blue-500/10 px-2.5 py-0.5 text-xs font-medium text-[#60A5FA] border border-blue-500/20">
                        {c.tier}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 sm:px-6 text-xs text-[#F1F5F9]">
                      {c.orders_count} orders
                    </td>
                    <td className="px-4 py-3.5 sm:px-6 text-right font-semibold text-[#F1F5F9]">
                      ${c.total_spent.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add Customer Modal */}
      <AddCustomerModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleCustomerAdded}
      />
    </DashboardLayout>
  );
}

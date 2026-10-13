'use client';

import React, { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { RefreshCw, CheckCircle2, AlertTriangle, Key, Globe, ShieldAlert } from 'lucide-react';
import { api } from '@/services/api';

export default function IntegrationsPage() {
  const [storeUrl, setStoreUrl] = useState('https://demo-store.local');
  const [consumerKey, setConsumerKey] = useState('ck_demo_984719284729104');
  const [consumerSecret, setConsumerSecret] = useState('cs_demo_837194827492819');
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ status: 'success' | 'notice' | 'error'; message: string } | null>(null);

  const handleTestConnection = async (e: React.FormEvent) => {
    e.preventDefault();
    setTesting(true);
    setTestResult(null);

    try {
      const res = await api.testIntegration({
        store_url: storeUrl,
        consumer_key: consumerKey,
        consumer_secret: consumerSecret,
      });

      if (res.status === 'connected_sandbox') {
        setTestResult({
          status: 'notice',
          message: res.message,
        });
      } else {
        setTestResult({
          status: 'success',
          message: res.message,
        });
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Connection failed. Verify API URL and key format.';
      setTestResult({
        status: 'error',
        message,
      });
    } finally {
      setTesting(false);
    }
  };

  return (
    <DashboardLayout pageTitle="Integrations" currentPath="/integrations">
      <div className="mb-6">
        <h2 className="text-xl font-bold tracking-tight text-[#F1F5F9] sm:text-2xl flex items-center gap-2">
          <RefreshCw className="h-6 w-6 text-[#60A5FA]" />
          E-Commerce Integrations
        </h2>
        <p className="mt-1 text-xs sm:text-sm text-[#94A3B8]">
          Configure WooCommerce REST API credentials and synchronization settings.
        </p>
      </div>

      <div className="space-y-6">
        {/* WooCommerce Card */}
        <div className="rounded-xl border border-[#263449] bg-[#151F32] p-6 shadow-lg">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-[#263449] pb-5">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-violet-500/10 text-[#A78BFA] font-bold text-lg border border-violet-500/20">
                Woo
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-semibold text-[#F1F5F9]">WooCommerce REST API v3</h3>
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-medium text-[#34D399] border border-emerald-500/20">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#34D399] animate-pulse" />
                    Sandbox Active
                  </span>
                </div>
                <p className="text-xs text-[#94A3B8] mt-0.5">
                  Automated sync for orders, customer profiles, and order status updates.
                </p>
              </div>
            </div>

            <span className="text-xs font-medium text-[#94A3B8] border border-[#263449] px-2.5 py-1 rounded-lg bg-[#1B2840]">
              REST v3 Protocol
            </span>
          </div>

          {/* Test Status Banner */}
          {testResult && (
            <div className={`mt-5 flex items-start gap-3 rounded-lg border p-4 text-xs ${
              testResult.status === 'success'
                ? 'border-emerald-500/30 bg-emerald-500/10 text-[#34D399]'
                : testResult.status === 'notice'
                ? 'border-amber-500/30 bg-amber-500/10 text-[#FBBF24]'
                : 'border-rose-500/30 bg-rose-500/10 text-rose-400'
            }`}>
              {testResult.status === 'success' ? (
                <CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5" />
              ) : testResult.status === 'notice' ? (
                <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
              ) : (
                <ShieldAlert className="h-4 w-4 shrink-0 mt-0.5" />
              )}
              <div className="flex-1">
                <span className="font-semibold block mb-0.5">
                  {testResult.status === 'success' ? 'Verification Passed' : testResult.status === 'notice' ? 'Sandbox Simulation Notice' : 'Connection Failed'}
                </span>
                <span>{testResult.message}</span>
              </div>
            </div>
          )}

          {/* Integration Form with Test Button */}
          <form onSubmit={handleTestConnection} className="mt-6 space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#94A3B8] mb-1">
                WooCommerce Store URL
              </label>
              <div className="relative">
                <Globe className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-[#94A3B8]" />
                <input
                  type="url"
                  value={storeUrl}
                  onChange={(e) => setStoreUrl(e.target.value)}
                  placeholder="https://yourstore.com"
                  className="w-full rounded-lg border border-[#263449] bg-[#1B2840] py-2 pl-9 pr-3 text-sm text-[#F1F5F9] focus:outline-none focus:ring-2 focus:ring-[#60A5FA]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#94A3B8] mb-1">
                  Consumer Key (ck_...)
                </label>
                <div className="relative">
                  <Key className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-[#94A3B8]" />
                  <input
                    type="text"
                    value={consumerKey}
                    onChange={(e) => setConsumerKey(e.target.value)}
                    placeholder="ck_xxxxxxxxxxxx"
                    className="w-full rounded-lg border border-[#263449] bg-[#1B2840] py-2 pl-9 pr-3 text-sm font-mono text-[#F1F5F9] focus:outline-none focus:ring-2 focus:ring-[#60A5FA]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#94A3B8] mb-1">
                  Consumer Secret (cs_...)
                </label>
                <div className="relative">
                  <Key className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-[#94A3B8]" />
                  <input
                    type="password"
                    value={consumerSecret}
                    onChange={(e) => setConsumerSecret(e.target.value)}
                    placeholder="cs_xxxxxxxxxxxx"
                    className="w-full rounded-lg border border-[#263449] bg-[#1B2840] py-2 pl-9 pr-3 text-sm font-mono text-[#F1F5F9] focus:outline-none focus:ring-2 focus:ring-[#60A5FA]"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between border-t border-[#263449] pt-4">
              <span className="text-xs text-[#94A3B8]">
                Webhook Status: <strong className="text-[#34D399]">Healthy (200 OK)</strong>
              </span>

              <button
                type="submit"
                disabled={testing}
                className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2 text-xs font-medium text-white shadow-lg shadow-blue-500/20 hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-[#60A5FA] disabled:opacity-50 transition-colors"
              >
                <RefreshCw className={`h-3.5 w-3.5 ${testing ? 'animate-spin' : ''}`} />
                <span>{testing ? 'Testing connection...' : 'Test Connection'}</span>
              </button>
            </div>
          </form>

          <div className="mt-5 rounded-lg border border-blue-500/20 bg-blue-500/10 p-4 text-xs text-[#60A5FA] leading-relaxed">
            <span className="font-semibold text-white">Security Notice:</span> Credentials are validated through the backend server. When connecting a production store in Stage 3, production secrets should be placed in `backend/.env` without committing them to version control.
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

'use client';

import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { CustomerFollowUp } from '@/types/crm';
import { api } from '@/services/api';
import { CalendarClock, CheckCircle, Clock, AlertCircle, RefreshCw } from 'lucide-react';

export default function FollowUpsPage() {
  const [followups, setFollowups] = useState<CustomerFollowUp[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [completingId, setCompletingId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const fetchFollowups = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.getFollowUps();
      setFollowups(data);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to load follow-ups from backend.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFollowups();
  }, []);

  const handleMarkDone = async (id: string, customerName: string) => {
    if (completingId) return; // prevent duplicate clicks
    setCompletingId(id);
    try {
      const updated = await api.markFollowUpDone(id);
      // Immediately update local state for the specific item only
      setFollowups((prev) =>
        prev.map((item) => (item.id === id ? { ...item, status: 'completed', completed_at: updated.completed_at } : item))
      );
      setToastMessage(`Follow-up for "${customerName}" marked as completed.`);
      setTimeout(() => setToastMessage(null), 4000);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      alert(`Error completing follow-up: ${message}`);
    } finally {
      setCompletingId(null);
    }
  };

  const pendingCount = followups.filter((f) => f.status === 'pending').length;

  return (
    <DashboardLayout pageTitle="Follow-ups" currentPath="/follow-ups">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="mb-6 flex items-center justify-between rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-[#34D399] transition-all">
          <div className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-[#34D399]" />
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
            <CalendarClock className="h-6 w-6 text-[#34D399]" />
            Customer Follow-ups
          </h2>
          <p className="mt-1 text-xs sm:text-sm text-[#94A3B8]">
            Manage priority client calls, abandoned checkout consultations, and service queues.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <span className="rounded-full bg-blue-500/10 px-3 py-1 text-xs font-semibold text-[#60A5FA] border border-blue-500/20">
            {pendingCount} Pending Action
          </span>
          <button
            type="button"
            onClick={fetchFollowups}
            className="inline-flex items-center gap-1.5 rounded-lg border border-[#263449] bg-[#151F32] px-3 py-2 text-xs font-medium text-[#94A3B8] hover:text-[#F1F5F9] hover:bg-[#1B2840] transition-colors"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Loading & Error States */}
      {error && (
        <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 p-6 text-center text-xs text-rose-400">
          <AlertCircle className="h-6 w-6 mx-auto mb-2" />
          <span>{error}</span>
          <button
            onClick={fetchFollowups}
            className="block mx-auto mt-2 text-[#60A5FA] underline"
          >
            Try again
          </button>
        </div>
      )}

      {loading && !error && (
        <div className="py-16 text-center text-xs text-[#94A3B8]">
          <RefreshCw className="h-6 w-6 animate-spin mx-auto mb-2 text-[#60A5FA]" />
          Loading follow-ups from backend...
        </div>
      )}

      {/* Follow-up Cards List */}
      {!loading && !error && (
        <div className="space-y-4">
          {followups.map((f) => {
            const isCompleted = f.status === 'completed';
            const isTargetLoading = completingId === f.id;

            return (
              <div
                key={f.id}
                className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-xl border p-5 shadow-lg transition-all ${
                  isCompleted
                    ? 'border-[#263449]/50 bg-[#151F32]/60 opacity-80'
                    : 'border-[#263449] bg-[#151F32] hover:border-[#384b66]'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border ${
                    isCompleted
                      ? 'bg-emerald-500/10 border-emerald-500/20 text-[#34D399]'
                      : 'bg-[#1B2840] border-[#263449] text-[#60A5FA]'
                  }`}>
                    {isCompleted ? <CheckCircle className="h-5 w-5" /> : <CalendarClock className="h-5 w-5" />}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className={`text-sm font-semibold ${isCompleted ? 'text-[#94A3B8] line-through' : 'text-[#F1F5F9]'}`}>
                        {f.customerName}
                      </h4>
                      <span className={`rounded px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                        isCompleted
                          ? 'bg-emerald-500/10 text-[#34D399] border border-emerald-500/20'
                          : f.priority === 'high'
                          ? 'bg-amber-500/10 text-[#FBBF24] border border-amber-500/20'
                          : 'bg-slate-500/10 text-[#94A3B8] border border-slate-500/20'
                      }`}>
                        {isCompleted ? 'Completed' : `${f.priority} Priority`}
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-[#94A3B8]">{f.reason}</p>
                    <div className="mt-2 flex items-center gap-4 text-xs text-[#94A3B8]/80">
                      <span>{f.email}</span>
                      <span>·</span>
                      <span className="flex items-center gap-1 font-medium text-[#F1F5F9]">
                        <Clock className="h-3 w-3 text-[#60A5FA]" />
                        {isCompleted ? 'Task completed' : `Due: ${f.dueDate}`}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center">
                  {isCompleted ? (
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#34D399] px-3 py-1.5 bg-emerald-500/10 rounded-lg border border-emerald-500/20">
                      <CheckCircle className="h-3.5 w-3.5" />
                      Completed
                    </span>
                  ) : (
                    <button
                      type="button"
                      disabled={isTargetLoading}
                      onClick={() => handleMarkDone(f.id, f.customerName)}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-[#263449] bg-[#1B2840] px-3.5 py-1.5 text-xs font-medium text-[#F1F5F9] hover:border-[#34D399] hover:text-[#34D399] focus:outline-none focus:ring-2 focus:ring-[#34D399] disabled:opacity-50 transition-colors"
                    >
                      {isTargetLoading ? (
                        <>
                          <span className="h-3 w-3 animate-spin rounded-full border-2 border-[#34D399] border-t-transparent" />
                          <span>Updating...</span>
                        </>
                      ) : (
                        <>
                          <CheckCircle className="h-3.5 w-3.5 text-[#34D399]" />
                          <span>Mark Done</span>
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </DashboardLayout>
  );
}

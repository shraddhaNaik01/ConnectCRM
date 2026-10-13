'use client';

import React from 'react';
import Link from 'next/link';
import { 
  LayoutDashboard, 
  Users, 
  ShoppingBag, 
  CalendarClock, 
  RefreshCw, 
  HelpCircle,
  ChevronRight,
  Layers
} from 'lucide-react';

interface SidebarProps {
  currentPath?: string;
  isOpen?: boolean;
  onClose?: () => void;
}

export const navigationItems = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard, badge: null },
  { name: 'Customers', href: '/customers', icon: Users, badge: '1.2k' },
  { name: 'Orders', href: '/orders', icon: ShoppingBag, badge: '19 pending' },
  { name: 'Follow-ups', href: '/follow-ups', icon: CalendarClock, badge: '7 due' },
  { name: 'Integrations', href: '/integrations', icon: RefreshCw, badge: 'Active' },
];

export function Sidebar({ currentPath = '/', isOpen = false, onClose }: SidebarProps) {
  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm lg:hidden transition-opacity" 
          aria-hidden="true"
        />
      )}

      {/* Sidebar container */}
      <aside 
        className={`fixed top-0 bottom-0 left-0 z-50 flex w-64 flex-col border-r border-[#263449] bg-[#0F172A] text-[#F1F5F9] transition-transform duration-200 ease-in-out lg:static lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="flex h-16 items-center gap-3 px-6 border-b border-[#263449]">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/20 ring-1 ring-white/20">
            <Layers className="h-5 w-5" />
          </div>
          <div className="flex flex-col">
            <span className="text-base font-bold tracking-tight text-white flex items-center gap-1.5">
              ConnectCRM
            </span>
            <span className="text-[11px] font-medium text-[#94A3B8]">
              WooCommerce Hub
            </span>
          </div>
        </div>

        {/* Navigation list */}
        <div className="flex-1 overflow-y-auto px-3 py-4">
          <div className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-wider text-[#94A3B8]">
            Main Menu
          </div>
          <nav className="space-y-1">
            {navigationItems.map((item) => {
              const isActive = currentPath === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={onClose}
                  className={`group relative flex items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-[#1B2840] text-[#60A5FA] font-semibold shadow-inner shadow-blue-500/5'
                      : 'text-[#94A3B8] hover:bg-[#151F32] hover:text-[#F1F5F9]'
                  }`}
                >
                  {isActive && (
                    <span className="absolute left-0 top-1.5 bottom-1.5 w-1 rounded-r-full bg-[#60A5FA]" />
                  )}
                  <div className="flex items-center gap-3">
                    <Icon
                      className={`h-4 w-4 transition-colors ${
                        isActive ? 'text-[#60A5FA]' : 'text-[#94A3B8] group-hover:text-[#F1F5F9]'
                      }`}
                    />
                    <span>{item.name}</span>
                  </div>
                  {item.badge && (
                    <span
                      className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium ${
                        isActive
                          ? 'bg-[#60A5FA]/15 text-[#60A5FA] border border-[#60A5FA]/30'
                          : 'bg-[#151F32] text-[#94A3B8] border border-[#263449] group-hover:border-[#384b66]'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          <div className="mt-8 px-3 pb-2 text-[11px] font-semibold uppercase tracking-wider text-[#94A3B8]">
            WooCommerce Live Status
          </div>
          <div className="rounded-xl border border-[#263449] bg-[#151F32] p-3.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[#F1F5F9]">REST API v3</span>
              <span className="flex h-2 w-2 rounded-full bg-[#34D399] ring-2 ring-[#34D399]/20 animate-pulse" />
            </div>
            <p className="mt-1 text-xs text-[#94A3B8]">
              Demo sandbox mode configured. Real-time sync ready.
            </p>
            <div className="mt-3 flex items-center justify-between border-t border-[#263449] pt-2.5 text-[11px] text-[#94A3B8]">
              <span>Sync status</span>
              <span className="text-[#34D399] font-medium">Connected</span>
            </div>
          </div>
        </div>

        {/* Sidebar Footer */}
        <div className="border-t border-[#263449] p-3">
          <div className="flex items-center justify-between rounded-lg p-2 hover:bg-[#151F32] transition-colors cursor-pointer">
            <div className="flex items-center gap-2">
              <HelpCircle className="h-4 w-4 text-[#94A3B8]" />
              <span className="text-xs font-medium text-[#94A3B8]">Documentation & API</span>
            </div>
            <ChevronRight className="h-3.5 w-3.5 text-[#94A3B8]" />
          </div>
        </div>
      </aside>
    </>
  );
}

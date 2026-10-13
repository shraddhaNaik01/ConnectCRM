'use client';

import React from 'react';
import { Search, Bell, Menu, X, ChevronRight } from 'lucide-react';
import Link from 'next/link';

interface NavbarProps {
  pageTitle?: string;
  onOpenMobileMenu?: () => void;
  searchQuery?: string;
  onSearchChange?: (val: string) => void;
}

export function Navbar({
  pageTitle = 'Dashboard',
  onOpenMobileMenu,
  searchQuery = '',
  onSearchChange,
}: NavbarProps) {
  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-[#263449] bg-[#0F172A]/90 px-4 sm:px-6 backdrop-blur">
      <div className="flex items-center gap-3">
        {/* Mobile menu trigger */}
        <button
          type="button"
          onClick={onOpenMobileMenu}
          className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-[#263449] text-[#94A3B8] hover:bg-[#151F32] hover:text-[#F1F5F9] focus:outline-none focus:ring-2 focus:ring-[#60A5FA] lg:hidden"
          aria-label="Open mobile navigation menu"
        >
          <Menu className="h-5 w-5" />
        </button>

        {/* Page Title & Breadcrumb */}
        <div>
          <div className="flex items-center gap-1.5 text-xs text-[#94A3B8]">
            <Link href="/" className="hover:text-[#F1F5F9] transition-colors">ConnectCRM</Link>
            <ChevronRight className="h-3 w-3 text-[#94A3B8]" />
            <span className="text-[#60A5FA] font-medium">{pageTitle}</span>
          </div>
          <h1 className="text-base font-bold tracking-tight text-[#F1F5F9] sm:text-lg">
            {pageTitle}
          </h1>
        </div>
      </div>

      {/* Middle & Right section */}
      <div className="flex items-center gap-3 sm:gap-4">
        {/* Search input with live binding */}
        <div className="relative hidden w-64 md:block lg:w-80">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <Search className="h-4 w-4 text-[#94A3B8]" />
          </div>
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => onSearchChange?.(e.target.value)}
            placeholder="Search orders, customers, or SKUs..."
            className="w-full rounded-lg border border-[#263449] bg-[#151F32] py-1.5 pl-9 pr-8 text-sm text-[#F1F5F9] placeholder-[#94A3B8] focus:border-[#60A5FA] focus:bg-[#1B2840] focus:outline-none focus:ring-1 focus:ring-[#60A5FA] transition-colors"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => onSearchChange?.('')}
              className="absolute inset-y-0 right-0 flex items-center pr-2.5 text-[#94A3B8] hover:text-[#F1F5F9]"
              aria-label="Clear search"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        {/* Demo status pill */}
        <div className="hidden sm:inline-flex items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 px-2.5 py-1 text-xs font-medium text-amber-400">
          <span className="h-1.5 w-1.5 rounded-full bg-amber-400 animate-pulse" />
          <span>Demo Data Mode</span>
        </div>

        {/* Notification Bell with realistic pulse */}
        <button
          type="button"
          title="Notifications"
          className="relative rounded-lg p-2 text-[#94A3B8] hover:bg-[#151F32] hover:text-[#F1F5F9] focus:outline-none focus:ring-2 focus:ring-[#60A5FA]"
          aria-label="View notifications"
        >
          <Bell className="h-4 w-4" />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-[#60A5FA] ring-2 ring-[#0F172A]" />
        </button>

        {/* User profile avatar */}
        <div className="flex items-center gap-2.5 border-l border-[#263449] pl-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-tr from-blue-600 to-indigo-500 text-xs font-semibold text-white ring-2 ring-[#263449]">
            JD
          </div>
          <div className="hidden text-left xl:block">
            <div className="text-xs font-semibold text-[#F1F5F9] leading-none">
              John Doe
            </div>
            <div className="text-[11px] text-[#94A3B8] leading-none mt-1">
              Store Administrator
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

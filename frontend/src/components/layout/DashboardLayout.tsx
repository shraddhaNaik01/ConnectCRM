'use client';

import React, { useState } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { Navbar } from '@/components/layout/Navbar';

interface DashboardLayoutProps {
  children: React.ReactNode;
  pageTitle?: string;
  searchQuery?: string;
  onSearchChange?: (val: string) => void;
  currentPath?: string;
}

export function DashboardLayout({
  children,
  pageTitle = 'Dashboard Overview',
  searchQuery,
  onSearchChange,
  currentPath = '/',
}: DashboardLayoutProps) {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-[#0B1120] font-sans text-[#F1F5F9] antialiased">
      {/* Sidebar */}
      <Sidebar
        currentPath={currentPath}
        isOpen={mobileSidebarOpen}
        onClose={() => setMobileSidebarOpen(false)}
      />

      {/* Main content viewport */}
      <div className="flex flex-1 flex-col overflow-x-hidden min-w-0">
        <Navbar
          pageTitle={pageTitle}
          onOpenMobileMenu={() => setMobileSidebarOpen(true)}
          searchQuery={searchQuery}
          onSearchChange={onSearchChange}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <div className="mx-auto max-w-7xl">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

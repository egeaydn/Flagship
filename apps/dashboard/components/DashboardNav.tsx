'use client';

import { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import Link from 'next/link';

interface DashboardNavProps {
  user?: {
    email?: string | null;
  } | null;
  organization?: {
    name: string;
    slug: string;
  } | null;
  project?: {
    name: string;
    key: string;
  } | null;
}

export default function DashboardNav({ user, organization, project }: DashboardNavProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const isActive = (path: string) => pathname?.includes(path);

  // Navigation items based on context
  const getNavItems = () => {
    if (project && organization) {
      // Project-level navigation
      return [
        {
          name: 'Feature Flags',
          icon: '🚩',
          href: `/dashboard/${organization.slug}/projects/${project.key}`,
          active: pathname === `/dashboard/${organization.slug}/projects/${project.key}`,
        },
        {
          name: 'Analytics',
          icon: '📊',
          href: `/dashboard/${organization.slug}/projects/${project.key}/analytics`,
          active: isActive('/analytics'),
        },
        {
          name: 'Webhooks',
          icon: '🪝',
          href: `/dashboard/${organization.slug}/projects/${project.key}/webhooks`,
          active: isActive('/webhooks'),
        },
        {
          name: 'API Keys',
          icon: '🔑',
          href: `/dashboard/${organization.slug}/projects/${project.key}/api-keys`,
          active: isActive('/api-keys'),
        },
        {
          name: 'Audit Logs',
          icon: '📋',
          href: `/dashboard/${organization.slug}/audit-logs`,
          active: isActive('/audit-logs'),
        },
      ];
    } else if (organization) {
      // Organization-level navigation
      return [
        {
          name: 'Projects',
          icon: '📦',
          href: `/dashboard/${organization.slug}`,
          active: pathname === `/dashboard/${organization.slug}`,
        },
        {
          name: 'Audit Logs',
          icon: '📋',
          href: `/dashboard/${organization.slug}/audit-logs`,
          active: isActive('/audit-logs'),
        },
      ];
    } else {
      // Root dashboard navigation
      return [
        {
          name: 'Organizations',
          icon: '🏢',
          href: '/dashboard',
          active: pathname === '/dashboard',
        },
      ];
    }
  };

  const navItems = getNavItems();

  return (
    <>
      {/* Top Navigation Bar */}
      <nav className="bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Left Section - Logo & Breadcrumbs */}
            <div className="flex items-center space-x-3">
              {/* Mobile Menu Button */}
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>

              {/* Logo */}
              <Link href="/dashboard" className="flex items-center space-x-2 group">
                <div className="w-10 h-10 bg-gradient-to-br from-[#0066FF] to-[#00B8D4] rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                  <span className="text-xl">🚩</span>
                </div>
                <div className="hidden sm:block">
                  <h1 className="text-lg font-bold bg-gradient-to-r from-[#0066FF] to-[#00B8D4] bg-clip-text text-transparent">
                    Flagship
                  </h1>
                </div>
              </Link>

              {/* Breadcrumbs */}
              <div className="hidden md:flex items-center space-x-2 text-sm">
                {organization && (
                  <>
                    <span className="text-gray-400">/</span>
                    <Link 
                      href={`/dashboard/${organization.slug}`}
                      className="text-gray-600 hover:text-[#0066FF] transition-colors font-medium truncate max-w-[150px]"
                    >
                      {organization.name}
                    </Link>
                  </>
                )}
                {project && (
                  <>
                    <span className="text-gray-400">/</span>
                    <Link
                      href={`/dashboard/${organization?.slug}/projects/${project.key}`}
                      className="text-gray-600 hover:text-[#0066FF] transition-colors font-medium truncate max-w-[150px]"
                    >
                      {project.name}
                    </Link>
                  </>
                )}
              </div>
            </div>

            {/* Right Section - User Menu */}
            <div className="flex items-center space-x-3">
              {/* User Info */}
              <div className="hidden sm:flex items-center space-x-2 px-3 py-1.5 bg-gradient-to-r from-[#0066FF]/10 to-[#00B8D4]/10 rounded-lg">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-xs font-medium text-gray-700 truncate max-w-[150px]">
                  {user?.email}
                </span>
              </div>

              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-red-500 to-red-600 hover:shadow-lg hover:shadow-red-500/40 rounded-lg transition-all duration-300"
              >
                <span className="hidden sm:inline">Sign Out</span>
                <span className="sm:hidden">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                </span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Sidebar */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-40 bg-black/50 backdrop-blur-sm" onClick={() => setSidebarOpen(false)}>
          <div 
            className="fixed inset-y-0 left-0 w-64 bg-white shadow-xl p-6 animate-fadeIn"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-lg font-bold text-gray-900">Navigation</h2>
              <button
                onClick={() => setSidebarOpen(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <nav className="space-y-2">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${
                    item.active
                      ? 'bg-gradient-to-r from-[#0066FF] to-[#00B8D4] text-white shadow-lg'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <span className="text-xl">{item.icon}</span>
                  <span className="font-medium">{item.name}</span>
                </Link>
              ))}
            </nav>
          </div>
        </div>
      )}

      {/* Desktop Secondary Navigation */}
      {navItems.length > 1 && (
        <div className="hidden lg:block bg-white border-b border-gray-200 sticky top-16 z-40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <nav className="flex space-x-1 py-3">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all font-medium text-sm ${
                    item.active
                      ? 'bg-gradient-to-r from-[#0066FF] to-[#00B8D4] text-white shadow-md'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <span>{item.icon}</span>
                  <span>{item.name}</span>
                </Link>
              ))}
            </nav>
          </div>
        </div>
      )}
    </>
  );
}

'use client';

import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { LayoutDashboard, FileText, Briefcase, FolderOpen, LogOut } from 'lucide-react';

export function DashboardNav() {
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login');
    router.refresh();
  };

  const navItems = [
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/dashboard/projects', label: 'Projects', icon: FolderOpen },
    { href: '/dashboard/blogs', label: 'Blogs', icon: FileText },
    { href: '/dashboard/experiences', label: 'Experiences', icon: Briefcase },
  ];

  return (
    <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
      <div className="px-8 py-4">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">Portfolio Admin</h1>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md text-sm transition-colors"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </div>
        
        <nav className="flex gap-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}

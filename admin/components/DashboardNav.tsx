'use client';

import { useRouter } from 'next/navigation';

interface DashboardNavProps {
  username: string;
}

export default function DashboardNav({ username }: DashboardNavProps) {
  const router = useRouter();

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login');
    router.refresh();
  };

  return (
    <header className="bg-gray-800 border-b border-gray-700">
      <div className="px-8 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-white">Portfolio Admin</h1>
        <div className="flex items-center gap-4">
          <span className="text-gray-300">Welcome, {username}</span>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md text-sm"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}

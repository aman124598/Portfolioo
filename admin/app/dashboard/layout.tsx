import { redirect } from 'next/navigation';
import { getAuthUser } from '@/lib/auth';
import DashboardNav from '@/components/DashboardNav';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getAuthUser();

  if (!user) {
    redirect('/login');
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <DashboardNav username={user.username} />
      <div className="flex">
        <aside className="w-64 min-h-screen bg-gray-800 border-r border-gray-700">
          <nav className="p-4 space-y-2">
            <a
              href="/dashboard"
              className="block px-4 py-2 text-gray-300 hover:bg-gray-700 rounded-md"
            >
              Dashboard
            </a>
            <a
              href="/dashboard/projects"
              className="block px-4 py-2 text-gray-300 hover:bg-gray-700 rounded-md"
            >
              Projects
            </a>
            <a
              href="/dashboard/blogs"
              className="block px-4 py-2 text-gray-300 hover:bg-gray-700 rounded-md"
            >
              Blog Posts
            </a>
          </nav>
        </aside>
        <main className="flex-1 p-8">
          {children}
        </main>
      </div>
    </div>
  );
}

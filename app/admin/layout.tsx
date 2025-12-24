import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Portfolio Admin Panel",
  description: "Manage your portfolio projects and blog posts",
};

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {children}
    </div>
  );
}


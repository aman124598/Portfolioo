import { redirect } from 'next/navigation';
import { getAuthUser } from '@/lib/auth';

export default async function AdminHome() {
  const user = await getAuthUser();
  
  if (!user) {
    redirect('/login');
  }
  
  redirect('/admin/dashboard');
}


'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

interface DeleteButtonProps {
  id: string;
  type: 'project' | 'blog';
  itemName: string;
}

export default function DeleteButton({ id, type, itemName }: DeleteButtonProps) {
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    if (!confirm(`Are you sure you want to delete "${itemName}"?`)) {
      return;
    }

    setDeleting(true);
    try {
      const res = await fetch(`/api/${type === 'project' ? 'projects' : 'blogs'}/${id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        router.refresh();
      } else {
        alert(`Failed to delete ${type}`);
        setDeleting(false);
      }
    } catch (error) {
      alert('An error occurred');
      setDeleting(false);
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={deleting}
      className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-sm disabled:opacity-50"
    >
      {deleting ? 'Deleting...' : 'Delete'}
    </button>
  );
}

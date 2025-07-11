'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useQuery, QueryClient, QueryClientProvider } from '@tanstack/react-query';

type BookmarkForm = {
  url: string;
  title: string;
  description?: string;
  tags: string;
};

function BookmarkFormContent() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const { data, isLoading, error } = useQuery({
    queryKey: ['bookmark', id],
    queryFn: () => fetchBookmark(id),
  });

  const [form, setForm] = useState<BookmarkForm>({
    url: '',
    title: '',
    description: '',
    tags: '',
  });

  if (data && !form.title && !isLoading) {
    setForm({
      url: data.url,
      title: data.title,
      description: data.description || '',
      tags: data.tags.join(', '),
    });
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    const tagsArray = form.tags.split(',').map(t => t.trim()).filter(Boolean);

    const res = await fetch(`/api/bookmarks/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: form.title,
        description: form.description,
        tags: tagsArray,
      }),
    });

    if (res.ok) {
      router.push('/bookmarks');
    } else {
      alert('Update failed');
    }
  };

  const handleDelete = async () => {
    const ok = confirm('Are you sure you want to delete this bookmark?');
    if (!ok) return;

    const res = await fetch(`/api/bookmarks/${id}`, { method: 'DELETE' });

    if (res.ok) {
      router.push('/bookmarks');
    } else {
      alert('Delete failed');
    }
  };

  if (isLoading) {
    return (
      <main className="p-6 max-w-xl text-2xl mx-auto text-center">
        <p className="text-gray-500 animate-pulse">Loading bookmark...</p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="p-6 max-w-xl text-2xl mx-auto text-center text-red-500">
        Failed to load bookmark.
      </main>
    );
  }

  return (
    <main className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Edit Bookmark</h1>
      <form onSubmit={handleUpdate} className="space-y-4">
        <input
          name="url"
          value={form.url}
          disabled
          className="w-full border p-2 rounded bg-gray-100"
        />
        <input
          name="title"
          value={form.title}
          className="w-full border p-2 rounded"
          onChange={handleChange}
          required
        />
        <textarea
          name="description"
          value={form.description}
          className="w-full border p-2 rounded"
          onChange={handleChange}
        />
        <input
          name="tags"
          value={form.tags}
          className="w-full border p-2 rounded"
          onChange={handleChange}
        />
        <div className="flex gap-4">
          <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">
            Update
          </button>
          <button
            type="button"
            onClick={handleDelete}
            className="bg-red-600 text-white px-4 py-2 rounded"
          >
            Delete
          </button>
        </div>
      </form>
    </main>
  );
}

export default function EditBookmarkClient() {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <BookmarkFormContent />
    </QueryClientProvider>
  );
}

async function fetchBookmark(id: string): Promise<{
  url: string;
  title: string;
  description?: string;
  tags: string[];
}> {
  const res = await fetch(`/api/bookmarks/${id}`);
  if (!res.ok) throw new Error('Failed to fetch bookmark');
  return res.json();
}

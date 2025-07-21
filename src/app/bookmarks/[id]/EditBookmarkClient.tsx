'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  useQuery,
  useMutation,
  useQueryClient,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';

type BookmarkForm = {
  url: string;
  title: string;
  description?: string;
  tags: string;
};

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

async function updateBookmark(id: string, payload: { title: string; description: string; tags: string[] }) {
  const res = await fetch(`/api/bookmarks/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error('Failed to update bookmark');
}

async function deleteBookmark(id: string) {
  const res = await fetch(`/api/bookmarks/${id}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('Failed to delete bookmark');
}

function BookmarkFormContent() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const queryClient = useQueryClient();

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

  useEffect(() => {
    if (data) {
      setForm({
        url: data.url,
        title: data.title,
        description: data.description || '',
        tags: data.tags.join(', '),
      });
    }
  }, [data]);

  const updateMutation = useMutation({
    mutationFn: (updated: { title: string; description: string; tags: string[] }) =>
      updateBookmark(id, updated),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookmarks'] });
      router.push('/bookmarks');
    },
    onError: () => {
      alert('Update failed');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: () => deleteBookmark(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookmarks'] });
      router.push('/bookmarks');
    },
    onError: () => {
      alert('Delete failed');
    },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    const tagsArray = form.tags.split(',').map(t => t.trim()).filter(Boolean);
    updateMutation.mutate({
      title: form.title,
      description: form.description || '',
      tags: tagsArray,
    });
  };

  const handleDelete = () => {
    const ok = confirm('Are you sure you want to delete this bookmark?');
    if (!ok) return;
    deleteMutation.mutate();
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
          <button
            type="submit"
            disabled={updateMutation.isPending}
            className="bg-green-600 text-white px-4 py-2 rounded cursor-pointer"
          >
            {updateMutation.isPending ? 'Updating...' : 'Update'}
          </button>
          <button
            type="button"
            onClick={handleDelete}
            disabled={deleteMutation.isPending}
            className="bg-red-600 text-white px-4 py-2 rounded cursor-pointer"
          >
            {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
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

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  useMutation,
  useQueryClient,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';

type BookmarkInput = {
  url: string;
  title: string;
  description?: string;
  tags: string[];
};

async function createBookmark(input: BookmarkInput) {
  const res = await fetch('/api/bookmarks', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });

  if (!res.ok) throw new Error('Failed to create bookmark');
}

function NewBookmarkForm() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const [form, setForm] = useState({
    url: '',
    title: '',
    description: '',
    tags: '',
  });

  const { mutate, isPending } = useMutation({
    mutationFn: createBookmark,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookmarks'] });
      router.push('/bookmarks');
    },
    onError: () => {
      alert('Failed to create bookmark');
    },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const tagsArray = form.tags
      .split(',')
      .map(tag => tag.trim())
      .filter(Boolean);

    mutate({
      url: form.url,
      title: form.title,
      description: form.description,
      tags: tagsArray,
    });
  };

  return (
    <main className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Add New Bookmark</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="url"
          placeholder="URL"
          className="w-full border p-2 rounded"
          onChange={handleChange}
          required
        />
        <input
          name="title"
          placeholder="Title"
          className="w-full border p-2 rounded"
          onChange={handleChange}
          required
        />
        <textarea
          name="description"
          placeholder="Description"
          className="w-full border p-2 rounded"
          onChange={handleChange}
        />
        <input
          name="tags"
          placeholder="Tags (comma-separated)"
          className="w-full border p-2 rounded"
          onChange={handleChange}
        />
        <button
          type="submit"
          disabled={isPending}
          className="bg-blue-600 text-white px-4 py-2 rounded cursor-pointer"
        >
          {isPending ? 'Creating...' : 'Create'}
        </button>
      </form>
    </main>
  );
}

export default function NewBookmarkClient() {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <NewBookmarkForm />
    </QueryClientProvider>
  );
}

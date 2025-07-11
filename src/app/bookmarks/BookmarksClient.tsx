'use client';

import { useState } from 'react';
import { useQuery, QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Bookmark } from '@/domain/bookmark/bookmark.entity';


function BookmarksContent() {
  const { data: bookmarks = [], isLoading, error } = useQuery({
    queryKey: ['bookmarks'],
    queryFn: getBookmarks,
  });

  if (isLoading) {
    return (
      <div className="mt-6 text-center text-2xl text-gray-500 animate-pulse">
        Loading bookmarks...
      </div>
    );
  }

  if (error) {
    return (
      <div className="mt-6 text-center text-2xl text-red-500">
        Error loading bookmarks
      </div>
    );
  }

  return (
    <ul className="grid xl:grid-cols-4 sm:grid-cols-2 gap-4 mt-4 space-y-4">
      {bookmarks.map(bookmark => (
        <li key={bookmark.id} className="relative flex flex-col p-4 border rounded shadow h-full">
          <a
            href={bookmark.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-lg font-semibold underline w-fit max-w-[90%]"
          >
            <p className="truncate">{bookmark.title}</p>
          </a>
          <p className="text-ellipsis line-clamp-2">{bookmark.description}</p>
          <div className="text-sm text-gray-500">Tags: {bookmark.tags.join(', ')}</div>
          <Button className="absolute top-2 right-2 aspect-square p-2">
            <Link href={`/bookmarks/${bookmark.id}`} className="flex items-center justify-center">
              <img src="/icons/edit.png" alt="edit-icon" className="h-4 object-contain invert" />
            </Link>
          </Button>
        </li>
      ))}
    </ul>
  );
}

export default function BookmarksClient() {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <BookmarksContent />
    </QueryClientProvider>
  );
}

export async function getBookmarks(): Promise<Bookmark[]> {
  const res = await fetch('/api/bookmarks');
  if (!res.ok) throw new Error('Failed to fetch bookmarks');
  return res.json();
}

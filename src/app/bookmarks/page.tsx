"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

type Bookmark = {
  id: string;
  url: string;
  title: string;
  description?: string;
  tags: string[];
  createdAt: string;
};

export default function BookmarksPage() {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/bookmarks")
      .then(res => res.json())
      .then(data => {
        setBookmarks(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to load bookmarks", err);
        setLoading(false);
      });
  }, []);

  return (
    <main className="p-6">
      <div className="flex items-center justify-start gap-4 mb-6">
        <h1 className="text-2xl font-bold font-jl">Bookmarks</h1>
        <Button className="flex items-center justify-center aspect-square p-2">
          <Link href="/bookmarks/new" className="flex items-start"><p className="text-2xl">+</p></Link>
        </Button>
      </div>
      

      {loading ? (
        <div className="mt-6 text-center text-2xl text-gray-500 animate-pulse">Loading bookmarks...</div>
      ) : (
        <ul className="grid xl:grid-cols-4 md:grid-cols-2 gap-4 mt-4 space-y-4">
          {bookmarks.map(bookmark => (
            <li key={bookmark.id} className="relative flex flex-col p-4 border rounded shadow h-full">
              <a href={bookmark.url} target="_blank" rel="noopener noreferrer" className="text-lg font-semibold underline w-fit max-w-[90%]">
                <p className="truncate">{bookmark.title}</p>
              </a>
              <p className="text-ellipsis line-clamp-2">{bookmark.description}</p>
              <div className="text-sm text-gray-500">Tags: {bookmark.tags.join(", ")}</div>
              <Button className="absolute top-2 right-2 aspect-square p-2">
                <Link href={`/bookmarks/${bookmark.id}`} className="flex items-center justify-center">
                  <img src="/icons/edit.png" alt="edit-icon" className="h-4 object-contain invert"/>
                </Link>
              </Button>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}

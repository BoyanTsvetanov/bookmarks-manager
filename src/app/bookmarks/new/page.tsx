// app/bookmarks/new/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function NewBookmarkPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    url: "",
    title: "",
    description: "",
    tags: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const tagsArray = form.tags
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean);

    const res = await fetch("/api/bookmarks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        url: form.url,
        title: form.title,
        description: form.description,
        tags: tagsArray,
      }),
    });

    if (res.ok) {
      router.push("/bookmarks");
    } else {
      alert("Failed to create bookmark");
    }
  };

  return (
    <main className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Add New Bookmark</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input name="url" placeholder="URL" className="w-full border p-2 rounded" onChange={handleChange} required />
        <input name="title" placeholder="Title" className="w-full border p-2 rounded" onChange={handleChange} required />
        <textarea name="description" placeholder="Description" className="w-full border p-2 rounded" onChange={handleChange} />
        <input name="tags" placeholder="Tags (comma-separated)" className="w-full border p-2 rounded" onChange={handleChange} />
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Create</button>
      </form>
    </main>
  );
}

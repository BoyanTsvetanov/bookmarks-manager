// app/bookmarks/[id]/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

export default function EditBookmarkPage() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();

  const [form, setForm] = useState({
    url: "",
    title: "",
    description: "",
    tags: "",
  });

  useEffect(() => {
    fetch(`/api/bookmarks/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setForm({
          url: data.url,
          title: data.title,
          description: data.description || "",
          tags: data.tags.join(", "),
        });
      });
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    const tagsArray = form.tags.split(",").map((t) => t.trim()).filter(Boolean);

    const res = await fetch(`/api/bookmarks/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: form.title,
        description: form.description,
        tags: tagsArray,
      }),
    });

    if (res.ok) {
      router.push("/bookmarks");
    } else {
      alert("Update failed");
    }
  };

  const handleDelete = async () => {
    const ok = confirm("Are you sure you want to delete this bookmark?");
    if (!ok) return;

    const res = await fetch(`/api/bookmarks/${id}`, { method: "DELETE" });

    if (res.ok) {
      router.push("/bookmarks");
    } else {
      alert("Delete failed");
    }
  };

  return (
    <main className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Edit Bookmark</h1>
      <form onSubmit={handleUpdate} className="space-y-4">
        <input name="url" value={form.url} disabled className="w-full border p-2 rounded bg-gray-100" />
        <input name="title" value={form.title} className="w-full border p-2 rounded" onChange={handleChange} required />
        <textarea name="description" value={form.description} className="w-full border p-2 rounded" onChange={handleChange} />
        <input name="tags" value={form.tags} className="w-full border p-2 rounded" onChange={handleChange} />
        <div className="flex gap-4">
          <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">Update</button>
          <button type="button" onClick={handleDelete} className="bg-red-600 text-white px-4 py-2 rounded">Delete</button>
        </div>
      </form>
    </main>
  );
}

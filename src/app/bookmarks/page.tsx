import Link from "next/link";
import { Button } from "@/components/ui/button";
import BookmarksClient from "./BookmarksClient";

export default function BookmarksPage() {

  return (
    <main className="p-6">
      <div className="flex items-center justify-start gap-4 mb-6">
        <h1 className="text-2xl font-bold font-jl">Bookmarks</h1>
        <Button className="flex items-center justify-center aspect-square p-2">
          <Link href="/bookmarks/new" className="flex items-start"><p className="text-2xl">+</p></Link>
        </Button>
      </div>
      
      <BookmarksClient />
    </main>
  );
}

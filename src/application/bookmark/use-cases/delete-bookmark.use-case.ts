
import { BookmarkRepository } from "@/domain/bookmark/bookmark.repository";

export class DeleteBookmarkUseCase {
  constructor(private repo: BookmarkRepository) {}

  async execute(id: string): Promise<void> {
    const found = await this.repo.findById(id);
    if (!found) throw new Error("Bookmark not found");
    await this.repo.delete(id);
  }
}

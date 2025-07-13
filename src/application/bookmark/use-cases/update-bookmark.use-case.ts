import { BookmarkRepository } from "@/domain/bookmark/bookmark.repository";
import { Bookmark } from "@/domain/bookmark/bookmark.entity";

export type UpdateBookmarkInput = {
  id: string;
  title?: string;
  url?: string;
  description?: string;
  tags?: string[];
};

export class UpdateBookmarkUseCase {
  constructor(private repo: BookmarkRepository) {}

  async execute(input: UpdateBookmarkInput): Promise<Bookmark> {
    const existing = await this.repo.findById(input.id);
    if (!existing) throw new Error("Bookmark not found");

    const updated = new Bookmark({
      id: existing.id,
      title: input.title ?? existing.title,
      url: input.url ?? existing.url,
      description: input.description ?? existing.description,
      tags: input.tags ?? existing.tags,
      createdAt: existing.createdAt,
      userId: existing.userId,
    });

    return await this.repo.update(input.id, {
      title: updated.title,
      url: updated.url,
      description: updated.description,
      tags: updated.tags,
    });
  }
}

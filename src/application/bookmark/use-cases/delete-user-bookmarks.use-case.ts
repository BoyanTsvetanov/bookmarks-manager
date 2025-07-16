import { BookmarkRepository } from "@/domain/bookmark/bookmark.repository";

export class DeleteBookmarksByUser{
  constructor(private repo: BookmarkRepository) {}

  async execute(input: { userId: string }) {
    await this.repo.deleteAllByUserId(input.userId);
  }
}

import { Bookmark } from "@/domain/bookmark/bookmark.entity";
import {
  BookmarkRepository,
  CreateBookmarkInput,
} from "@/domain/bookmark/bookmark.repository";
import { randomUUID } from "crypto";

export class CreateBookmarkUseCase {
  constructor(private readonly bookmarkRepo: BookmarkRepository) {}

  async execute(input: CreateBookmarkInput): Promise<Bookmark> {
    const bookmark = new Bookmark({
      id: randomUUID(),
      url: input.url,
      title: input.title,
      description: input.description,
      tags: input.tags,
      createdAt: new Date(),
      userId: input.userId,
    });

    return this.bookmarkRepo.create(bookmark.toJSON());
  }
}

import { Bookmark } from "./bookmark.entity";

export interface CreateBookmarkInput {
  url: string;
  title: string;
  description?: string;
  tags: string[];
}

export interface BookmarkRepository {
  create(input: CreateBookmarkInput): Promise<Bookmark>;
  findAll(): Promise<Bookmark[]>;
  update(id: string, data: Partial<CreateBookmarkInput>): Promise<Bookmark>;
  delete(id: string): Promise<void>;
}

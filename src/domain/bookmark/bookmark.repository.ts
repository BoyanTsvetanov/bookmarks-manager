import { Bookmark } from "./bookmark.entity";

export interface CreateBookmarkInput {
  url: string;
  title: string;
  description?: string;
  tags: string[];
  userId: string;
}

export interface BookmarkRepository {
  create(input: CreateBookmarkInput): Promise<Bookmark>;
  findAll(): Promise<Bookmark[]>;
  findById(id: string): Promise<Bookmark | null>;
  update(id: string, data: Partial<CreateBookmarkInput>): Promise<Bookmark>;
  delete(id: string): Promise<void>;
}

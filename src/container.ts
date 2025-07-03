import { DrizzleBookmarkRepository } from "@/infrastructure/repositories/drizzle-bookmark.repository";
import { CreateBookmarkUseCase } from "@/application/bookmark/use-cases/create-bookmark.use-case";

const bookmarkRepository = new DrizzleBookmarkRepository();
const createBookmarkUseCase = new CreateBookmarkUseCase(bookmarkRepository);

export const container = {
    bookmarkRepository,
    createBookmarkUseCase,
};

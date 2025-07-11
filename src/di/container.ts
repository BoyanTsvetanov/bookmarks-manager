import { createContainer } from '@evyweb/ioctopus';
import { TOKENS } from './tokens';

import { DrizzleBookmarkRepository } from '@/infrastructure/repositories/drizzle-bookmark.repository';
import { CreateBookmarkUseCase } from '@/application/bookmark/use-cases/create-bookmark.use-case';

const container = createContainer();

container.bind(TOKENS.bookmarkRepo).toClass(DrizzleBookmarkRepository);

container.bind(TOKENS.createBookmark).toClass(CreateBookmarkUseCase, [TOKENS.bookmarkRepo]);

export { container };

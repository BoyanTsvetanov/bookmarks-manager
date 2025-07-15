import { User } from "@/domain/user/user.entity";
import { UserRepository } from "@/domain/user/user.repository";
import { randomUUID } from "crypto";

export interface CreateUserInput {
  username: string;
  email: string;
  role?: string;
}

export class CreateUserUseCase {
  constructor(private readonly userRepo: UserRepository) {}

  async execute(input: CreateUserInput): Promise<User> {
    const now = new Date();

    const user = new User({
      id: randomUUID(),
      username: input.username,
      email: input.email,
      role: input.role ?? "user",
      createdAt: now,
      updatedAt: now,
    });

    return this.userRepo.create(user.toJSON());
  }
}

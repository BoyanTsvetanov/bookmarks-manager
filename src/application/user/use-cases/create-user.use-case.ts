import { User } from "@/domain/user/user.entity";
import { UserRepository } from "@/domain/user/user.repository";

export interface CreateUserInput {
  id?: string; // accept Clerk ID here
  username: string;
  email: string;
  role: string;
}

export class CreateUserUseCase {
  constructor(private readonly userRepo: UserRepository) {}

  async execute(input: CreateUserInput): Promise<User> {
    return this.userRepo.create(input);
  }
}

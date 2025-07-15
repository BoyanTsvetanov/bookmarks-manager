import { UserRepository } from "@/domain/user/user.repository";
import { User } from "@/domain/user/user.entity";

export class ListUsersUseCase {
  constructor(private readonly userRepo: UserRepository) {}

  async execute(): Promise<User[]> {
    return this.userRepo.findAll();
  }
}

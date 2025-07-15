import { UserRepository } from "@/domain/user/user.repository";
import { User } from "@/domain/user/user.entity";

export class UpdateUserUseCase {
  constructor(private readonly userRepo: UserRepository) {}

  async execute(
    id: string,
    data: Partial<{ username: string; email: string }>
  ): Promise<User> {
    return this.userRepo.update(id, data);
  }
}

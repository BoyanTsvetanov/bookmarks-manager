import { UserRepository } from "@/domain/user/user.repository";
import { User } from "@/domain/user/user.entity";

export class GetUserUseCase {
  constructor(private readonly userRepo: UserRepository) {}

  async execute(id: string): Promise<User | null> {
    return this.userRepo.findById(id);
  }
}

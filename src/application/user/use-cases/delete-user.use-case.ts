import { UserRepository } from "@/domain/user/user.repository";

export class DeleteUserUseCase {
  constructor(private readonly userRepo: UserRepository) {}

  async execute(id: string): Promise<void> {
    return this.userRepo.delete(id);
  }
}

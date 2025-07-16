import { User } from "./user.entity";

export interface UserRepository {
  create(input: {
    id?: string; // accept optional id from Clerk
    username: string;
    email: string;
    role: string;
  }): Promise<User>;

  findAll(): Promise<User[]>;

  findById(id: string): Promise<User | null>;

  update(id: string, data: Partial<{ username: string; email: string; role: string }>): Promise<User>;

  delete(id: string): Promise<void>;
}

import { IDatabaseConnection } from "../interfaces/library.interfaces";
import { User } from "../models/library.models";

export class UserManager {
  private users: User[] = [];

  constructor(private db: IDatabaseConnection) {}

  public async addUser(user: User): Promise<void> {
    await this.db.execute(
      "INSERT INTO users (name, email, phone) VALUES (?, ?, ?)",
      [user.name, user.email, user.phone]
    );
    this.users.push(user);
  }

  // Outros métodos relacionados a usuários...
}

import { IDatabaseConnection } from "../interfaces/library.interfaces.js";
import { User } from "../models/library.models.js";

export class UserManager {
  private users: User[] = [];

  constructor(private db: IDatabaseConnection) {}
  //Adiciona um novo usuário ao banco de dados.
  //Executa uma query SQL para inserir o usuário no banco de dados.
  //Retorna o usuário com o ID gerado pelo banco.

  public async addUser(user: User): Promise<User> {
    try {
      const result = await this.db.execute(
        "INSERT INTO users (name, email, phone) VALUES (?, ?, ?)",
        [user.name, user.email, user.phone]
      );
      
      // Retorna o usuário com o ID gerado
      return new User(
        result.insertId,
        user.name,
        user.email,
        user.phone
      );
    } catch (error) {
      throw new Error("Falha ao adicionar usuário: " + (error as Error).message);
    }
  } 

    //Retorna o usuário com o ID gerado pelo banco.
    //Executa uma query SQL para buscar o usuário no banco de dados.
  public async findUserByEmail(email: string): Promise<User | null> {
    const users = await this.db.query<User>("SELECT * FROM users WHERE email = ?", [email]);
    return users.length > 0 ? users[0] : null;
  }
  

  
}

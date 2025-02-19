import { User } from "../models/library.models.js";
export class UserManager {
    constructor(db) {
        this.db = db;
        this.users = [];
    }
    async addUser(user) {
        try {
            const result = await this.db.execute("INSERT INTO users (name, email, phone) VALUES (?, ?, ?)", [user.name, user.email, user.phone]);
            // Retorna o usuário com o ID gerado
            return new User(result.insertId, user.name, user.email, user.phone);
        }
        catch (error) {
            throw new Error("Falha ao adicionar usuário: " + error.message);
        }
    }
    async findUserByEmail(email) {
        const users = await this.db.query("SELECT * FROM users WHERE email = ?", [email]);
        return users.length > 0 ? users[0] : null;
    }
}

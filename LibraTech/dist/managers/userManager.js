"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserManager = void 0;
class UserManager {
    constructor(db) {
        this.db = db;
        this.users = [];
    }
    async addUser(user) {
        await this.db.execute("INSERT INTO users (name, email, phone) VALUES (?, ?, ?)", [user.name, user.email, user.phone]);
        this.users.push(user);
    }
}
exports.UserManager = UserManager;

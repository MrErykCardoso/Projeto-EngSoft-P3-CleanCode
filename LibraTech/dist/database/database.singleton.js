import * as mysql from "mysql2/promise";
export class Database {
    constructor() {
        this.connection = mysql.createPool({
            multipleStatements: true,
            host: "localhost",
            user: "root",
            password: "root123",
            database: "libra_tech",
            port: 3307,
        });
        console.log("✅ Conexão com o banco inicializada. ✅");
    }
    static getInstance() {
        if (!Database.instance) {
            Database.instance = new Database();
        }
        return Database.instance;
    }
    async query(sql, params) {
        console.log(`Executanto o comando (query function): ${sql} com params: ${params};`);
        const pool = this.connection;
        const result = await pool.query(sql, params);
        const [rows] = result;
        return rows;
    }
    async execute(sql, params) {
        console.log(`Executando comando (execute function): ${sql} com params: ${params};`);
        const pool = this.connection;
        const [result] = await pool.execute(sql, params);
        return result;
    }
    async disconnect() {
        await this.connection.end();
        console.log("🔌 Conexão com o banco encerrada.");
    }
}

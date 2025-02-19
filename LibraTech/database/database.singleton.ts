import { IDatabaseConnection } from "../interfaces/library.interfaces.js";
import * as mysql from "mysql2/promise";

export class Database implements IDatabaseConnection {
  private static instance: Database;
  private connection: mysql.Pool;

  private constructor() {
    this.connection = mysql.createPool({
      multipleStatements: true,
      host: "localhost",
      user: "root",
      password: "root123",
      database: "libra_tech",
      port: 3307,
    });
    console.log("Conexão com o banco inicializada.");
  }

  public static getInstance(): Database {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }

  public async query<T>(sql: string, params?: any[]): Promise<T[]> {
    console.log(
      `Executanto o comando (query function): ${sql} com params: ${params};`
    );
    const pool = this.connection as any;
    const result = await pool.query(sql, params);
    const [rows] = result as [T[]];
    return rows;
  }

  public async execute(sql: string, params: any[]): Promise<any> {
    console.log(
      `Executando comando (execute function): ${sql} com params: ${params};`
    );
    const pool = this.connection as any;
    const [result] = await pool.execute(sql, params);
    return result;
  }
  public async disconnect(): Promise<void> {
    await this.connection.end();
    console.log("🔌 Conexão com o banco encerrada.");
  }
  
}

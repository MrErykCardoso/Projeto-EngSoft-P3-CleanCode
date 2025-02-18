"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.Database = void 0;
const mysql = __importStar(require("mysql2/promise"));
class Database {
    constructor() {
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
}
exports.Database = Database;

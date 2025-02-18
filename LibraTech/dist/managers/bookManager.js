"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookManager = void 0;
class BookManager {
    constructor(db) {
        this.db = db;
        this.books = [];
        // Opcional: Carregar os livros do banco de dados
    }
    // Adiciona um livro e armazena no banco (SRP: só lida com livros)
    async addBook(book) {
        await this.db.execute("INSERT INTO books (title, author, isbn, category) VALUES (?, ?, ?, ?)", [book.title, book.author, book.isbn, book.category]);
        this.books.push(book);
    }
    // Pesquisa livros usando uma estratégia injetada (Strategy Pattern)
    searchBooks(term, strategy) {
        return strategy.search(this.books, term);
    }
}
exports.BookManager = BookManager;

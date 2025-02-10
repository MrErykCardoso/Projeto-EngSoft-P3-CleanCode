import {
  IDatabaseConnection,
  IBookSearchStrategy,
} from "../interfaces/library.interfaces";
import { Book } from "../models/library.models";

export class BookManager {
  private books: Book[] = [];

  constructor(private db: IDatabaseConnection) {
    // Opcional: Carregar os livros do banco de dados
  }

  // Adiciona um livro e armazena no banco (SRP: só lida com livros)
  public async addBook(book: Book): Promise<void> {
    await this.db.execute(
      "INSERT INTO books (title, author, isbn, category) VALUES (?, ?, ?, ?)",
      [book.title, book.author, book.isbn, book.category]
    );
    this.books.push(book);
  }

  // Pesquisa livros usando uma estratégia injetada (Strategy Pattern)
  public searchBooks(term: string, strategy: IBookSearchStrategy): Book[] {
    return strategy.search(this.books, term);
  }
}

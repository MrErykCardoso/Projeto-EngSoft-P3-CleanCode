import {
  IDatabaseConnection,
  IBookSearchStrategy,
} from "../interfaces/library.interfaces.js";
import { Book } from "../models/library.models.js";

export class BookManager {
  constructor(private db: IDatabaseConnection) {}

  
  // "Métodos de CRUD"
  
  public async addBook(book: Book): Promise<void> {
    try {
      // Normalização e validação
      const normalizedISBN = this.normalizeISBN(book.isbn);
      this.validateISBN(normalizedISBN);

      await this.db.execute(
        "INSERT INTO books (title, author, isbn, category) VALUES (?, ?, ?, ?)",
        [
          book.title.trim(),
          book.author.trim(),
          normalizedISBN, // Usa o ISBN normalizado
          book.category.trim()
        ]
      );
    } catch (error) {
      throw new Error(`Falha ao adicionar livro: ${(error as Error).message}`);
    }
  }

  
  // Métodos de Busca 


  //Função: Busca livros com base em um termo e uma estratégia de busca (título, autor ou categoria).
  //Carrega todos os livros do banco de dados.
  //Aplica a estratégia de busca (strategy.search) para filtrar os livros.

  public async searchBooks(term: string, strategy: IBookSearchStrategy): Promise<Book[]> {
    const allBooks = await this.loadAllBooks();
    return strategy.search(allBooks, term);
  }
  //Função: Busca um livro pelo título exato.
  //Normaliza o título (remove espaços e converte para minúsculas).
  //Executa uma query SQL para buscar o livro no banco de dados.

  public async findBookByTitle(title: string): Promise<Book | null> {
    const normalizedTitle = title.trim().toLowerCase();
    const books = await this.db.query<Book>(
      "SELECT * FROM books WHERE LOWER(title) = ?",
      [normalizedTitle]
    );
    return books[0] || null;
  }


  // Métodos Auxiliares (com novas funcionalidades)

 //Normaliza o ISBN (remove hífens e espaços).
  private normalizeISBN(isbn: string): string {
    return isbn.replace(/[-\s]/g, "").trim(); // Remove hífens e espaços
  }
  //Valida o ISBN (verifica se tem 10 ou 13 caracteres).
  private validateISBN(isbn: string): void {
    if (![10, 13].includes(isbn.length)) {
      throw new Error(`ISBN inválido: ${isbn}`);
    }
  }

  private async loadAllBooks(): Promise<Book[]> {
    return this.db.query<Book>("SELECT * FROM books", []);
  }

  
  // Novas Funcionalidades  (opcional) podemos adiacionar ?
 
  public async findBookByISBN(isbn: string): Promise<Book | null> {
    const normalizedISBN = this.normalizeISBN(isbn);
    const books = await this.db.query<Book>(
      "SELECT * FROM books WHERE isbn = ?",
      [normalizedISBN]
    );
    return books[0] || null;
  }

  public async updateBook(bookId: number, updates: Partial<Book>): Promise<void> {
    // Implementação de atualização segura
    const allowedFields = ["title", "author", "category"];
    const validUpdates = Object.entries(updates)
      .filter(([key]) => allowedFields.includes(key))
      .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {});

    await this.db.execute(
      "UPDATE books SET ? WHERE id = ?",
      [validUpdates, bookId]
    );
  }
}
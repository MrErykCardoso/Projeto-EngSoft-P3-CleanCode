import {
  IBook,
  IUser,
  IReservation,
  IBookSearchStrategy,
} from "../interfaces/library.interfaces.js";

//------------------------------------------------------------------
// System Classes
export class Book implements IBook {
  constructor(
    public readonly id: number,
    public readonly title: string,
    public readonly author: string,
    public readonly isbn: string,
    public readonly category: string
  ) {
    // Remove hífens e espaços do isbn para não dar erro!
    this.isbn = isbn.replace(/[-\s]/g, "");
  }
}

export class User implements IUser {
  constructor(
    public readonly id: number,
    public readonly name: string,
    public readonly email: string,
    public readonly phone: string
  ) {}
}

export class Reservation implements IReservation {
  constructor(
    public readonly id: number,
    public readonly bookId: number,
    public readonly userId: number,
    public readonly reservationDate: Date
  ) {}
}

//------------------------------------------------------------------------------
// Strategy
abstract class BaseSearchStrategy implements IBookSearchStrategy {
  protected abstract getProperty(book: Book): string;

  // Método para normalizar o termo de busca
  private normalizeTerm(term: string): string {
    return term
      .trim() // Remove espaços em branco no início e no final
      .replace(/\s+/g, " ") // Substitui múltiplos espaços por um único espaço
      .toLowerCase(); // Converte para minúsculas
  }

  search(books: Book[], term: string): Book[] {
    const normalizedTerm = this.normalizeTerm(term);
    return books.filter((book) => {
      const propertyValue = this.getProperty(book);
      const normalizedProperty = this.normalizeTerm(propertyValue);
      return normalizedProperty.includes(normalizedTerm);
    });
  }
}

export class SearchByTitleStrategy extends BaseSearchStrategy {
  protected getProperty(book: Book): string {
    return book.title;
  }
}

export class SearchByAuthorStrategy extends BaseSearchStrategy {
  protected getProperty(book: Book): string {
    return book.author;
  }
}

export class SearchByCategoryStrategy extends BaseSearchStrategy {
  protected getProperty(book: Book): string {
    return book.category;
  }
}
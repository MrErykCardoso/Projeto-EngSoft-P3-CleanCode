import {
  IBook,
  IUser,
  IReservation,
  IBookSearchStrategy,
} from "../interfaces/library.interfaces";
//------------------------------------------------------------------
//System Classes
export class Book implements IBook {
  public id: number;
  public title: string;
  public author: string;
  public isbn: string;
  public category: string;

  constructor(
    id: number,
    title: string,
    author: string,
    isbn: string,
    category: string
  ) {
    this.id = id;
    this.title = title;
    this.author = author;
    this.isbn = isbn;
    this.category = category;
  }
}

export class User implements IUser {
  public id: number;
  public name: string;
  public email: string;
  public phone: string;

  constructor(id: number, name: string, email: string, phone: string) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.phone = phone;
  }
}

export class Reservation implements IReservation {
  public id: number;
  public bookId: number;
  public userId: number;
  public reservationDate: Date;

  constructor(
    id: number,
    bookId: number,
    userId: number,
    reservationDate: Date
  ) {
    this.id = id;
    this.bookId = bookId;
    this.userId = userId;
    this.reservationDate = reservationDate;
  }
}
//------------------------------------------------------------------------------
//Strategy
export class SearchByTitleStrategy implements IBookSearchStrategy {
  search(books: Book[], term: string): Book[] {
    return books.filter((book) =>
      book.title.toLowerCase().includes(term.toLowerCase())
    );
  }
}

export class SearByAuthorStrategy implements IBookSearchStrategy {
  search(books: Book[], term: string): Book[] {
    return books.filter((book) =>
      book.author.toLowerCase().includes(term.toLowerCase())
    );
  }
}

export class SearchByCategoryStrategy implements IBookSearchStrategy {
  search(books: Book[], term: string): Book[] {
    return books.filter((book) =>
      book.category.toLowerCase().includes(term.toLowerCase())
    );
  }
}

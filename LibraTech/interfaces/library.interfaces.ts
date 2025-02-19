import { Book } from "../models/library.models.js";

export interface IDatabaseConnection {
  query<T>(sql: string, params?: any[]): Promise<T[]>;
  execute(sql: string, params?: any[]): Promise<any>;
}

export interface IBookSearchStrategy {
  search(books: Book[], term: string): Book[];
}

export interface IObserver {
  update(data: any): void;
}

export interface ISubject {
  registerObserver(observer: IObserver): void;
  removeObserver(observer: IObserver): void;
  notifyObservers(observer: IObserver): void;
}

export interface IBook {
  id: number;
  title: string;
  author: string;
  isbn: string;
  category: string;
}

export interface IUser {
  id: number;
  name: string;
  email: string;
  phone: string;
}

export interface IReservation {
  id: number;
  bookId: number;
  userId: number;
  reservationDate: Date;
}

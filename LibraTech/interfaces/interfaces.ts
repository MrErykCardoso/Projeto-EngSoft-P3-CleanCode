export interface IDatabaseConnection {
  query<T>(sql: string, params?: any[]): Promise<T[]>;
  execute(sql: string, params?: any[]): Promise<any>;
}

export interface IBook {
  id: number;
  title: string;
  author: string;
  isnb: string;
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

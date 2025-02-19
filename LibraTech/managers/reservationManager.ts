import { IDatabaseConnection } from "../interfaces/library.interfaces.js";
import { Reservation } from "../models/library.models.js";
import { ISubject } from "../interfaces/library.interfaces.js";
import { IObserver } from "../interfaces/library.interfaces.js";

export class ReservationManager implements ISubject {
  private reservations: Reservation[] = [];
  private observers: IObserver[] = [];

  constructor(private db: IDatabaseConnection) {}

  // Cria uma nova reserva e notifica os observadores
  public async createReservation(reservation: Reservation): Promise<void> {
    await this.db.execute(
      "INSERT INTO reservations (bookId, userId, reservationDate) VALUES (?, ?, ?)",
      [reservation.bookId, reservation.userId, reservation.reservationDate]
    );
    this.reservations.push(reservation);
    this.notifyObservers(reservation);
  }
  public async listReservations(): Promise<Reservation[]> {
    return await this.db.query<Reservation>("SELECT * FROM reservations");
  }
  

  // Métodos do Observer:
  public registerObserver(observer: IObserver): void {
    this.observers.push(observer);
  }

  public removeObserver(observer: IObserver): void {
    this.observers = this.observers.filter((obs) => obs !== observer);
  }

  public notifyObservers(data: any): void {
    this.observers.forEach((observer) => observer.update(data));
  }
  
  
}

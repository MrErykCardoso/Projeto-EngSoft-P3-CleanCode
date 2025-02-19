import { 
  IDatabaseConnection,
  ISubject,
  IObserver,
  IReservationDetails 
} from "../interfaces/library.interfaces.js";
import { Reservation } from "../models/library.models.js";

export class ReservationManager implements ISubject {
  private observers: IObserver[] = [];

  constructor(private db: IDatabaseConnection) {}
    // ===============================================
  // Métodos de Reserva 
   // ===============================================

  public async createReservation(reservation: Reservation): Promise<void> {
    try {
      await this.db.execute(
        `INSERT INTO reservations (bookId, userId, reservationDate)
         VALUES (?, ?, ?)`,
        [reservation.bookId, reservation.userId, reservation.reservationDate]
      );
      this.notifyObservers(reservation);
    } catch (error) {
      throw new Error(`Erro ao criar reserva: ${(error as Error).message}`);
    }
  }

  public async listReservations(): Promise<IReservationDetails[]> {
    return this.db.query<IReservationDetails>(`
      SELECT 
        r.id,
        r.bookId,
        r.userId,
        r.reservationDate,
        u.name as userName,
        b.title as bookTitle
      FROM reservations r
      INNER JOIN users u ON r.userId = u.id
      INNER JOIN books b ON r.bookId = b.id
    `);
  }
    // ===============================================
  // Métodos do Observer 
   // ===============================================

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
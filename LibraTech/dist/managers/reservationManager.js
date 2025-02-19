export class ReservationManager {
    constructor(db) {
        this.db = db;
        this.observers = [];
    }
    // ===============================================
    // Métodos de Reserva 
    // ===============================================
    async createReservation(reservation) {
        try {
            await this.db.execute(`INSERT INTO reservations (bookId, userId, reservationDate)
         VALUES (?, ?, ?)`, [reservation.bookId, reservation.userId, reservation.reservationDate]);
            this.notifyObservers(reservation);
        }
        catch (error) {
            throw new Error(`Erro ao criar reserva: ${error.message}`);
        }
    }
    async listReservations() {
        return this.db.query(`
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
    registerObserver(observer) {
        this.observers.push(observer);
    }
    removeObserver(observer) {
        this.observers = this.observers.filter((obs) => obs !== observer);
    }
    notifyObservers(data) {
        this.observers.forEach((observer) => observer.update(data));
    }
}

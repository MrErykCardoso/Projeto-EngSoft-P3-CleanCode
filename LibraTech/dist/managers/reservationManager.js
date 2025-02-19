export class ReservationManager {
    constructor(db) {
        this.db = db;
        this.reservations = [];
        this.observers = [];
    }
    // Cria uma nova reserva e notifica os observadores
    async createReservation(reservation) {
        await this.db.execute("INSERT INTO reservations (bookId, userId, reservationDate) VALUES (?, ?, ?)", [reservation.bookId, reservation.userId, reservation.reservationDate]);
        this.reservations.push(reservation);
        this.notifyObservers(reservation);
    }
    async listReservations() {
        return await this.db.query("SELECT * FROM reservations");
    }
    // Métodos do Observer:
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

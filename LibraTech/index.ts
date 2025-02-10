import { Database } from "./database/database.singleton";
import { BookManager } from "./managers/bookManager";
import { UserManager } from "./managers/userManager";
import { ReservationManager } from "./managers/reservationManager";
import { SearchByTitleStrategy } from "./models/library.models";
import { Book } from "./models/library.models";

// Obter a instância única do Database (via Singleton)
const db = Database.getInstance();

// Injetar a dependência nos managers (aplicando DIP)
const bookManager = new BookManager(db);
const userManager = new UserManager(db);
const reservationManager = new ReservationManager(db);

// Exemplo de uso do BookManager com Strategy:
const newBook = new Book(
  1,
  "O Senhor dos Anéis",
  "J.R.R. Tolkien",
  "123456789",
  "Fantasia"
);
await bookManager.addBook(newBook);

const foundBooks = bookManager.searchBooks(
  "senhor",
  new SearchByTitleStrategy()
);
console.log("Livros encontrados:", foundBooks);

// Exemplo de Observer:
// Crie um observador para reservas
class ReservationLogger implements IObserver {
  update(data: any): void {
    console.log("Nova reserva criada:", data);
  }
}

const logger = new ReservationLogger();
reservationManager.registerObserver(logger);

// Quando uma nova reserva for criada, o logger será notificado:
import { Reservation } from "./models/Reservation";
const reservation = new Reservation(1, newBook.id, 1, new Date());
await reservationManager.createReservation(reservation);

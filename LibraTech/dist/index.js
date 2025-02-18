"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const database_singleton_1 = require("./database/database.singleton");
const bookManager_1 = require("./managers/bookManager");
const userManager_1 = require("./managers/userManager");
const reservationManager_1 = require("./managers/reservationManager");
const library_models_1 = require("./models/library.models");
const library_models_2 = require("./models/library.models");
//Instância Database
const db = database_singleton_1.Database.getInstance();
// Injetar a dependência nos managers (aplicando DIP)
const bookManager = new bookManager_1.BookManager(db);
const userManager = new userManager_1.UserManager(db);
const reservationManager = new reservationManager_1.ReservationManager(db);
// Exemplo de uso do BookManager com Strategy:
const newBook = new library_models_2.Book(1, "O Senhor dos Anéis", "J.R.R. Tolkien", "123456789", "Fantasia");
bookManager.addBook(newBook);
const foundBooks = bookManager.searchBooks("senhor", new library_models_1.SearchByTitleStrategy());
console.log("Livros encontrados:", foundBooks);
// Exemplo de Observer:
// Observador para reservas
class ReservationLogger {
    update(data) {
        console.log("Nova reserva criada:", data);
    }
}
const logger = new ReservationLogger();
reservationManager.registerObserver(logger);
//logger
const reservation = new library_models_1.Reservation(1, newBook.id, 1, new Date());
reservationManager.createReservation(reservation);

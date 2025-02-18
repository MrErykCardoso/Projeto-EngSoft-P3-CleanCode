"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SearchByCategoryStrategy = exports.SearByAuthorStrategy = exports.SearchByTitleStrategy = exports.Reservation = exports.User = exports.Book = void 0;
//------------------------------------------------------------------
//System Classes
class Book {
    constructor(id, title, author, isbn, category) {
        this.id = id;
        this.title = title;
        this.author = author;
        this.isbn = isbn;
        this.category = category;
    }
}
exports.Book = Book;
class User {
    constructor(id, name, email, phone) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.phone = phone;
    }
}
exports.User = User;
class Reservation {
    constructor(id, bookId, userId, reservationDate) {
        this.id = id;
        this.bookId = bookId;
        this.userId = userId;
        this.reservationDate = reservationDate;
    }
}
exports.Reservation = Reservation;
//------------------------------------------------------------------------------
//Strategy
class SearchByTitleStrategy {
    search(books, term) {
        return books.filter((book) => book.title.toLowerCase().includes(term.toLowerCase()));
    }
}
exports.SearchByTitleStrategy = SearchByTitleStrategy;
class SearByAuthorStrategy {
    search(books, term) {
        return books.filter((book) => book.author.toLowerCase().includes(term.toLowerCase()));
    }
}
exports.SearByAuthorStrategy = SearByAuthorStrategy;
class SearchByCategoryStrategy {
    search(books, term) {
        return books.filter((book) => book.category.toLowerCase().includes(term.toLowerCase()));
    }
}
exports.SearchByCategoryStrategy = SearchByCategoryStrategy;

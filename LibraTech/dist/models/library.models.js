//------------------------------------------------------------------
//System Classes
export class Book {
    constructor(id, title, author, isbn, category) {
        this.id = id;
        this.title = title;
        this.author = author;
        this.isbn = isbn;
        this.category = category;
    }
}
export class User {
    constructor(id, name, email, phone) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.phone = phone;
    }
}
export class Reservation {
    constructor(id, bookId, userId, reservationDate) {
        this.id = id;
        this.bookId = bookId;
        this.userId = userId;
        this.reservationDate = reservationDate;
    }
}
//------------------------------------------------------------------------------
//Strategy
export class SearchByTitleStrategy {
    search(books, term) {
        return books.filter((book) => book.title.toLowerCase().includes(term.toLowerCase()));
    }
}
export class SearchByAuthorStrategy {
    search(books, term) {
        return books.filter((book) => book.author.toLowerCase().includes(term.toLowerCase()));
    }
}
export class SearchByCategoryStrategy {
    search(books, term) {
        return books.filter((book) => book.category.toLowerCase().includes(term.toLowerCase()));
    }
}

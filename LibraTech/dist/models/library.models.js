//------------------------------------------------------------------
// System Classes
export class Book {
    constructor(id, title, author, isbn, category) {
        this.id = id;
        this.title = title;
        this.author = author;
        this.isbn = isbn;
        this.category = category;
        // Remove hífens e espaços do isbn para não dar erro!
        this.isbn = isbn.replace(/[-\s]/g, "");
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
// Strategy
class BaseSearchStrategy {
    // Método para normalizar o termo de busca
    normalizeTerm(term) {
        return term
            .trim() // Remove espaços em branco no início e no final
            .replace(/\s+/g, " ") // Substitui múltiplos espaços por um único espaço
            .toLowerCase(); // Converte para minúsculas
    }
    search(books, term) {
        const normalizedTerm = this.normalizeTerm(term);
        return books.filter((book) => {
            const propertyValue = this.getProperty(book);
            const normalizedProperty = this.normalizeTerm(propertyValue);
            return normalizedProperty.includes(normalizedTerm);
        });
    }
}
export class SearchByTitleStrategy extends BaseSearchStrategy {
    getProperty(book) {
        return book.title;
    }
}
export class SearchByAuthorStrategy extends BaseSearchStrategy {
    getProperty(book) {
        return book.author;
    }
}
export class SearchByCategoryStrategy extends BaseSearchStrategy {
    getProperty(book) {
        return book.category;
    }
}

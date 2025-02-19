export class BookManager {
    constructor(db) {
        this.db = db;
    }
    // ===============================================
    // Métodos de CRUD
    // ===============================================
    async addBook(book) {
        try {
            // Normalização e validação
            const normalizedISBN = this.normalizeISBN(book.isbn);
            this.validateISBN(normalizedISBN);
            await this.db.execute("INSERT INTO books (title, author, isbn, category) VALUES (?, ?, ?, ?)", [
                book.title.trim(),
                book.author.trim(),
                normalizedISBN, // Usa o ISBN normalizado
                book.category.trim()
            ]);
        }
        catch (error) {
            throw new Error(`Falha ao adicionar livro: ${error.message}`);
        }
    }
    // ===============================================
    // Métodos de Busca (mantidos e funcionais)
    // ===============================================
    async searchBooks(term, strategy) {
        const allBooks = await this.loadAllBooks();
        return strategy.search(allBooks, term);
    }
    async findBookByTitle(title) {
        const normalizedTitle = title.trim().toLowerCase();
        const books = await this.db.query("SELECT * FROM books WHERE LOWER(title) = ?", [normalizedTitle]);
        return books[0] || null;
    }
    // ===============================================
    // Métodos Auxiliares (com novas funcionalidades)
    // ===============================================
    normalizeISBN(isbn) {
        return isbn.replace(/[-\s]/g, "").trim(); // Remove hífens e espaços
    }
    validateISBN(isbn) {
        if (![10, 13].includes(isbn.length)) {
            throw new Error(`ISBN inválido: ${isbn}`);
        }
    }
    async loadAllBooks() {
        return this.db.query("SELECT * FROM books", []);
    }
    // ===============================================
    // Novas Funcionalidades Adicionadas (opcional) podemos adiacionar 
    // ===============================================
    async findBookByISBN(isbn) {
        const normalizedISBN = this.normalizeISBN(isbn);
        const books = await this.db.query("SELECT * FROM books WHERE isbn = ?", [normalizedISBN]);
        return books[0] || null;
    }
    async updateBook(bookId, updates) {
        // Implementação de atualização segura
        const allowedFields = ["title", "author", "category"];
        const validUpdates = Object.entries(updates)
            .filter(([key]) => allowedFields.includes(key))
            .reduce((acc, [key, value]) => (Object.assign(Object.assign({}, acc), { [key]: value })), {});
        await this.db.execute("UPDATE books SET ? WHERE id = ?", [validUpdates, bookId]);
    }
}

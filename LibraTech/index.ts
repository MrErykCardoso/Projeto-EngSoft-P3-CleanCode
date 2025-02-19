import { Database } from "./database/database.singleton.js";
import { BookManager } from "./managers/bookManager.js";
import { UserManager } from "./managers/userManager.js";
import { ReservationManager } from "./managers/reservationManager.js";
import{IReservationDetails} from "./library.interfaces.js"
import { 
  SearchByTitleStrategy, 
  SearchByAuthorStrategy, 
  SearchByCategoryStrategy, 
  Reservation, 
  Book, 
  User,
} from "./models/library.models.js";

// Inicialização do banco e managers
const db = Database.getInstance();
const bookManager = new BookManager(db);
const userManager = new UserManager(db);
const reservationManager = new ReservationManager(db);

async function mainMenu() {
  while (true) {
    const inquirer = (await import("inquirer")).default;

    const { action } = await inquirer.prompt([
      {
        type: "list",
        name: "action",
        message: "O que deseja fazer?",
        choices: [
          "Cadastrar livro",
          "Cadastrar usuário",
          "Fazer uma reserva",
          "Ver reservas",
          "Buscar um livro",
          "Sair",
        ],
      },
    ]);

    switch (action) {
      case "Cadastrar livro":
        await cadastrarLivro();
        break;
      case "Cadastrar usuário":
        await cadastrarUsuario();
        break;
      case "Fazer uma reserva":
        await fazerReserva();
        break;
      case "Ver reservas":
        await listarReservas();
        break;
      case "Buscar um livro":
        await buscarLivro();
        break;
      case "Sair":
        console.log("🔌 Conexão encerrada.");
        await db.disconnect();
        return;
    }
  }
}

async function cadastrarLivro() {
  const inquirer = (await import("inquirer")).default;
  const answers = await inquirer.prompt([
    { name: "title", message: "Digite o título do livro:" },
    { name: "author", message: "Digite o autor do livro:" },
    { name: "isbn", message: "Digite o ISBN do livro:" },
    {
      type: "list",
      name: "category",
      message: "Escolha a categoria:",
      choices: ["Esporte", "Ficção", "Educação", "Fantasia", "Diversa"],
    },
  ]);

  const newBook = new Book(0, answers.title, answers.author, answers.isbn, answers.category);
  await bookManager.addBook(newBook);
  console.log("✅ Livro cadastrado com sucesso! ✅");
}

async function cadastrarUsuario() {
  const inquirer = (await import("inquirer")).default;
  const answers = await inquirer.prompt([
    { name: "name", message: "Digite o nome do usuário:" },
    { name: "email", message: "Digite o email do usuário:" },
    { name: "phone", message: "Digite o telefone do usuário:" },
  ]);

  const newUser = new User(0, answers.name, answers.email, answers.phone);
  await userManager.addUser(newUser);
  console.log("✅ Usuário cadastrado com sucesso! ✅");
}

async function fazerReserva() {
  const inquirer = (await import("inquirer")).default;
  const { userEmail } = await inquirer.prompt([{ name: "userEmail", message: "Digite o email do usuário:" }]);
  const user = await userManager.findUserByEmail(userEmail);
  if (!user) {
    console.log("❌ Usuário não encontrado. ❌");
    return;
  }

  const { bookTitle } = await inquirer.prompt([{ name: "bookTitle", message: "Digite o título do livro:" }]);
  const book = await bookManager.findBookByTitle(bookTitle);
  if (!book) {
    console.log("❌ Livro não encontrado. ❌");
    return;
  }

  const reservation = new Reservation(0, book.id, user.id, new Date());
  await reservationManager.createReservation(reservation);
  console.log("✅ Reserva realizada com sucesso! ✅");
}

async function listarReservas() {
  const reservations = await reservationManager.listReservations();
  if (reservations.length === 0) {
    console.log("❌ Nenhuma reserva encontrada. ❌ ");
    return;
  }

  console.log("\n=== Reservas ===\n");
  reservations.forEach((reserva: IReservationDetails) => {
    console.log(`ID: ${reserva.id}`);
    console.log(`Usuário: ${reserva.userName}`);
    console.log(`Livro: ${reserva.bookTitle}`);
    console.log(`Data: ${reserva.reservationDate.toLocaleDateString('pt-BR')}`);
    console.log("----------------------");
  });
}

async function buscarLivro() {
  const inquirer = (await import("inquirer")).default;
  const { searchType } = await inquirer.prompt([
    {
      type: "list",
      name: "searchType",
      message: "Como deseja buscar?",
      choices: ["Título", "Autor", "Categoria"],
    },
  ]);

  let strategy;
  let param;

  if (searchType === "Título") {
    const { bookTitle } = await inquirer.prompt([{ name: "bookTitle", message: "Digite o título do livro:" }]);
    strategy = new SearchByTitleStrategy();
    param = bookTitle;
  } else if (searchType === "Autor") {
    const { authorName } = await inquirer.prompt([{ name: "authorName", message: "Digite o nome do autor:" }]);
    strategy = new SearchByAuthorStrategy();
    param = authorName;
  } else {
    const { category } = await inquirer.prompt([
      {
        type: "list",
        name: "category",
        message: "Escolha a categoria:",
        choices: ["Esporte", "Ficção", "Educação", "Fantasia", "Diversa"],
      },
    ]);
    strategy = new SearchByCategoryStrategy();
    param = category;
  }

  const books = await bookManager.searchBooks(param, strategy);
  if (books.length === 0) {
    console.log("❌Nenhum livro encontrado.❌");
  } else {
    console.log("📚 Livros encontrados: ✅");
    books.forEach((book) => console.log(`Título: ${book.title}, Autor: ${book.author}, Categoria: ${book.category}`));
  }
}

// Executar a função principal
(async () => {
  await mainMenu();
})();
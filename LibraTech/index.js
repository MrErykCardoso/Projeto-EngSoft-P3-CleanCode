const inquirer = require('inquirer');
const mysql = require('mysql2/promise');

// Configuração do banco de dados
const pool = mysql.createPool({
    multipleStatements: true,
    host: "localhost",
    user: "root",
    password: "root123",
    database: "libra_tech",
    port: 3307
});

// Função para executar consultas ao banco de dados
async function executeQuery(query, params = []) {
    const connection = await pool.getConnection();
    try {
        const [rows] = await connection.execute(query, params);
        return rows;
    } catch (error) {
        console.error("Erro ao executar query:", error);
        return null;
    } finally {
        connection.release();
    }
}

// Função principal do menu
function main() {
    inquirer.prompt([
        {
            type: 'list',
            name: 'action',
            message: 'O que você deseja fazer?',
            choices: [
                'Cadastrar livro',
                'Cadastrar usuario',
                'Fazer uma reserva',
                'Ver reservas',
                'Buscar um livro',            
                'Sair'
            ]
        }
    ]).then((answer) => {
        const action = answer['action'];

        if (action === "Cadastrar livro") {
            cadastrarLivro();
        } else if (action === 'Cadastrar usuario') {
            cadastrarUsuario();
        } else if (action === 'Fazer uma reserva') {
            fazerReserva();
        }else if (action === 'Ver reservas') {
            listarReservas();
        }else if (action === 'Buscar um livro') {
            buscarLivro();
        } else if (action === 'Sair') {
            console.log("Saindo...");
            process.exit();            
        }
    }).catch((error) => {
        console.error('Erro ao executar a operação:', error);
    });
}

// Função para cadastrar um livro
function cadastrarLivro() {
    inquirer.prompt([
        { name: 'bookName', message: 'Digite o nome do livro' },
        {
            type: 'list',
            name: 'categoryName',
            message: 'Qual a categoria do livro?',
            choices: ['Esporte', 'Ficção', 'Educação', 'Fantasia', 'Diversa']
        },
        { name: 'author', message: 'Qual o nome do autor do livro?' }
    ]).then(async (answers) => {
        try {
            await executeQuery('INSERT INTO books(name, category, author) VALUES (?, ?, ?)', 
                [answers.bookName, answers.categoryName, answers.author]);
            console.log('Parabéns, livro cadastrado com sucesso!');
        } catch {
            console.log("Erro ao cadastrar livro");
        } finally {
            main();
        }
    });
}

// Função para cadastrar um usuário
function cadastrarUsuario() {
    inquirer.prompt([
        { name: 'userName', message: 'Digite seu Nome' },
        { name: 'userEmail', message: 'Digite seu Email' },
        { name: 'userPhone', message: 'Digite o número do seu telefone' }
    ]).then(async (answers) => {
        try {
            await executeQuery('INSERT INTO users(name, email, phone) VALUES (?, ?, ?)', 
                [answers.userName, answers.userEmail, answers.userPhone]);
            console.log('Parabéns, usuário cadastrado com sucesso!');
        } catch {
            console.log("Erro ao cadastrar usuário");
        } finally {
            main();
        }
    });
}

// Função para fazer uma reserva
async function fazerReserva() {
    const { userName } = await inquirer.prompt([{ name: 'userName', message: 'Digite o nome do usuário:' }]);
    
    const userResults = await executeQuery('SELECT * FROM users WHERE name = ?', [userName]);
    if (!userResults || userResults.length === 0) {
        console.log('Erro: Usuário não encontrado.');
        return main();
    }

    const { bookTitle } = await inquirer.prompt([{ name: 'bookTitle', message: 'Digite o título do livro:' }]);
    
    const bookResults = await executeQuery('SELECT * FROM books WHERE name = ?', [bookTitle]);
    if (!bookResults || bookResults.length === 0) {
        console.log('Erro: Livro não encontrado.');
        return main();
    }

    try {
        await executeQuery('INSERT INTO reservations (bookId, userId) VALUES (?, ?)', 
            [bookResults[0].id, userResults[0].id]);
        console.log('Reserva feita com sucesso!');
    } catch {
        console.log("Erro ao realizar reserva");
    } finally {
        main();
    }
}
// Função para listar as reservas
async function listarReservas() {
    try {
        console.log("Função listarReservas chamada."); // Log 1: Verifica se a função está sendo chamada

        const query = `
            SELECT 
                reservations.id AS reserva_id,
                users.name AS usuario,
                books.name AS livro,
                books.author AS autor
            FROM reservations
            INNER JOIN users ON reservations.userId = users.id
            INNER JOIN books ON reservations.bookId = books.id
        `;

        console.log("Executando consulta SQL..."); // Log 2: Verifica se a consulta está sendo executada
        const reservations = await executeQuery(query);

        console.log("Resultados da consulta:", reservations); // Log 3: Exibe os resultados da consulta

        if (reservations.length === 0) {
            console.log("Nenhuma reserva encontrada.");
            return;
        }

        console.log("\n=== Reservas ===\n");
        reservations.forEach(reserva => {
            console.log(`ID da Reserva: ${reserva.reserva_id}`);
            console.log(`Usuário: ${reserva.usuario}`);
            console.log(`Livro: ${reserva.livro} (Autor: ${reserva.autor})`);
            console.log("----------------------");
        });
    } catch (error) {
        console.error("Erro ao buscar reservas:", error);
    } finally {
        main(); // Volta ao menu principal
    }
}

// Função para buscar um livro
async function buscarLivro() {
    const { searchType } = await inquirer.prompt([
        {
            type: 'list',
            name: 'searchType',
            message: 'Como você gostaria de buscar o livro?',
            choices: ['Buscar por Título', 'Buscar por Autor', 'Buscar por Categoria']
        }
    ]);

    let query, param;

    if (searchType === 'Buscar por Título') {
        const { bookTitle } = await inquirer.prompt({ name: 'bookTitle', message: 'Digite o título do livro:' });
        query = 'SELECT * FROM books WHERE LOWER(TRIM(name)) = LOWER(TRIM(?))';
        param = bookTitle;
    } else if (searchType === 'Buscar por Autor') {
        const { authorName } = await inquirer.prompt({ name: 'authorName', message: 'Digite o nome do autor:' });
        query = 'SELECT * FROM books WHERE author = ?';
        param = authorName;
    } else {
        const { categoryName } = await inquirer.prompt({
            type: 'list',
            name: 'categoryName',
            message: 'Escolha a categoria do livro:',
            choices: ['Esporte', 'Ficção', 'Educação', 'Fantasia', 'Diversa']
        });
        query = 'SELECT * FROM books WHERE category = ?';
        param = categoryName;
    }

    try {
        const books = await executeQuery(query, [param]);
        if (!books || books.length === 0) {
            console.log("Nenhum livro encontrado.");
        } else {
            console.log("Livros encontrados:");
            console.log(JSON.stringify(books, null, 2));
        }
    } catch (error) {
        console.error("Erro ao buscar livro:", error);
    } finally {
        main();
    }
}

// Inicia o programa
main();
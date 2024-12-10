const inquirer = require('inquirer')
const mysql = require('mysql2/promise');

MYSQL_HOST = "localhost"
MYSQL_USER = "root"
MYSQL_PASSWORD = "root123"
MYSQL_DB = "libra_tech"

function main() {
    const connection = mysql.createPool({
        multipleStatements: true,
        host: MYSQL_HOST,
        user: MYSQL_USER,
        password: MYSQL_PASSWORD,
        database: MYSQL_DB,
        port: 3307
    });

    inquirer.prompt([
        {
            type: 'list',
            name: 'action',
            message: 'O que você deseja fazer?',
            choices: [
                'Cadastrar livro',
                'Cadastrar usuario',
                'Fazer uma reserva',
                'Buscar um livro',
                'Sair'
            ]
        }
    ]).then((answer) => {
        const action = answer['action'];
        if (action === "Cadastrar livro") {
            let bookName;
            let category;
            let author;

            inquirer.prompt([
                {
                    name: 'bookName',
                    message: 'Digite o nome do livro',
                },
            ])
                .then((answer) => {
                    bookName = answer['bookName']
                    inquirer.prompt([
                        {
                            type: 'list',
                            name: 'categoryName',
                            message: 'Qual a categoria do livro?',
                            choices: [
                                'Esporte',
                                'Ficção',
                                'Educação',
                                'Fantasia',
                                'Diversa',
                            ]
                        }
                    ]).then((answer) => {
                        category = answer["categoryName"]

                        inquirer.prompt([
                            {
                                name: 'author',
                                message: 'Qual o nome do autor do livro?',
                            }
                        ]).then((answer) => {
                            author = answer["author"]
                            try {
                                connection.execute('INSERT INTO books(name, category, author) VALUES (?, ?, ?)', [bookName, category, author])
                                console.log(('Parabéns, livro cadastrado com sucesso!'))
                            } catch (e) {
                                console.log("Erro ao cadastrar livro");
                            } finally {
                                main();
                            }
                        })
                    })
                })
        } else if (action === 'Cadastrar usuario') {
            let userName;
            let userEmail;
            let userPhone;

            inquirer.prompt([
                {
                    name: 'userName',
                    message: 'Digite seu Nome',
                },
            ])
                .then((answer) => {
                    userName = answer['userName']
                    inquirer.prompt([
                        {
                            name: 'userEmail',
                            message: 'Digite seu Email',
                        },
                    ]).then((answer) => {
                        userEmail = answer["userEmail"]

                        inquirer.prompt([
                            {
                                name: 'userPhone',
                                message: 'Digite o numero do seu telefone',
                            }
                        ]).then((answer) => {
                            userPhone = answer["userPhone"]
                            try {
                                connection.execute('INSERT INTO users(name, email, phone) VALUES (?, ?, ?)', [userName, userEmail, userPhone])
                                console.log(('Parabéns, usuário cadastrado com sucesso!'))
                            } catch (e) {
                                console.log("Erro ao cadastrar livro");
                            } finally {
                                main();
                            }
                        })
                    })
                })
        } else if (action === 'Fazer uma reserva') {
            let userName;
            let bookTitle;

            inquirer.prompt([
                {
                    name: 'userName',
                    message: 'Digite o nome do usuário:',
                }
            ]).then(async (answer) => {
                userName = answer['userName'];
                [userResults] = await connection.execute('SELECT * FROM users WHERE name = ?', [userName])

                if (userResults.length === 0) {
                    console.log('Erro: Usuário não encontrado.');
                    main();
                    return;
                }

                inquirer.prompt([
                    {
                        name: 'bookTitle',
                        message: 'Digite o título do livro:',
                    }
                ]).then(async (answer) => {
                    bookTitle = answer['bookTitle'];
                    [bookResults] = await connection.execute('SELECT * FROM books WHERE name = ?', [bookTitle])

                    if (bookResults.length === 0) {
                        console.log('Erro: Livro não encontrado.');
                        main();
                        return;
                    }
                    const bookId = bookResults[0].id;
                    const userId = userResults[0].id;
                    try {
                        connection.execute('INSERT INTO reservations (bookId, userId) VALUES (?, ?)', [bookId, userId]);
                        console.log('Reserva feita com sucesso!');
                    } catch {
                        console.log("Erro ao realizar reserva");
                    } finally {
                        main();
                    }
                });
            });
        } else if (action === 'Buscar um livro') {
            inquirer.prompt([
                {
                    type: 'list',
                    name: 'searchType',
                    message: 'Como você gostaria de buscar o livro?',
                    choices: [
                        'Buscar por Título',
                        'Buscar por Autor',
                        'Buscar por Categoria'
                    ]
                }
            ]).then((answer) => {
                const searchType = answer['searchType'];

                if (searchType === 'Buscar por Título') {
                    inquirer.prompt([
                        {
                            name: 'bookTitle',
                            message: 'Digite o título do livro:',
                        }
                    ]).then(async (answer) => {
                        const bookTitle = answer['bookTitle'];
                        try {
                            [book] = await connection.execute('SELECT * FROM books where name = ?', [bookTitle]);
                            if (book.length === 0) {
                                console.log("Livro não encontrado");
                            } else {
                                book.map(b => {
                                    console.log(b);
                                });
                            }
                        } catch {
                            console.log("Erro ao buscar livro");
                        } finally {
                            main();
                        }
                    });
                } else if (searchType === 'Buscar por Autor') {
                    inquirer.prompt([
                        {
                            name: 'authorName',
                            message: 'Digite o nome do autor:',
                        }
                    ]).then(async (answer) => {
                        const authorName = answer['authorName'];
                        try {
                            [book] = await connection.execute('SELECT * FROM books where author = ?', [authorName]);
                            if (book.length === 0) {
                                console.log("Livro não encontrado");
                            } else {
                                book.map(b => {
                                    console.log(b);
                                });
                            }
                        } catch {
                            console.log("Erro ao buscar livro");
                        } finally {
                            main();
                        }
                    });
                } else if (searchType === 'Buscar por Categoria') {
                    const categoryChoices = [
                        'Esporte',
                        'Ficção',
                        'Educação',
                        'Fantasia',
                        'Diversa'
                    ];

                    inquirer.prompt([
                        {
                            type: 'list',
                            name: 'categoryName',
                            message: 'Escolha a categoria do livro:',
                            choices: categoryChoices
                        }
                    ]).then(async (answer) => {
                        const categoryName = answer['categoryName'];
                        try {
                            [book] = await connection.execute('SELECT * FROM books where category = ?', [categoryName]);
                            if (book.length === 0) {
                                console.log("Livro não encontrado");
                            } else {
                                book.map(b => {
                                    console.log(b);
                                });
                            }
                        } catch {
                            console.log("Erro ao buscar livro");
                        } finally {
                            main();
                        }
                    });
                }
            }).catch((error) => {
                console.error('Erro ao executar a busca:', error);
            });
        } else if (action === 'Sair') {
            console.log("Saindo...");
            process.exit();
        } else {
            main();
        }
    }).catch((error) => {
        console.error('Erro ao executar a operação:', error);
    });
}

main();

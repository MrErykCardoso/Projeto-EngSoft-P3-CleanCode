const inquirer = require('inquirer');
const mysql = require('mysql2/promise');

MYSQL_HOST=  "localhost"
MYSQL_USER="root"
MYSQL_PASSWORD="root123"
MYSQL_DB="task_master"

function main() {
    const connection = mysql.createPool({
        multipleStatements: true,
        host: MYSQL_HOST,
        user: MYSQL_USER,
        password: MYSQL_PASSWORD,
        database: MYSQL_DB,
        port: 3307
    });

    module.exports = connection;
    inquirer.prompt([
        {
            type: 'list',
            name: 'action',
            message: 'O que você deseja fazer?',
            choices: [
                'Cadastrar tarefa',
                'Editar uma tarefa',
                'excluir tarefas',
                'Listar tarefas',
                'Sair',
            ]
        }
    ]).then(async (answer) => {
        const action = answer['action'];
        if (action === 'Cadastrar tarefa') {
            let tittle;
            let description;

            inquirer.prompt([
                {
                    name: 'taskName',
                    message: 'Digite o título da tarefa',
                }
            ]).then((answer) => {
                tittle = answer['taskName'];
                inquirer.prompt([
                    {
                        name: 'taskDescription',
                        message: 'Escreva a descriçao da tarefa',
                    }
                ]).then(async (answer) => {
                    description = answer['taskDescription'];
                    try {
                        connection.execute('INSERT INTO tasks(title, description, status) VALUES (?, ?, ?)', [tittle, description, "Para fazer"])
                        console.log('Task cadastrada com sucesso');
                    } catch {
                        console.log("Erro ao cadastrar tarefa");
                    } finally {
                        main();
                    }
                })
            })  
        } else if (action === 'Editar uma tarefa') {
            inquirer.prompt([
                {
                    name: 'taskName',
                    message: 'Digite o nome da tarefa que quer editar',
                },
            ]).then(async (answer) => {
                const title = answer['taskName'];

                const [task] = await connection.execute('SELECT * FROM tasks WHERE title = ?', [title]);
                
                if (task.length === 0) {
                    console.log('Tarefa não encontada');
                    main();
                } else {
                    inquirer.prompt([
                        {
                            type: 'list',
                            name: 'action',
                            message: 'O que você deseja alterar?',
                            choices: [
                                'Titulo',
                                'Descrição',
                                'status',
                                'Sair',
                            ]
                        }
                    ]).then((answer) => {
                        const secondAnswer = answer['action']
                        if (secondAnswer === 'Sair') {
                            main();
                        } else if (secondAnswer === 'Titulo') {
                            inquirer.prompt([
                                {
                                    name: 'taskName',
                                    message: 'Digite o novo titulo para a tarefa',
                                },
                            ]).then(async (answer) => {
                                const newTitle = answer['taskName']
                                try {
                                    await connection.execute('UPDATE tasks SET title = ? WHERE title = ?', [newTitle, title])
                                    console.log("Titulo alterado com sucesso")
                                } catch {
                                    console.log('Erro ao atualizar o titulo da tarefa')
                                } finally {
                                    main();
                                }
                            })
                        } else if (secondAnswer === 'Descrição') {
                            inquirer.prompt([
                                {
                                    name: 'taskDescription',
                                    message: 'Digite a nova descrição para a tarefa',
                                },
                            ]).then(async (answer) => {
                                const newDescription = answer['taskDescription']
                                try {
                                    await connection.execute('UPDATE tasks SET description = ? WHERE title = ?', [newDescription, title])
                                    console.log("Descrição alterada com sucesso")
                                } catch {
                                    console.log('Erro ao atualizar a descrição da tarefa')
                                } finally {
                                    main();
                                }
                            })
                        } else if (secondAnswer === 'status') {
                            inquirer.prompt([
                                {
                                    type: 'list',
                                    name: 'status',
                                    message: 'Qual status você deseja colocar?',
                                    choices: [
                                        'Para fazer',
                                        'Fazendo',
                                        'Feita',
                                    ]
                                }
                            ]).then(async (answer) => {
                                const newStatus = answer['status']
                                try {
                                    await connection.execute('UPDATE tasks SET status = ? WHERE title = ?', [newStatus, title])
                                    console.log("Status alterado com sucesso")
                                } catch {
                                    console.log('Erro ao atualizar o status da tarefa')
                                } finally {
                                    main();
                                }
                            })
                        }
                    })
                }
               
            })
        } else if (action === 'excluir tarefas') {
                    inquirer.prompt([
                        {
                            name: 'taskName',
                            message: 'Qual tarefa voce deseja excluir?',
                        }
                    ]).then(async (answer) => {
                        const taskName = answer['taskName'];

                        const [task] = await connection.execute('SELECT * FROM tasks WHERE title = ?', [taskName]);

                        if (task.length === 0) {
                            console.log('Tarefa não encontada');
                            main();
                        } else {
                            try {
                                await connection.execute('DELETE FROM tasks WHERE title = ?', [taskName]);
                                console.log('Tarefa apagada com sucesso!');
                            } catch {
                                console.log('Erro ao apagar a tarefa');
                            } finally {
                                main();
                            }
                        }
                    })
        } else if (action === 'Listar tarefas') {
            try {
                const [tasks] = await connection.execute('SELECT * FROM tasks');
                console.log(tasks);
            } catch {
                console.log("Erro ao listar as tarefas")
            }
            main();
        } else if (action === 'Sair') {
            console.log('Saindo....');
            process.exit();
        } else {
            main();
        }
    }).catch((error) => {
        console.log('Erro ao executar a operação', error);
    });
}


main()
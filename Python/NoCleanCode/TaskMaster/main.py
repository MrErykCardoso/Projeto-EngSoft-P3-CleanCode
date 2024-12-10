import mysql.connector
import questionary

MYSQL_HOST = "localhost"
MYSQL_USER = "root"
MYSQL_PASSWORD = "root123"
MYSQL_DB = "task_master"

def main():
    # Criar a conexão com o banco de dados
    connection = mysql.connector.connect(
        host=MYSQL_HOST,
        user=MYSQL_USER,
        password=MYSQL_PASSWORD,
        database=MYSQL_DB,
        port=3307
    )
    cursor = connection.cursor()

    while True:
        # Perguntar o que o usuário deseja fazer
        action = questionary.select(
            "O que você deseja fazer?",
            choices=[
                'Cadastrar tarefa',
                'Editar uma tarefa',
                'Excluir tarefas',
                'Listar tarefas',
                'Sair'
            ]
        ).ask()

        if action == 'Cadastrar tarefa':
            # Cadastrar tarefa
            title = input("Digite o título da tarefa: ")
            description = input("Escreva a descrição da tarefa: ")
            try:
                cursor.execute(
                    "INSERT INTO tasks (title, description, status) VALUES (%s, %s, %s)",
                    (title, description, "Para fazer")
                )
                connection.commit()  # Commit para salvar a transação no banco
                print("Tarefa cadastrada com sucesso!")
            except Exception as e:
                print("Erro ao cadastrar tarefa:", e)

        elif action == 'Editar uma tarefa':
            # Editar tarefa
            task_name = input("Digite o nome da tarefa que quer editar: ")

            cursor.execute("SELECT * FROM tasks WHERE title = %s", (task_name,))
            task = cursor.fetchone()

            if not task:
                print("Tarefa não encontrada.")
                continue

            action_to_edit = questionary.select(
                "O que você deseja alterar?",
                choices=['Título', 'Descrição', 'Status', 'Sair']
            ).ask()

            if action_to_edit == 'Sair':
                continue

            if action_to_edit == 'Título':
                new_title = input("Digite o novo título para a tarefa: ")
                cursor.execute(
                    "UPDATE tasks SET title = %s WHERE title = %s", (new_title, task_name)
                )
                connection.commit()  # Commit após a alteração
                print("Título alterado com sucesso!")

            elif action_to_edit == 'Descrição':
                new_description = input("Digite a nova descrição para a tarefa: ")
                cursor.execute(
                    "UPDATE tasks SET description = %s WHERE title = %s", (new_description, task_name)
                )
                connection.commit()  # Commit após a alteração
                print("Descrição alterada com sucesso!")

            elif action_to_edit == 'Status':
                status = questionary.select(
                    "Qual status você deseja colocar?",
                    choices=['Para fazer', 'Fazendo', 'Feita']
                ).ask()
                cursor.execute(
                    "UPDATE tasks SET status = %s WHERE title = %s", (status, task_name)
                )
                connection.commit()  # Commit após a alteração
                print("Status alterado com sucesso!")

        elif action == 'Excluir tarefas':
            # Excluir tarefa
            task_name = input("Qual tarefa você deseja excluir? ")

            cursor.execute("SELECT * FROM tasks WHERE title = %s", (task_name,))
            task = cursor.fetchone()

            if not task:
                print("Tarefa não encontrada.")
                continue

            try:
                cursor.execute("DELETE FROM tasks WHERE title = %s", (task_name,))
                connection.commit()  # Commit após a exclusão
                print("Tarefa apagada com sucesso!")
            except Exception as e:
                print("Erro ao apagar a tarefa:", e)

        elif action == 'Listar tarefas':
            # Listar todas as tarefas
            cursor.execute("SELECT * FROM tasks")
            tasks = cursor.fetchall()
            if tasks:
                for task in tasks:
                    print(f"ID: {task[0]} | Título: {task[1]} | Descrição: {task[2]} | Status: {task[3]}")
            else:
                print("Nenhuma tarefa encontrada.")

        elif action == 'Sair':
            # Sair do sistema
            print("Saindo...")
            cursor.close()
            connection.close()
            break
        else:
            print("Opção inválida. Tente novamente.")

if __name__ == "__main__":
    main()

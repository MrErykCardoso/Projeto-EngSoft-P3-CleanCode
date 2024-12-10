import mysql.connector
import questionary

MYSQL_HOST = "localhost"
MYSQL_USER = "root"
MYSQL_PASSWORD = "root123"
MYSQL_DB = "libra_tech"
MYSQL_PORT = 3307

connection = mysql.connector.connect(
    host=MYSQL_HOST,
    user=MYSQL_USER,
    password=MYSQL_PASSWORD,
    database=MYSQL_DB,
    port=MYSQL_PORT
)

cursor = connection.cursor()

while True:
    action = questionary.select(
        "O que você deseja fazer?",
        choices=[
            'Cadastrar livro',
            'Cadastrar usuario',
            'Fazer uma reserva',
            'Buscar um livro',
            'Sair'
        ]
    ).ask()

    if action == "Cadastrar livro":
        book_name = input("Digite o nome do livro: ")
        category = questionary.select(
            "Qual a categoria do livro?",
            choices=[
                'Esporte',
                'Ficção',
                'Educação',
                'Fantasia',
                'Diversa',
            ]
        ).ask()
        author = input("Qual o nome do autor do livro? ")

        try:
            cursor.execute('INSERT INTO books (name, category, author) VALUES (%s, %s, %s)', (book_name, category, author))
            connection.commit()
            print('Parabéns, livro cadastrado com sucesso!')
        except Exception as e:
            print("Erro ao cadastrar livro:", e)

    elif action == "Cadastrar usuario":
        user_name = input("Digite seu nome: ")
        user_email = input("Digite seu email: ")
        user_phone = input("Digite o número do seu telefone: ")

        try:
            cursor.execute('INSERT INTO users (name, email, phone) VALUES (%s, %s, %s)', (user_name, user_email, user_phone))
            connection.commit()
            print('Parabéns, usuário cadastrado com sucesso!')
        except Exception as e:
            print("Erro ao cadastrar usuário:", e)

    elif action == "Fazer uma reserva":
        user_name = input("Digite o nome do usuário: ")
        cursor.execute('SELECT * FROM users WHERE name = %s', (user_name,))
        user_results = cursor.fetchall()

        if len(user_results) == 0:
            print('Erro: Usuário não encontrado.')
            continue

        book_title = input("Digite o título do livro: ")
        cursor.execute('SELECT * FROM books WHERE name = %s', (book_title,))
        book_results = cursor.fetchall()

        if len(book_results) == 0:
            print('Erro: Livro não encontrado.')
            continue

        book_id = book_results[0][0]  
        user_id = user_results[0][0]  

        try:
            cursor.execute('INSERT INTO reservations (bookId, userId) VALUES (%s, %s)', (book_id, user_id))
            connection.commit()
            print('Reserva feita com sucesso!')
        except Exception as e:
            print("Erro ao realizar reserva:", e)

    elif action == "Buscar um livro":
        search_type = questionary.select(
            "Como você gostaria de buscar o livro?",
            choices=[
                'Buscar por Título',
                'Buscar por Autor',
                'Buscar por Categoria'
            ]
        ).ask()

        if search_type == 'Buscar por Título':
            book_title = input("Digite o título do livro: ")
            cursor.execute('SELECT * FROM books WHERE name = %s', (book_title,))
            books = cursor.fetchall()

            if len(books) == 0:
                print("Livro não encontrado.")
            else:
                for book in books:
                    print(book)

        elif search_type == 'Buscar por Autor':
            author_name = input("Digite o nome do autor: ")
            cursor.execute('SELECT * FROM books WHERE author = %s', (author_name,))
            books = cursor.fetchall()

            if len(books) == 0:
                print("Livro não encontrado.")
            else:
                for book in books:
                    print(book)

        elif search_type == 'Buscar por Categoria':
            category_choices = [
                'Esporte',
                'Ficção',
                'Educação',
                'Fantasia',
                'Diversa'
            ]
            category_name = questionary.select(
                "Escolha a categoria do livro:",
                choices=category_choices
            ).ask()
            cursor.execute('SELECT * FROM books WHERE category = %s', (category_name,))
            books = cursor.fetchall()

            if len(books) == 0:
                print("Livro não encontrado.")
            else:
                for book in books:
                    print(book)

    elif action == "Sair":
        print("Saindo...")
        cursor.close()
        connection.close()
        break

    else:
        print("Opção inválida. Tente novamente.")

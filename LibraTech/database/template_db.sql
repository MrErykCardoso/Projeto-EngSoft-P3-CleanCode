-- Active: 1739670409750@@127.0.0.1@3307@libra_tech
-- criar banco de dados para o LibraTech
CREATE DATABASE IF NOT EXISTS libra_tech;
USE libra_tech;

-- Tabela de livros atualizada
CREATE TABLE IF NOT EXISTS books (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,  -- Nome alterado de 'name' para 'title'
    category VARCHAR(255) NOT NULL,
    author VARCHAR(255) NOT NULL,
    isbn VARCHAR(17) UNIQUE NOT NULL  -- Coluna adicionada
);

-- Tabela de usuários (sem alterações necessárias)
CREATE TABLE IF NOT EXISTS users(
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(255) NOT NULL
);

-- Tabela de reservas atualizada
CREATE TABLE IF NOT EXISTS reservations(
    id INT AUTO_INCREMENT PRIMARY KEY,
    bookId INT NOT NULL,
    userId INT NOT NULL,
    reservationDate DATETIME NOT NULL,  -- Coluna adicionada
    status ENUM('active', 'cancelled') DEFAULT 'active',  -- Coluna adicionada
    FOREIGN KEY (bookId) REFERENCES books(id),
    FOREIGN KEY (userId) REFERENCES users(id)
);
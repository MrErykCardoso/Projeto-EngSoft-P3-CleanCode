-- Active: 1739670409750@@127.0.0.1@3307@libra_tech
-- criar banco de dados para o LibraTech
CREATE DATABASE libra_tech;

USE libra_tech;
-- criar tabela de livros
CREATE TABLE IF NOT EXISTS books (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(255) NOT NULL,
    author VARCHAR(255) NOT NULL
);

-- criar tabelas de usuarios
CREATE TABLE IF NOT EXISTS users(
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(255) NOT NULL
);

-- criar tabela de reservas que relaciona usuarios e livros
CREATE TABLE IF NOT EXISTS reservations(
    id int AUTO_INCREMENT,
    bookId INT NOT NULL,
    userId INT NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (bookId) REFERENCES books (id),
    FOREIGN KEY (userId) REFERENCES users (id)
);


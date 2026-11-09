import Database from "better-sqlite3";

const db = new Database("./app/db/escola.db");//cria banco

db.pragma("foreign_keys = ON");//habilita chave estrangeira

db.exec(`
    CREATE TABLE IF NOT EXISTS alunos (
        id_aluno INTEGER PRIMARY KEY AUTOINCREMENT,
        nome TEXT NOT NULL,
        idade INTEGER NOT NULL,
        serie TEXT NOT NULL,
        ra TEXT NOT NULL UNIQUE
    ) ;   
    CREATE TABLE IF NOT EXISTS notas (
        id_nota INTEGER PRIMARY KEY AUTOINCREMENT,
       id_aluno INTEGER NOT NULL UNIQUE,
       t1 REAL NOT NULL,
       t2 REAL NOT NULL,
       n1 REAL NOT NULL,
       n2 REAL NOT NULL,
       n3 REAL NOT NULL,
       FOREIGN KEY (id_aluno)
       REFERENCES alunos(id_aluno)
       ON DELETE CASCADE
    ) ;   
`)
console.log('Banco de dados criado com sucesso');

export default db;



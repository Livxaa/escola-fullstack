import Database from 'better-sqlite3';
import path from 'path';

// Define o caminho absoluto seguro para a base de dados na raiz do projeto
const dbPath = path.join(process.cwd(), 'exemplo.db');

// Padrão Singleton no globalThis para evitar múltiplas conexões e bloqueios
// (SQLITE_BUSY / database is locked) durante Fast Refresh e recarregamento de rotas no Next.js
const globalForDb = globalThis;

let db;

if (!globalForDb.escolaDbInstance) {
  db = new Database(dbPath);

  // Ativa WAL (Write-Ahead Logging) para permitir leituras e gravações simultâneas sem conflito de locks
  db.pragma('journal_mode = WAL');
  // Garante a integridade referencial com chaves estrangeiras ativas
  db.pragma('foreign_keys = ON');

  // Inicializa o esquema de tabelas do sistema se ainda não existirem
  db.exec(`
    CREATE TABLE IF NOT EXISTS aluno (
      id_aluno INTEGER PRIMARY KEY AUTOINCREMENT,
      nome TEXT NOT NULL,
      idade INTEGER NOT NULL,
      serie TEXT NOT NULL,
      ra TEXT NOT NULL UNIQUE,
      email TEXT NOT NULL UNIQUE
    );

    CREATE UNIQUE INDEX IF NOT EXISTS idx_aluno_ra ON aluno(ra);
    CREATE UNIQUE INDEX IF NOT EXISTS idx_aluno_email ON aluno(email);

    CREATE TABLE IF NOT EXISTS notas (
      id_nota INTEGER PRIMARY KEY AUTOINCREMENT,
      trabalho1 REAL NOT NULL,
      trabalho2 REAL NOT NULL,
      nota1 REAL NOT NULL,
      nota2 REAL NOT NULL,
      nota3 REAL NOT NULL,
      aluno_id INTEGER NOT NULL,
      FOREIGN KEY (aluno_id) REFERENCES aluno(id_aluno) ON DELETE CASCADE
    );
  `);

  globalForDb.escolaDbInstance = db;
} else {
  db = globalForDb.escolaDbInstance;
}

export default db;
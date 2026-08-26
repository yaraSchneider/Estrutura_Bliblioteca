import Database from "better-sqlite3";
import path from "path";

const dbPath = path.resolve(__dirname, "dados.db");

const db = new Database(dbPath);

db.pragma("journal_mode = WAL");

export function inicializarBanco(): void {
  const query = `
    CREATE TABLE IF NOT EXISTS livros (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      titulo TEXT NOT NULL,
      autor TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'disponível',
      categoria TEXT NOT NULL
    );
  `;

  db.exec(query);

  console.log("✅ Banco de dados inicializado!");
  console.log("✅ Tabela 'livros' pronta para uso!");
}

export default db;
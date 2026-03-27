import sqlite3 from 'sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Mantém o banco dentro da pasta data do backend, independente do diretório atual do processo.
const dbPath = join(__dirname, '../data/zenvyx.db');

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Erro ao conectar ao banco de dados:', err);
  } else {
    console.log('Conectado ao banco de dados SQLite');
    initializeDatabase();
  }
});

const initializeDatabase = () => {
  // Tabela principal de produtos do estoque.
  db.run(`
    CREATE TABLE IF NOT EXISTS produtos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome TEXT NOT NULL,
      sku TEXT UNIQUE NOT NULL,
      descricao TEXT,
      precoCusto REAL NOT NULL,
      precoVenda REAL NOT NULL,
      quantidade INTEGER DEFAULT 0,
      estoqueBaixo INTEGER DEFAULT 5,
      categoria TEXT,
      ativo BOOLEAN DEFAULT 1,
      dataCriacao DATETIME DEFAULT CURRENT_TIMESTAMP,
      dataAtualizacao DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `, (err) => {
    if (err) {
      console.error('Erro ao criar tabela de produtos:', err);
    } else {
      console.log('Tabela de produtos criada/verificada');
    }
  });

  // Histórico de entradas/saídas com referência ao produto movimentado.
  db.run(`
    CREATE TABLE IF NOT EXISTS movimentacoes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      produtoId INTEGER NOT NULL,
      tipo TEXT NOT NULL,
      quantidade INTEGER NOT NULL,
      motivo TEXT,
      dataMov DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (produtoId) REFERENCES produtos(id)
    )
  `, (err) => {
    if (err) {
      console.error('Erro ao criar tabela de movimentações:', err);
    } else {
      console.log('Tabela de movimentações criada/verificada');
    }
  });
};

export default db;

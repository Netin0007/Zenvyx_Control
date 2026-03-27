import express from 'express';
import db from '../config/database.js';

const router = express.Router();

// Lista apenas produtos ativos (soft delete preserva o histórico no banco).
router.get('/', (req, res) => {
  db.all('SELECT * FROM produtos WHERE ativo = 1', (err, rows) => {
    if (err) {
      res.status(500).json({ erro: err.message });
      return;
    }
    res.json(rows || []);
  });
});

// Busca produto ativo por ID.
router.get('/:id', (req, res) => {
  const { id } = req.params;
  db.get('SELECT * FROM produtos WHERE id = ? AND ativo = 1', [id], (err, row) => {
    if (err) {
      res.status(500).json({ erro: err.message });
      return;
    }
    if (!row) {
      res.status(404).json({ erro: 'Produto não encontrado' });
      return;
    }
    res.json(row);
  });
});

// Cria produto com validações mínimas obrigatórias.
router.post('/', (req, res) => {
  const { nome, sku, descricao, precoCusto, precoVenda, quantidade, estoqueBaixo, categoria } = req.body;

  if (!nome || !sku || !precoCusto || !precoVenda) {
    res.status(400).json({ erro: 'Nome, SKU, preço de custo e preço de venda são obrigatórios' });
    return;
  }

  const sql = `
    INSERT INTO produtos (nome, sku, descricao, precoCusto, precoVenda, quantidade, estoqueBaixo, categoria)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;

  // Usa placeholders para evitar SQL injection em entradas do usuário.
  db.run(sql, [nome, sku, descricao, precoCusto, precoVenda, quantidade || 0, estoqueBaixo || 5, categoria], function(err) {
    if (err) {
      if (err.message.includes('UNIQUE constraint failed')) {
        res.status(400).json({ erro: 'SKU já existe' });
      } else {
        res.status(500).json({ erro: err.message });
      }
      return;
    }
    res.status(201).json({ id: this.lastID, mensagem: 'Produto criado com sucesso' });
  });
});

// Atualiza o produto e registra dataAtualizacao para auditoria básica.
router.put('/:id', (req, res) => {
  const { id } = req.params;
  const { nome, sku, descricao, precoCusto, precoVenda, quantidade, estoqueBaixo, categoria } = req.body;

  const sql = `
    UPDATE produtos
    SET nome = ?, sku = ?, descricao = ?, precoCusto = ?, precoVenda = ?, 
        quantidade = ?, estoqueBaixo = ?, categoria = ?, dataAtualizacao = CURRENT_TIMESTAMP
    WHERE id = ?
  `;

  db.run(sql, [nome, sku, descricao, precoCusto, precoVenda, quantidade, estoqueBaixo, categoria, id], function(err) {
    if (err) {
      res.status(500).json({ erro: err.message });
      return;
    }
    if (this.changes === 0) {
      res.status(404).json({ erro: 'Produto não encontrado' });
      return;
    }
    res.json({ mensagem: 'Produto atualizado com sucesso' });
  });
});

// Soft delete: marca como inativo sem apagar definitivamente o registro.
router.delete('/:id', (req, res) => {
  const { id } = req.params;

  db.run('UPDATE produtos SET ativo = 0 WHERE id = ?', [id], function(err) {
    if (err) {
      res.status(500).json({ erro: err.message });
      return;
    }
    if (this.changes === 0) {
      res.status(404).json({ erro: 'Produto não encontrado' });
      return;
    }
    res.json({ mensagem: 'Produto deletado com sucesso' });
  });
});

export default router;

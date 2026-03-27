import express from 'express';
import db from '../config/database.js';

const router = express.Router();

// Lista movimentações junto com dados do produto para exibição no frontend.
router.get('/', (req, res) => {
  const query = `
    SELECT 
      m.id,
      m.produtoId,
      m.tipo,
      m.quantidade,
      m.motivo,
      m.dataMov,
      p.nome as nomeProduto,
      p.sku
    FROM movimentacoes m
    JOIN produtos p ON m.produtoId = p.id
    ORDER BY m.dataMov DESC
  `;

  db.all(query, (err, rows) => {
    if (err) {
      console.error('Erro ao listar movimentações:', err);
      return res.status(500).json({ erro: 'Erro ao listar movimentações' });
    }
    res.json(rows || []);
  });
});

// Retorna uma movimentação específica com os dados do produto relacionado.
router.get('/:id', (req, res) => {
  const { id } = req.params;

  const query = `
    SELECT 
      m.id,
      m.produtoId,
      m.tipo,
      m.quantidade,
      m.motivo,
      m.dataMov,
      p.nome as nomeProduto,
      p.sku
    FROM movimentacoes m
    JOIN produtos p ON m.produtoId = p.id
    WHERE m.id = ?
  `;

  db.get(query, [id], (err, row) => {
    if (err) {
      console.error('Erro ao obter movimentação:', err);
      return res.status(500).json({ erro: 'Erro ao obter movimentação' });
    }

    if (!row) {
      return res.status(404).json({ erro: 'Movimentação não encontrada' });
    }

    res.json(row);
  });
});

// Cria movimentação e sincroniza quantidade de estoque do produto.
router.post('/', (req, res) => {
  const { produtoId, tipo, quantidade, motivo } = req.body;

  // Validações de entrada para evitar estados inválidos de estoque.
  if (!produtoId || !tipo || !quantidade) {
    return res.status(400).json({ erro: 'Campos obrigatórios: produtoId, tipo, quantidade' });
  }

  if (!['entrada', 'saida'].includes(tipo)) {
    return res.status(400).json({ erro: 'Tipo deve ser "entrada" ou "saida"' });
  }

  if (quantidade <= 0) {
    return res.status(400).json({ erro: 'Quantidade deve ser maior que zero' });
  }

  // Verifica existência e estoque atual do produto antes da operação.
  db.get('SELECT id, quantidade FROM produtos WHERE id = ?', [produtoId], (err, produto) => {
    if (err) {
      console.error('Erro ao verificar produto:', err);
      return res.status(500).json({ erro: 'Erro ao verificar produto' });
    }

    if (!produto) {
      return res.status(404).json({ erro: 'Produto não encontrado' });
    }

    // Em saída, impede quantidade negativa no estoque.
    if (tipo === 'saida' && produto.quantidade < quantidade) {
      return res.status(400).json({ 
        erro: `Estoque insuficiente. Disponível: ${produto.quantidade}`, 
        disponivel: produto.quantidade 
      });
    }

    // Calcula o novo saldo após entrada/saída.
    const novaQuantidade = tipo === 'entrada' 
      ? produto.quantidade + quantidade 
      : produto.quantidade - quantidade;

    // Transação garante consistência entre tabela de movimentações e saldo do produto.
    db.run('BEGIN TRANSACTION', (beginErr) => {
      if (beginErr) {
        console.error('Erro ao iniciar transação:', beginErr);
        return res.status(500).json({ erro: 'Erro no servidor' });
      }

      // Passo 1: grava a movimentação.
      const insertQuery = `
        INSERT INTO movimentacoes (produtoId, tipo, quantidade, motivo)
        VALUES (?, ?, ?, ?)
      `;

      db.run(insertQuery, [produtoId, tipo, quantidade, motivo || ''], (insertErr) => {
        if (insertErr) {
          console.error('Erro ao inserir movimentação:', insertErr);
          db.run('ROLLBACK', () => {
            return res.status(500).json({ erro: 'Erro ao criar movimentação' });
          });
          return;
        }

        // Passo 2: atualiza o saldo do produto.
        const updateQuery = `
          UPDATE produtos 
          SET quantidade = ?, dataAtualizacao = CURRENT_TIMESTAMP
          WHERE id = ?
        `;

        db.run(updateQuery, [novaQuantidade, produtoId], (updateErr) => {
          if (updateErr) {
            console.error('Erro ao atualizar quantidade:', updateErr);
            db.run('ROLLBACK', () => {
              return res.status(500).json({ erro: 'Erro ao atualizar quantidade' });
            });
            return;
          }

          // Finaliza com commit; em erro, rollback preserva consistência.
          db.run('COMMIT', (commitErr) => {
            if (commitErr) {
              console.error('Erro ao fazer commit:', commitErr);
              db.run('ROLLBACK', () => {
                return res.status(500).json({ erro: 'Erro na graação da movimentação' });
              });
              return;
            }

            // Retorna a última movimentação para atualizar a UI com os dados completos.
            const selectQuery = `
              SELECT 
                m.id,
                m.produtoId,
                m.tipo,
                m.quantidade,
                m.motivo,
                m.dataMov,
                p.nome as nomeProduto,
                p.sku,
                p.quantidade as quantidadeAtual
              FROM movimentacoes m
              JOIN produtos p ON m.produtoId = p.id
              ORDER BY m.id DESC
              LIMIT 1
            `;

            db.get(selectQuery, (selectErr, novaMovimentacao) => {
              if (selectErr) {
                console.error('Erro ao recuperar movimentação:', selectErr);
                return res.status(500).json({ erro: 'Erro ao recuperar movimentação' });
              }

              res.status(201).json({
                mensagem: 'Movimentação criada com sucesso',
                movimentacao: novaMovimentacao
              });
            });
          });
        });
      });
    });
  });
});

// Remove movimentação e desfaz o impacto no estoque do produto.
router.delete('/:id', (req, res) => {
  const { id } = req.params;

  // Verifica a existência para evitar rollback de operação inexistente.
  db.get('SELECT * FROM movimentacoes WHERE id = ?', [id], (err, mov) => {
    if (err) {
      console.error('Erro ao verificar movimentação:', err);
      return res.status(500).json({ erro: 'Erro ao deletar movimentação' });
    }

    if (!mov) {
      return res.status(404).json({ erro: 'Movimentação não encontrada' });
    }

    // Inverte o efeito original da movimentação no saldo do produto.
    const novaQuantidade = mov.tipo === 'entrada'
      ? -mov.quantidade
      : mov.quantidade;

    db.run('BEGIN TRANSACTION', (beginErr) => {
      if (beginErr) {
        return res.status(500).json({ erro: 'Erro no servidor' });
      }

      // Passo 1: remove registro da movimentação.
      const deleteQuery = 'DELETE FROM movimentacoes WHERE id = ?';
      
      db.run(deleteQuery, [id], (deleteErr) => {
        if (deleteErr) {
          db.run('ROLLBACK');
          return res.status(500).json({ erro: 'Erro ao deletar movimentação' });
        }

        // Passo 2: aplica ajuste inverso no estoque do produto.
        const updateQuery = `
          UPDATE produtos 
          SET quantidade = quantidade + ?, dataAtualizacao = CURRENT_TIMESTAMP
          WHERE id = ?
        `;

        db.run(updateQuery, [novaQuantidade, mov.produtoId], (updateErr) => {
          if (updateErr) {
            db.run('ROLLBACK');
            return res.status(500).json({ erro: 'Erro ao reverter quantidade' });
          }

          db.run('COMMIT', (commitErr) => {
            if (commitErr) {
              db.run('ROLLBACK');
              return res.status(500).json({ erro: 'Erro na deleção' });
            }

            res.json({ mensagem: 'Movimentação deletada e quantidade revertida' });
          });
        });
      });
    });
  });
});

export default router;

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import produtosRoutes from './routes/produtos.js';
import movimentacoesRoutes from './routes/movimentacoes.js';
import db from './config/database.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middlewares globais: liberam CORS e parseiam JSON do corpo das requisições.
app.use(cors());
app.use(express.json());

// Registro das rotas principais da API.
app.use('/api/produtos', produtosRoutes);
app.use('/api/movimentacoes', movimentacoesRoutes);

// Endpoint simples para monitoramento/health check.
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', mensagem: 'Servidor funcionando corretamente' });
});

// Fallback para qualquer rota não registrada.
app.use((req, res) => {
  res.status(404).json({ erro: 'Rota não encontrada' });
});

// Inicializa o servidor HTTP na porta configurada.
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
  console.log(`📝 Documentação disponível em http://localhost:${PORT}/api/docs`);
});

// Encerramento gracioso para fechar conexão com SQLite antes de sair do processo.
process.on('SIGINT', () => {
  console.log('\nEncerrando servidor...');
  db.close((err) => {
    if (err) {
      console.error('Erro ao fechar banco de dados:', err);
    }
    process.exit(0);
  });
});

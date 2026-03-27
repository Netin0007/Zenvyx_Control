# Zenvyx Control - Backend

API REST do sistema de gestao de estoque.

## Stack

- Node.js
- Express
- SQLite
- dotenv
- cors

## Execucao

```bash
cd backend
npm install
npm run dev
```

Servidor padrao: `http://localhost:3001`

Health check:

```bash
curl http://localhost:3001/api/health
```

## Endpoints

Base URL: `http://localhost:3001`

Health:
- `GET /api/health`

Produtos:
- `GET /api/produtos`
- `GET /api/produtos/:id`
- `POST /api/produtos`
- `PUT /api/produtos/:id`
- `DELETE /api/produtos/:id` (soft delete)

Movimentacoes:
- `GET /api/movimentacoes`
- `GET /api/movimentacoes/:id`
- `POST /api/movimentacoes`
- `DELETE /api/movimentacoes/:id`

## Exemplo de Criacao de Produto

```json
{
  "nome": "Mouse Gamer",
  "sku": "MOU-001",
  "descricao": "Mouse com DPI ajustavel",
  "precoCusto": 50.0,
  "precoVenda": 89.9,
  "quantidade": 10,
  "estoqueBaixo": 5,
  "categoria": "Perifericos"
}
```

## Estrutura

```text
backend/
|- config/database.js
|- routes/produtos.js
|- routes/movimentacoes.js
|- middleware/errorHandler.js
|- data/zenvyx.db
|- server.js
`- package.json
```

## Banco de Dados

Tabelas criadas automaticamente:

- `produtos`
- `movimentacoes`

Regras importantes:

- Soft delete de produto usando `ativo = 0`.
- Saida valida estoque disponivel.
- Movimentacoes usam transacao para manter consistencia.

## Scripts

- `npm run dev` inicia com nodemon
- `npm start` inicia em modo normal

## Variaveis de Ambiente

Arquivo `.env` (opcional):

```env
PORT=3001
NODE_ENV=development
DATABASE_PATH=./data/zenvyx.db
```

Observacao: atualmente o caminho do banco esta definido no codigo de `config/database.js`.

## Referencia

Documentacao geral do monorepo: `../README.md`.

# Guia de Execucao

Este arquivo concentra o passo a passo rapido para subir o projeto localmente.

## Requisitos

- Node.js (LTS)
- npm

## 1. Subir Backend

```bash
cd backend
npm install
npm run dev
```

Backend: `http://localhost:3001`

Teste rapido:

```bash
curl http://localhost:3001/api/health
```

## 2. Subir Frontend

Em outro terminal:

```bash
cd Zenvyx_Control
npm install
npm run dev
```

Frontend: `http://localhost:5173` (ou porta exibida pelo Vite)

## Endpoints Principais

- `GET /api/health`
- `GET /api/produtos`
- `GET /api/produtos/:id`
- `POST /api/produtos`
- `PUT /api/produtos/:id`
- `DELETE /api/produtos/:id`
- `GET /api/movimentacoes`
- `GET /api/movimentacoes/:id`
- `POST /api/movimentacoes`
- `DELETE /api/movimentacoes/:id`

## Observacoes

- O banco SQLite e criado automaticamente em `backend/data/zenvyx.db`.
- Se a porta 3001 estiver ocupada, ajuste no `.env` do backend.
- Se a porta do frontend mudar, use a URL exibida no terminal do Vite.

## Referencia

- Documentacao geral: `README.md`
- Backend: `backend/README.md`
- Frontend: `Zenvyx_Control/README.md`

# Zenvyx Control - Frontend

Aplicacao React responsavel pela interface do sistema de estoque.

## Stack

- React
- React Router
- Vite
- Lucide React
- CSS

## Paginas

- Dashboard
- Estoque
- Movimentacao
- Novo Produto

## Execucao

```bash
cd Zenvyx_Control
npm install
npm run dev
```

Aplicacao em `http://localhost:5173` (ou porta informada no terminal).

## Integracao com Backend

O frontend consome a API em `http://localhost:3001`.

Antes de usar a interface, rode tambem o backend:

```bash
cd ../backend
npm install
npm run dev
```

## Scripts

- `npm run dev` inicia o ambiente de desenvolvimento
- `npm run build` gera build de producao
- `npm run preview` executa preview da build
- `npm run lint` executa lint
- `npm run server` sobe mock local com json-server (opcional)

## Estrutura

```text
Zenvyx_Control/
|- src/
|  |- components/
|  |- hooks/
|  |- pages/
|  |- services/
|  |- styles/
|  |- App.jsx
|  `- main.jsx
|- index.html
|- vite.config.js
`- package.json
```

## Observacoes

- As telas principais fazem chamadas HTTP diretas para a API local.
- Existe uma camada utilitaria em `src/services/api.js` para centralizacao gradual das chamadas.
- O arquivo `src/hooks/useProdutos.js` esta como placeholder e pode ser reativado no futuro.

## Referencia

Documentacao geral do monorepo: `../README.md`.
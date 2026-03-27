# Dashboard Setup

Este documento descreve escopo e verificacao da pagina Dashboard.

## Escopo Implementado

- Cards de resumo:
   - Total de produtos
   - Valor em estoque
   - Estoque baixo
   - Sem estoque
- Bloco de alertas:
   - Produtos sem estoque
   - Produtos com estoque baixo
- Bloco de movimentacoes recentes:
   - Tipo (entrada/saida)
   - Produto
   - Quantidade
   - Motivo
   - Data/hora

## Fontes de Dados

- API principal:
   - `GET /api/produtos`
   - `GET /api/movimentacoes`
- Fallback local em caso de erro de conexao com backend.

## Como Validar

1. Suba backend:

```bash
cd backend
npm install
npm run dev
```

2. Suba frontend:

```bash
cd Zenvyx_Control
npm install
npm run dev
```

3. Abra a rota inicial do frontend e confira:

- cards de indicadores preenchidos
- alertas coerentes com quantidade
- lista de movimentacoes recentes

## Arquivos Relacionados

- `Zenvyx_Control/src/pages/Dashboard.jsx`
- `Zenvyx_Control/src/styles/App.css`

## Observacoes

- O comportamento visual e responsivo depende dos estilos em `App.css`.
- Os dados de fallback facilitam demonstracao sem backend ativo, mas a validacao oficial deve usar API real.

## Referencia

- Guia de execucao: `COMO_EXECUTAR.md`
- Documentacao geral: `README.md`

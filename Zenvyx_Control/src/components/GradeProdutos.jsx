/**
 * Componente responsável por exibir a lista de produtos em formato de grid
 * 
 * Responsabilidades:
 * - Renderizar produtos em cards
 * - Exibir estado vazio (sem produtos)
 * - Disparar ações de editar e excluir
 * - Destacar produtos com estoque baixo
 */

import React from 'react';

/**
 * @param {Object} props
 * @param {Array<Object>} props.produtos - Lista de produtos
 * @param {Function} props.onExcluirProduto - Callback para excluir produto
 * @param {Function} props.onEditarProduto - Callback para editar produto
 */
function GradeProdutos({ produtos, onExcluirProduto, onEditarProduto }) {

  /**
   * Estado vazio:
   * Exibe mensagem amigável quando não há produtos cadastrados
   */
  if (produtos.length === 0) {
    return (
      <div style={{ textAlign: 'center', marginTop: '50px', color: '#7f8c8d' }}>
        <h2>Seu estoque está vazio!</h2>
        <p>Clique no botão verde acima para cadastrar o primeiro produto.</p>
      </div>
    );
  }

  return (
    <div className="grid-cards">

      {/**
       * Itera sobre a lista de produtos para renderizar os cards
       */}
      {produtos.map((produto) => {

        /**
         * Regra de negócio:
         * Verifica se o produto está com estoque baixo
         * - Usa valor personalizado (produto.estoqueBaixo)
         * - Caso não exista, usa valor padrão (5)
         */
        const isEstoqueBaixo =
          produto.quantidade <= (produto.estoqueBaixo || 5);

        return (
          <div
            key={produto.id}
            className={`card-produto ${
              isEstoqueBaixo ? 'alerta-estoque' : ''
            }`}
          >

            {/* ================= HEADER DO CARD ================= */}
            <div className="card-header">
              <h3>{produto.nome}</h3>

              {/* SKU (identificação do produto) */}
              <span className="sku">
                SKU: {produto.sku}
              </span>
            </div>

            {/* ================= CORPO DO CARD ================= */}
            <div className="card-body">

              {/* 
                Exibição do preço:
                - Converte para número
                - Formata com 2 casas decimais
              */}
              <p className="preco">
                R$ {Number(produto.precoVenda).toFixed(2)}
              </p>

              {/* Quantidade em estoque */}
              <div className="quantidade-box">
                <span className="quantidade">
                  {produto.quantidade} un.
                </span>
              </div>
            </div>

            {/* ================= AÇÕES ================= */}
            <div className="card-actions">

              {/* Botão de edição */}
              <button
                onClick={() => onEditarProduto(produto)}
                className="btn-editar"
              >
                Editar
              </button>

              {/* Botão de exclusão */}
              <button
                onClick={() => onExcluirProduto(produto.id)}
                className="btn-excluir"
              >
                Excluir
              </button>

            </div>

          </div>
        );
      })}
    </div>
  );
}

export default GradeProdutos;
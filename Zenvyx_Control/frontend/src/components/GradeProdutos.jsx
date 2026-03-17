import React from 'react';

function GradeProdutos({ produtos, onExcluirProduto, onEditarProduto }) {
  return (
    <div className="grid-cards">
      {produtos.map((produto) => {
        const isEstoqueBaixo = produto.quantidade <= (produto.estoqueBaixo || 5);

        return (
          <div key={produto.id} className={`card-produto ${isEstoqueBaixo ? 'alerta-estoque' : ''}`}>
            
            <div className="card-header">
              <h3>{produto.nome}</h3>
              <span className="sku">SKU: {produto.sku}</span>
            </div>
            
            <div className="card-body">
              <p className="preco">R$ {Number(produto.precoVenda).toFixed(2)}</p>
              <div className="quantidade-box">
                <span className="quantidade">{produto.quantidade} un.</span>
              </div>
            </div>

            <div className="card-actions">
              <button onClick={() => onEditarProduto(produto)} className="btn-editar">Editar</button>
              <button onClick={() => onExcluirProduto(produto.id)} className="btn-excluir">Excluir</button>
            </div>
            
          </div>
        );
      })}
    </div>
  );
}

export default GradeProdutos;
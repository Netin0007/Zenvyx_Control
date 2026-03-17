function TabelaProdutos({ produtos, onExcluirProduto, onEditarProduto }) {
  return (
    <table className="product-table">
      <thead>
        <tr>
          <th>SKU</th>
          <th>Nome</th>
          <th>Quantidade</th>
          <th>Preço de Custo</th>
          <th>Preço de Venda</th>
          <th>Ações</th>
        </tr>
      </thead>
      <tbody>
        {produtos.map((produto) => (
          <tr key={produto.id} className={produto.quantidade <= produto.estoqueBaixo ? 'low-stock' : ''}>
            <td>{produto.sku}</td>
            <td>{produto.nome}</td>
            <td>{produto.quantidade}</td>
            <td>R$ {Number(produto.precoCusto).toFixed(2)}</td>
            <td>R$ {Number(produto.precoVenda).toFixed(2)}</td>
            <td>
              <button onClick={() => onEditarProduto(produto)}>Editar</button>
              <button onClick={() => onExcluirProduto(produto.id)} className="btn-delete">Excluir</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default TabelaProdutos;
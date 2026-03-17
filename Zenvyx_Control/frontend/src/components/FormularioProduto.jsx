import { useState, useEffect } from 'react';

function FormularioProduto({ onProdutoAdicionado, onProdutoAtualizado, produtoParaEditar }) {
  const [novoProduto, setNovoProduto] = useState({ nome: '', sku: '', quantidade: 0, precoCusto: 0, precoVenda: 0, estoqueBaixo: 5 });

  useEffect(() => {
    if (produtoParaEditar) {
      setNovoProduto(produtoParaEditar);
    } else {
      setNovoProduto({ nome: '', sku: '', quantidade: 0, precoCusto: 0, precoVenda: 0, estoqueBaixo: 5 });
    }
  }, [produtoParaEditar]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setNovoProduto({ ...novoProduto, [name]: value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const isEdicao = !!novoProduto.id;
    const url = isEdicao ? `http://localhost:3001/produtos/${novoProduto.id}` : 'http://localhost:3001/produtos';
    const method = isEdicao ? 'PUT' : 'POST';

    try {
      const response = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(novoProduto),
      });

      if (response.ok) {
        const produtoResultante = await response.json();
        if (isEdicao) {
          onProdutoAtualizado(produtoResultante);
        } else {
          onProdutoAdicionado(produtoResultante);
        }
        setNovoProduto({ nome: '', sku: '', quantidade: 0, precoCusto: 0, precoVenda: 0, estoqueBaixo: 5 });
      }
    } catch (error) {
      console.error('Erro na requisição:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="form-container">
      <h2>{novoProduto.id ? 'Editar Produto' : 'Adicionar Novo Produto'}</h2>
      <div><label htmlFor="nome">Nome:</label><input type="text" id="nome" name="nome" value={novoProduto.nome} onChange={handleChange} required /></div>
      <div><label htmlFor="sku">SKU:</label><input type="text" id="sku" name="sku" value={novoProduto.sku} onChange={handleChange} required /></div>
      <div><label htmlFor="quantidade">Quantidade:</label><input type="number" id="quantidade" name="quantidade" value={novoProduto.quantidade} onChange={handleChange} required /></div>
      <div><label htmlFor="precoCusto">Preço de Custo:</label><input type="number" id="precoCusto" name="precoCusto" value={novoProduto.precoCusto} onChange={handleChange} step="0.01" required /></div>
      <div><label htmlFor="precoVenda">Preço de Venda:</label><input type="number" id="precoVenda" name="precoVenda" value={novoProduto.precoVenda} onChange={handleChange} step="0.01" required /></div>
      <button type="submit">{novoProduto.id ? 'Salvar Alterações' : 'Adicionar Produto'}</button>
    </form>
  );
}

export default FormularioProduto;
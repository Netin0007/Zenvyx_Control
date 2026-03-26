import { useState, useEffect } from 'react';

function FormularioProduto({ onSalvar, produtoParaEditar, onCancelar }) {
  const estadoInicial = { nome: '', sku: '', quantidade: 0, precoCusto: 0, precoVenda: 0, estoqueBaixo: 5 };
  const [novoProduto, setNovoProduto] = useState(estadoInicial);

  useEffect(() => {
    if (produtoParaEditar) setNovoProduto(produtoParaEditar);
    else setNovoProduto(estadoInicial);
  }, [produtoParaEditar]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setNovoProduto({ ...novoProduto, [name]: value });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onSalvar(novoProduto); // Ele não faz fetch, só avisa a página que quer salvar!
  };

  return (
    <form onSubmit={handleSubmit} className="form-container fade-in">
      <h2>{novoProduto.id ? '✏️ Editar Produto' : '📦 Adicionar Novo Produto'}</h2>
      
      <div className="form-grid">
        <div>
          <label htmlFor="nome">Nome do Produto:</label>
          <input type="text" id="nome" name="nome" value={novoProduto.nome} onChange={handleChange} required />
        </div>
        <div>
          <label htmlFor="sku">SKU (Código):</label>
          <input type="text" id="sku" name="sku" value={novoProduto.sku} onChange={handleChange} required />
        </div>
      </div>

      <div className="form-grid">
        <div>
          <label htmlFor="quantidade">Quantidade Inicial:</label>
          <input type="number" id="quantidade" name="quantidade" value={novoProduto.quantidade} onChange={handleChange} required />
        </div>
        <div>
          <label htmlFor="estoqueBaixo">Alerta de Estoque Baixo:</label>
          <input type="number" id="estoqueBaixo" name="estoqueBaixo" value={novoProduto.estoqueBaixo} onChange={handleChange} required />
        </div>
      </div>

      <div className="form-grid">
        <div>
          <label htmlFor="precoCusto">Preço de Custo (R$):</label>
          <input type="number" id="precoCusto" name="precoCusto" value={novoProduto.precoCusto} onChange={handleChange} step="0.01" required />
        </div>
        <div>
          <label htmlFor="precoVenda">Preço de Venda (R$):</label>
          <input type="number" id="precoVenda" name="precoVenda" value={novoProduto.precoVenda} onChange={handleChange} step="0.01" required />
        </div>
      </div>

      <div className="form-actions">
        <button type="submit" className="btn-salvar">
          {novoProduto.id ? 'Salvar Alterações' : 'Cadastrar Produto'}
        </button>
        <button type="button" onClick={onCancelar} className="btn-cancelar">
          Cancelar
        </button>
      </div>
    </form>
  );
}

export default FormularioProduto;
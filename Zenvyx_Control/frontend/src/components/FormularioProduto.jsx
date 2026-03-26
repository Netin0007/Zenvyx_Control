import { useState, useEffect } from 'react';

function FormularioProduto({ onSalvar, produtoParaEditar, onCancelar }) {
  const estadoInicial = { 
    nome: '', 
    sku: '', 
    quantidade: 0, 
    precoCusto: 0, 
    precoVenda: 0, 
    estoqueBaixo: 5 
  };

  const [produto, setProduto] = useState(estadoInicial);
  const [erros, setErros] = useState({});

  useEffect(() => {
    if (produtoParaEditar) setProduto(produtoParaEditar);
    else setProduto(estadoInicial);
  }, [produtoParaEditar]);

  const validar = () => {
    const novosErros = {};
    if (!produto.nome.trim()) novosErros.nome = "O nome é obrigatório";
    if (!produto.sku.trim()) novosErros.sku = "O SKU é obrigatório";
    if (Number(produto.precoVenda) <= 0) novosErros.precoVenda = "Preço de venda inválido";
    if (Number(produto.precoVenda) < Number(produto.precoCusto)) {
      novosErros.precoVenda = "Venda menor que o custo!";
    }

    setErros(novosErros);
    return Object.keys(novosErros).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    // Converte para número se for campo de preço ou quantidade
    const valorFormatado = e.target.type === 'number' ? Number(value) : value;
    setProduto({ ...produto, [name]: valorFormatado });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validar()) {
      onSalvar(produto);
    }
  };

  return (
    <div className="form-wrapper fade-in">
      <form onSubmit={handleSubmit} className="form-moderno">
        <header className="form-header">
          <h2>{produto.id ? '✏️ Editar Produto' : '📦 Novo Cadastro'}</h2>
          <p>Gerencie as informações do seu estoque com precisão.</p>
        </header>

        <div className="form-secao">
          <h3>Identificação</h3>
          <div className="form-grid">
            <div className={`input-group ${erros.nome ? 'erro' : ''}`}>
              <label>NOME DO PRODUTO</label>
              <input 
                type="text" 
                name="nome" 
                value={produto.nome} 
                onChange={handleChange} 
                placeholder="Ex: Mouse Gamer"
              />
              {erros.nome && <span className="msg-erro">{erros.nome}</span>}
            </div>

            <div className={`input-group ${erros.sku ? 'erro' : ''}`}>
              <label>SKU / CÓDIGO</label>
              <input 
                type="text" 
                name="sku" 
                value={produto.sku} 
                onChange={handleChange} 
                placeholder="Ex: MOU-123"
              />
              {erros.sku && <span className="msg-erro">{erros.sku}</span>}
            </div>
          </div>
        </div>

        <div className="form-secao">
          <h3>Financeiro e Quantidades</h3>
          <div className="form-grid-3">
            <div className="input-group">
              <label>CUSTO (R$)</label>
              <input 
                type="number" 
                name="precoCusto" 
                step="0.01" 
                value={produto.precoCusto} 
                onChange={handleChange} 
              />
            </div>

            <div className={`input-group ${erros.precoVenda ? 'erro' : ''}`}>
              <label>VENDA (R$)</label>
              <input 
                type="number" 
                name="precoVenda" 
                step="0.01" 
                value={produto.precoVenda} 
                onChange={handleChange} 
              />
              {erros.precoVenda && <span className="msg-erro">{erros.precoVenda}</span>}
            </div>

            <div className="input-group">
              <label>ESTOQUE ATUAL</label>
              <input 
                type="number" 
                name="quantidade" 
                value={produto.quantidade} 
                onChange={handleChange} 
              />
            </div>
          </div>
        </div>

        <footer className="form-footer">
          <button type="button" onClick={onCancelar} className="btn-secundario">Cancelar</button>
          <button type="submit" className="btn-primario">
            {produto.id ? 'Salvar Alterações' : 'Cadastrar no Sistema'}
          </button>
        </footer>
      </form>
    </div>
  );
}

export default FormularioProduto;
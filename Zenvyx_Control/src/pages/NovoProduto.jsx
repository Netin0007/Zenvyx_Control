import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function NovoProduto() {
  const navigate = useNavigate();
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState(null);
  const [formData, setFormData] = useState({
    nome: '',
    sku: '',
    categoria: '',
    fornecedor: '',
    quantidade: 0,
    estoqueBaixo: 0,
    precoCusto: 0,
    precoVenda: 0,
    localizacao: '',
    descricao: ''
  });

  const categorias = ['Eletrônicos', 'Alimentos', 'Bebidas', 'Limpeza', 'Escritório', 'Outros'];

  const handleChange = (e) => {
    const { name, value } = e.target;
    // Converte campos numéricos para number e mantém texto como string.
    setFormData(prev => ({
      ...prev,
      [name]: ['quantidade', 'estoqueBaixo', 'precoCusto', 'precoVenda'].includes(name) 
        ? parseFloat(value) || 0 
        : value
    }));
  };

  const validarFormulario = () => {
    // Validação básica no frontend para evitar requisições inválidas.
    if (!formData.nome.trim()) {
      setErro('Nome do produto é obrigatório');
      return false;
    }
    if (!formData.sku.trim()) {
      setErro('SKU é obrigatório');
      return false;
    }
    if (!formData.categoria.trim()) {
      setErro('Categoria é obrigatória');
      return false;
    }
    if (formData.quantidade < 0) {
      setErro('Quantidade não pode ser negativa');
      return false;
    }
    if (formData.estoqueBaixo < 0) {
      setErro('Quantidade mínima não pode ser negativa');
      return false;
    }
    if (formData.precoCusto < 0) {
      setErro('Custo não pode ser negativo');
      return false;
    }
    if (formData.precoVenda < 0) {
      setErro('Preço de venda não pode ser negativo');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validarFormulario()) {
      return;
    }

    try {
      setCarregando(true);
      setErro(null);

      // Persiste novo produto no backend.
      const response = await fetch('http://localhost:3001/api/produtos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.erro || 'Erro ao criar produto');
      }

      const novoProduto = await response.json();
      console.log('Produto criado:', novoProduto);
      
      // Navega para listagem após criação bem-sucedida.
      navigate('/estoque');
    } catch (erro) {
      console.error('Erro:', erro);
      setErro(erro.message || 'Erro ao criar produto. Tente novamente.');
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className="novo-produto-page">
      <div className="novo-produto-container">
        <div className="form-header">
          <h1>Novo Produto</h1>
          <p>Adicione um novo produto ao seu estoque</p>
        </div>

        {erro && (
          <div className="alert-erro" style={{ marginBottom: '20px' }}>
            {erro}
          </div>
        )}

        <form onSubmit={handleSubmit} className="form-moderno">
          {/* Seção 1: Informações Básicas */}
          <div className="form-secao">
            <h3>Informações Básicas</h3>
            <div className="form-grid">
              <div className="input-group">
                <label htmlFor="nome">Nome do Produto *</label>
                <input
                  type="text"
                  id="nome"
                  name="nome"
                  placeholder="Ex: Mouse Wireless"
                  value={formData.nome}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="input-group">
                <label htmlFor="sku">SKU *</label>
                <input
                  type="text"
                  id="sku"
                  name="sku"
                  placeholder="Ex: ELE-001"
                  value={formData.sku}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-grid">
              <div className="input-group">
                <label htmlFor="categoria">Categoria *</label>
                <select
                  id="categoria"
                  name="categoria"
                  value={formData.categoria}
                  onChange={handleChange}
                  required
                >
                  <option value="">Selecione uma categoria</option>
                  {categorias.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              <div className="input-group">
                <label htmlFor="fornecedor">Fornecedor</label>
                <input
                  type="text"
                  id="fornecedor"
                  name="fornecedor"
                  placeholder="Ex: Tech Distribuidora"
                  value={formData.fornecedor}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          {/* Seção 2: Estoque */}
          <div className="form-secao">
            <h3>Estoque</h3>
            <div className="form-grid">
              <div className="input-group">
                <label htmlFor="quantidade">Quantidade *</label>
                <input
                  type="number"
                  id="quantidade"
                  name="quantidade"
                  min="0"
                  value={formData.quantidade}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="input-group">
                <label htmlFor="estoqueBaixo">Quantidade Mínima *</label>
                <input
                  type="number"
                  id="estoqueBaixo"
                  name="estoqueBaixo"
                  min="0"
                  value={formData.estoqueBaixo}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="input-group">
              <label htmlFor="localizacao">Localização no Estoque</label>
              <input
                type="text"
                id="localizacao"
                name="localizacao"
                placeholder="Ex: Prateleira A-12"
                value={formData.localizacao}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Seção 3: Preços */}
          <div className="form-secao">
            <h3>Preços</h3>
            <div className="form-grid">
              <div className="input-group">
                <label htmlFor="precoCusto">Custo (R$) *</label>
                <div className="input-currency">
                  <span className="currency-symbol">R$</span>
                  <input
                    type="number"
                    id="precoCusto"
                    name="precoCusto"
                    min="0"
                    step="0.01"
                    value={formData.precoCusto}
                    onChange={handleChange}
                    placeholder="0,00"
                    required
                  />
                </div>
              </div>
              <div className="input-group">
                <label htmlFor="precoVenda">Preço de Venda (R$) *</label>
                <div className="input-currency">
                  <span className="currency-symbol">R$</span>
                  <input
                    type="number"
                    id="precoVenda"
                    name="precoVenda"
                    min="0"
                    step="0.01"
                    value={formData.precoVenda}
                    onChange={handleChange}
                    placeholder="0,00"
                    required
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Seção 4: Descrição */}
          <div className="form-secao">
            <h3>Informações Adicionais</h3>
            <div className="input-group">
              <label htmlFor="descricao">Descrição</label>
              <textarea
                id="descricao"
                name="descricao"
                placeholder="Descrição detalhada do produto"
                value={formData.descricao}
                onChange={handleChange}
                rows="4"
              />
            </div>
          </div>

          {/* Botões */}
          <div className="form-footer">
            <button 
              type="button" 
              className="btn-secundario"
              onClick={() => navigate('/estoque')}
            >
              Cancelar
            </button>
            <button 
              type="submit" 
              className="btn-primario btn-criar"
              disabled={carregando}
            >
              {carregando ? 'Criando...' : 'Criar Produto'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default NovoProduto;

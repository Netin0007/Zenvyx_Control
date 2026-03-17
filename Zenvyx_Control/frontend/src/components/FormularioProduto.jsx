/**
 * Componente de formulário de produto
 * 
 * Responsabilidades:
 * - Criar novo produto
 * - Editar produto existente
 * - Controlar estado do formulário
 * - Enviar dados para API (POST/PUT)
 */

import { useState, useEffect } from 'react';

/**
 * @param {Object} props
 * @param {Function} props.onProdutoAdicionado - Callback ao adicionar produto
 * @param {Function} props.onProdutoAtualizado - Callback ao atualizar produto
 * @param {Object|null} props.produtoParaEditar - Produto selecionado para edição
 * @param {Function} props.onCancelar - Callback para cancelar ação
 */
function FormularioProduto({
  onProdutoAdicionado,
  onProdutoAtualizado,
  produtoParaEditar,
  onCancelar
}) {

  /**
   * Estado inicial do formulário
   */
  const estadoInicial = {
    nome: '',
    sku: '',
    quantidade: 0,
    precoCusto: 0,
    precoVenda: 0,
    estoqueBaixo: 5
  };

  /**
   * Estado que representa o produto sendo editado/criado
   */
  const [novoProduto, setNovoProduto] = useState(estadoInicial);

  /**
   * Efeito para controlar modo edição:
   * - Se existir produtoParaEditar → preenche formulário
   * - Caso contrário → reseta formulário
   */
  useEffect(() => {
    if (produtoParaEditar) {
      setNovoProduto(produtoParaEditar);
    } else {
      setNovoProduto(estadoInicial);
    }
  }, [produtoParaEditar]);

  /**
   * Atualiza os valores dos inputs dinamicamente
   * @param {Event} event
   */
  const handleChange = (event) => {
    const { name, value } = event.target;

    setNovoProduto({
      ...novoProduto,
      [name]: value
    });
  };

  /**
   * Envio do formulário (criação ou edição)
   * - Decide automaticamente entre POST e PUT
   * - Integra com API
   */
  const handleSubmit = async (event) => {
    event.preventDefault();

    // Verifica se está em modo edição
    const isEdicao = !!novoProduto.id;

    // Define endpoint e método HTTP dinamicamente
    const url = isEdicao
      ? `http://localhost:3001/produtos/${novoProduto.id}`
      : 'http://localhost:3001/produtos';

    const method = isEdicao ? 'PUT' : 'POST';

    try {
      const response = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(novoProduto),
      });

      if (response.ok) {
        const produtoResultante = await response.json();

        // Dispara callback correto
        if (isEdicao) {
          onProdutoAtualizado(produtoResultante);
        } else {
          onProdutoAdicionado(produtoResultante);
        }

        // Reseta formulário após sucesso
        setNovoProduto(estadoInicial);
      }
    } catch (error) {
      console.error('Erro na requisição:', error);
      alert('Erro ao salvar o produto!');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="form-container fade-in">

      {/* Título dinâmico baseado no modo (edição ou criação) */}
      <h2>
        {novoProduto.id
          ? '✏️ Editar Produto'
          : '📦 Adicionar Novo Produto'}
      </h2>

      {/* ================= DADOS BÁSICOS ================= */}
      <div className="form-grid">

        {/* Nome do produto */}
        <div>
          <label htmlFor="nome">Nome do Produto:</label>
          <input
            type="text"
            id="nome"
            name="nome"
            value={novoProduto.nome}
            onChange={handleChange}
            placeholder="Ex: Capinha de Celular"
            required
          />
        </div>

        {/* SKU */}
        <div>
          <label htmlFor="sku">SKU (Código):</label>
          <input
            type="text"
            id="sku"
            name="sku"
            value={novoProduto.sku}
            onChange={handleChange}
            placeholder="Ex: CAP-001"
            required
          />
        </div>

      </div>

      {/* ================= ESTOQUE ================= */}
      <div className="form-grid">

        {/* Quantidade inicial */}
        <div>
          <label htmlFor="quantidade">Quantidade Inicial:</label>
          <input
            type="number"
            id="quantidade"
            name="quantidade"
            value={novoProduto.quantidade}
            onChange={handleChange}
            required
          />
        </div>

        {/* Limite de estoque baixo */}
        <div>
          <label htmlFor="estoqueBaixo">Alerta de Estoque Baixo:</label>
          <input
            type="number"
            id="estoqueBaixo"
            name="estoqueBaixo"
            value={novoProduto.estoqueBaixo}
            onChange={handleChange}
            required
          />
        </div>

      </div>

      {/* ================= PREÇOS ================= */}
      <div className="form-grid">

        {/* Preço de custo */}
        <div>
          <label htmlFor="precoCusto">Preço de Custo (R$):</label>
          <input
            type="number"
            id="precoCusto"
            name="precoCusto"
            value={novoProduto.precoCusto}
            onChange={handleChange}
            step="0.01"
            required
          />
        </div>

        {/* Preço de venda */}
        <div>
          <label htmlFor="precoVenda">Preço de Venda (R$):</label>
          <input
            type="number"
            id="precoVenda"
            name="precoVenda"
            value={novoProduto.precoVenda}
            onChange={handleChange}
            step="0.01"
            required
          />
        </div>

      </div>

      {/* ================= AÇÕES ================= */}
      <div className="form-actions">

        {/* Botão principal */}
        <button type="submit" className="btn-salvar">
          {novoProduto.id
            ? 'Salvar Alterações'
            : 'Cadastrar Produto'}
        </button>

        {/* Botão cancelar */}
        <button
          type="button"
          onClick={onCancelar}
          className="btn-cancelar"
        >
          Cancelar
        </button>

      </div>
    </form>
  );
}

export default FormularioProduto;
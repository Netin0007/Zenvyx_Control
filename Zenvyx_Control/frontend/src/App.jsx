// Importação de hooks do React
import { useState, useEffect } from 'react';

// Importação de estilos globais da aplicação
import './styles/App.css';

// Importação dos componentes principais
import GradeProdutos from './components/GradeProdutos.jsx';
import FormularioProduto from './components/FormularioProduto.jsx';

/**
 * Componente principal da aplicação
 * Responsável por:
 * - Gerenciar o estado global de produtos
 * - Controlar a navegação entre listagem e formulário
 * - Integrar com a API (CRUD de produtos)
 */
function App() {

  /**
   * Lista de produtos cadastrados
   * @type {Array<Object>}
   */
  const [produtos, setProdutos] = useState([]);

  /**
   * Produto atualmente em edição
   * @type {Object|null}
   */
  const [produtoEmEdicao, setProdutoEmEdicao] = useState(null);

  /**
   * Controle de exibição do formulário
   * true  -> mostra formulário (criar/editar)
   * false -> mostra lista de produtos
   */
  const [mostrarFormulario, setMostrarFormulario] = useState(false);

  /**
   * Efeito executado ao carregar a aplicação
   * Responsável por buscar os produtos da API
   */
  useEffect(() => {
    const fetchProdutos = async () => {
      try {
        const response = await fetch('http://localhost:3001/produtos');
        const data = await response.json();
        setProdutos(data);
      } catch (error) {
        console.error('Erro ao buscar produtos:', error);
      }
    };

    fetchProdutos();
  }, []);

  /**
   * Adiciona um novo produto na lista
   * @param {Object} novoProduto
   */
  const handleProdutoAdicionado = (novoProduto) => {
    setProdutos([...produtos, novoProduto]);

    // Retorna para a tela de listagem
    setMostrarFormulario(false);
  };

  /**
   * Remove um produto da base de dados e da interface
   * @param {number|string} id
   */
  const handleDeleteProduto = async (id) => {
    const confirmar = window.confirm('Tem certeza que deseja excluir este produto?');

    if (!confirmar) return;

    try {
      const response = await fetch(`http://localhost:3001/produtos/${id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        // Atualiza estado removendo o produto excluído
        setProdutos(produtos.filter(produto => produto.id !== id));
      }
    } catch (error) {
      console.error('Erro ao deletar produto:', error);
    }
  };

  /**
   * Seleciona um produto para edição
   * @param {Object} produto
   */
  const handleSelecionarProdutoParaEdicao = (produto) => {
    setProdutoEmEdicao(produto);

    // Abre o formulário em modo edição
    setMostrarFormulario(true);
  };

  /**
   * Atualiza um produto existente na lista
   * @param {Object} produtoAtualizado
   */
  const handleProdutoAtualizado = (produtoAtualizado) => {
    setProdutos(
      produtos.map(p =>
        p.id === produtoAtualizado.id ? produtoAtualizado : p
      )
    );

    // Limpa estado de edição
    setProdutoEmEdicao(null);

    // Retorna para a listagem
    setMostrarFormulario(false);
  };

  /**
   * Cancela a edição/criação e retorna para listagem
   */
  const cancelarEdicao = () => {
    setProdutoEmEdicao(null);
    setMostrarFormulario(false);
  };

  return (
    <div className="app-container">

      {/* Cabeçalho principal da aplicação */}
      <header className="header-principal">
        <h1>Zenvyx Control</h1>

        {/* Botão exibido apenas quando NÃO está no formulário */}
        {!mostrarFormulario && (
          <button
            className="btn-novo-produto"
            onClick={() => setMostrarFormulario(true)}
          >
            + Novo Produto
          </button>
        )}
      </header>

      {/* 
        Renderização condicional:
        - Se mostrarFormulario = true -> exibe formulário
        - Caso contrário -> exibe lista de produtos
      */}
      {mostrarFormulario ? (
        <FormularioProduto
          onProdutoAdicionado={handleProdutoAdicionado}
          onProdutoAtualizado={handleProdutoAtualizado}
          produtoParaEditar={produtoEmEdicao}
          onCancelar={cancelarEdicao}
        />
      ) : (
        <GradeProdutos
          produtos={produtos}
          onExcluirProduto={handleDeleteProduto}
          onEditarProduto={handleSelecionarProdutoParaEdicao}
        />
      )}
    </div>
  );
}

export default App;
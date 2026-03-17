import { useState, useEffect } from 'react';
import './App.css';
import TabelaProdutos from './components/TabelaProdutos.jsx';
import FormularioProduto from './components/FormularioProduto.jsx';

function App() {
  const [produtos, setProdutos] = useState([]);
  const [produtoEmEdicao, setProdutoEmEdicao] = useState(null);

  useEffect(() => {
    const fetchProdutos = async () => {
      const response = await fetch('http://localhost:3001/produtos');
      const data = await response.json();
      setProdutos(data);
    };
    fetchProdutos();
  }, []);

  const handleProdutoAdicionado = (novoProduto) => {
    setProdutos([...produtos, novoProduto]);
  };

  const handleDeleteProduto = async (id) => {
    const response = await fetch(`http://localhost:3001/produtos/${id}`, { method: 'DELETE' });
    if (response.ok) {
      setProdutos(produtos.filter(produto => produto.id !== id));
    }
  };

  const handleSelecionarProdutoParaEdicao = (produto) => {
    setProdutoEmEdicao(produto);
  };

  const handleProdutoAtualizado = (produtoAtualizado) => {
    setProdutos(produtos.map(p => p.id === produtoAtualizado.id ? produtoAtualizado : p));
    setProdutoEmEdicao(null);
  };

  return (
    <div className="app-container">
      <h1>Estoque Simples</h1>
      <FormularioProduto
        onProdutoAdicionado={handleProdutoAdicionado}
        onProdutoAtualizado={handleProdutoAtualizado}
        produtoParaEditar={produtoEmEdicao}
      />
      <hr />
      <TabelaProdutos
        produtos={produtos}
        onExcluirProduto={handleDeleteProduto}
        onEditarProduto={handleSelecionarProdutoParaEdicao}
      />
    </div>
  );
}

export default App;
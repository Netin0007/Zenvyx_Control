import { useState, useEffect } from 'react';

export function useProdutos() {
  const [produtos, setProdutos] = useState([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    carregarProdutos();
  }, []);

  const carregarProdutos = async () => {
    setCarregando(true);
    try {
      const response = await fetch('http://localhost:3001/produtos');
      const data = await response.json();
      setProdutos(data);
    } catch (erro) {
      console.error("Erro ao buscar produtos:", erro);
    } finally {
      setCarregando(false);
    }
  };

  const adicionarProduto = async (novoProduto) => {
    try {
      const response = await fetch('http://localhost:3001/produtos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(novoProduto),
      });
      if (response.ok) {
        const produtoSalvo = await response.json();
        setProdutos([...produtos, produtoSalvo]);
        return true;
      }
    } catch (erro) {
      console.error("Erro ao adicionar:", erro);
      return false;
    }
  };

  const atualizarProduto = async (produtoAtualizado) => {
    try {
      const response = await fetch(`http://localhost:3001/produtos/${produtoAtualizado.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(produtoAtualizado),
      });
      if (response.ok) {
        setProdutos(produtos.map(p => p.id === produtoAtualizado.id ? produtoAtualizado : p));
        return true;
      }
    } catch (erro) {
      console.error("Erro ao atualizar:", erro);
      return false;
    }
  };

  const excluirProduto = async (id) => {
    try {
      const response = await fetch(`http://localhost:3001/produtos/${id}`, { method: 'DELETE' });
      if (response.ok) {
        setProdutos(produtos.filter(produto => produto.id !== id));
        return true;
      }
    } catch (erro) {
      console.error("Erro ao excluir:", erro);
      return false;
    }
  };

  return {
    produtos,
    carregando,
    adicionarProduto,
    atualizarProduto,
    excluirProduto
  };
}
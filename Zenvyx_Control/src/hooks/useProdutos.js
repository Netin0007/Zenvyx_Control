import { useState, useEffect } from 'react';
import { fetchZoho } from '../services/api.js';

export function useProdutos() {
  const [produtos, setProdutos] = useState([]);
  const [carregando, setCarregando] = useState(true);

  const carregarProdutos = async () => {
    try {
      setCarregando(true);
      const data = await fetchZoho('/produtos');
      setProdutos(data || []);
    } catch (err) {
      console.error("Erro ao carregar produtos:", err);
    } finally {
      setCarregando(false);
    }
  };

  useEffect(() => {
    carregarProdutos();
  }, []);

  const adicionarProduto = async (novoProduto) => {
    const data = await fetchZoho('/produtos', {
      method: 'POST',
      body: JSON.stringify(novoProduto)
    });
    setProdutos(prev => [...prev, data]);
    return data;
  };

  const atualizarProduto = async (produtoEditado) => {
    const data = await fetchZoho(`/produtos/${produtoEditado.id}`, {
      method: 'PUT',
      body: JSON.stringify(produtoEditado)
    });
    setProdutos(prev => prev.map(p => p.id === data.id ? data : p));
    return data;
  };

  const excluirProduto = async (id) => {
    if (!window.confirm("Deseja excluir este item?")) return;
    await fetchZoho(`/produtos/${id}`, { method: 'DELETE' });
    setProdutos(prev => prev.filter(p => p.id !== id));
  };

  return { produtos, carregando, adicionarProduto, atualizarProduto, excluirProduto };
}
// src/services/api.js
const API_URL = "http://localhost:3001"; 

// Wrapper centralizado para padronizar chamadas HTTP ao backend.
export const fetchZoho = async (endpoint, options = {}) => {
  const url = `${API_URL}${endpoint}`;
  
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  try {
    const response = await fetch(url, { ...options, headers });
    
    if (!response.ok) {
      throw new Error('Servidor local não respondeu corretamente');
    }

    return await response.json();
  } catch (error) {
    console.error("Erro na API Local:", error);
    throw error;
  }
};

// Helpers de Produtos.
export const getProdutos = () => fetchZoho('/api/produtos');
export const getProdutoById = (id) => fetchZoho(`/api/produtos/${id}`);
export const criarProduto = (data) => fetchZoho('/api/produtos', {
  method: 'POST',
  body: JSON.stringify(data)
});

// Helpers de Movimentações.
export const getMovimentacoes = () => fetchZoho('/api/movimentacoes');
export const getMovimentacaoById = (id) => fetchZoho(`/api/movimentacoes/${id}`);
export const criarMovimentacao = (data) => fetchZoho('/api/movimentacoes', {
  method: 'POST',
  body: JSON.stringify(data)
});
export const deletarMovimentacao = (id) => fetchZoho(`/api/movimentacoes/${id}`, {
  method: 'DELETE'
});
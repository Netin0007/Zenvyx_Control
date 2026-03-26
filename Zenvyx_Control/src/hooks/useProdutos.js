import { useState, useEffect } from "react";
import { fetchZoho } from "../services/api.js";

export function useProdutos() {
  const [produtos, setProdutos] = useState([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    carregarProdutos();
  }, []);

  const carregarProdutos = async () => {
    setCarregando(true);
    try {
      const data = await fetchZoho("/items");

      // O Zoho devolve os dados em inglês. Vamos "traduzir" para os Cards do nosso sistema!
      const produtosTraduzidos = data.items.map((item) => ({
        id: item.item_id,
        nome: item.name,
        sku: item.sku,
        quantidade: item.stock_on_hand || 0,
        precoCusto: item.purchase_rate || 0,
        precoVenda: item.rate || 0,
        estoqueBaixo: item.reorder_level || 5,
      }));

      setProdutos(produtosTraduzidos);
    } catch (erro) {
      console.error("Erro ao buscar produtos do Zoho:", erro);
    } finally {
      setCarregando(false);
    }
  };

  const adicionarProduto = async (novoProduto) => {
    try {
      const payloadZoho = {
        name: novoProduto.nome,
        sku: novoProduto.sku,
        rate: Number(novoProduto.precoVenda),
        purchase_rate: Number(novoProduto.precoCusto),
        reorder_level: Number(novoProduto.estoqueBaixo),
        item_type: "inventory", // Avisa ao Zoho que é um produto de estoque físico
      };

      const data = await fetchZoho("/items", {
        method: "POST",
        body: JSON.stringify(payloadZoho),
      });

      if (data.code === 0) {
        carregarProdutos(); // Recarrega a lista para mostrar o novo produto
        return true;
      }
    } catch (erro) {
      console.error("Erro ao cadastrar no Zoho:", erro);
      return false;
    }
  };

  const atualizarProduto = async (produtoAtualizado) => {
    try {
      const payloadZoho = {
        name: produtoAtualizado.nome,
        sku: produtoAtualizado.sku,
        rate: Number(produtoAtualizado.precoVenda),
        purchase_rate: Number(produtoAtualizado.precoCusto),
        reorder_level: Number(produtoAtualizado.estoqueBaixo),
      };

      const data = await fetchZoho(`/items/${produtoAtualizado.id}`, {
        method: "PUT",
        body: JSON.stringify(payloadZoho),
      });

      if (data.code === 0) {
        carregarProdutos(); // Recarrega a lista com os dados novos
        return true;
      }
    } catch (erro) {
      console.error("Erro ao atualizar no Zoho:", erro);
      return false;
    }
  };

  const excluirProduto = async (id) => {
    try {
      const data = await fetchZoho(`/items/${id}`, {
        method: "DELETE",
      });

      if (data.code === 0) {
        carregarProdutos(); // Atualiza a tela tirando o card apagado
        return true;
      }
    } catch (erro) {
      console.error("Erro ao excluir no Zoho:", erro);
      return false;
    }
  };
  return {
    produtos,
    carregando,
    adicionarProduto,
    atualizarProduto,
    excluirProduto,
  };
}

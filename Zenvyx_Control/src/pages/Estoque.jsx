import { useState } from 'react';
import { useProdutos } from '../hooks/useProdutos';
import FormularioProduto from '../components/FormularioProduto';

function Estoque() {
  const { produtos, carregando, adicionarProduto, atualizarProduto, excluirProduto } = useProdutos();
  const [mostrandoFormulario, setMostrandoFormulario] = useState(false);
  const [produtoParaEditar, setProdutoParaEditar] = useState(null);

  // Função para salvar (decide se cria um novo ou atualiza um existente)
  const handleSalvar = async (dadosProduto) => {
    try {
      if (produtoParaEditar) {
        await atualizarProduto(dadosProduto);
      } else {
        await adicionarProduto(dadosProduto);
      }
      setMostrandoFormulario(false);
      setProdutoParaEditar(null);
    } catch (error) {
      console.error("Erro ao salvar:", error);
      alert("Erro ao salvar o produto.");
    }
  };

  const handleEditar = (produto) => {
    setProdutoParaEditar(produto);
    setMostrandoFormulario(true);
  };

  const handleCancelar = () => {
    setMostrandoFormulario(false);
    setProdutoParaEditar(null);
  };

  if (carregando) return <div className="carregando">Carregando inventário...</div>;

  return (
    <div className="container-estoque fade-in">
      <header className="estoque-header">
        <div>
          <h1>Gerenciamento de Estoque</h1>
          <p>Consulte, edite ou adicione novos itens ao seu catálogo.</p>
        </div>
        
        {/* O botão some quando o formulário está aberto para não confundir */}
        {!mostrandoFormulario && (
          <button 
            onClick={() => setMostrandoFormulario(true)} 
            className="btn-primario"
          >
            + Novo Produto
          </button>
        )}
      </header>

      {mostrandoFormulario ? (
        <FormularioProduto 
          onSalvar={handleSalvar} 
          onCancelar={handleCancelar}
          produtoParaEditar={produtoParaEditar}
        />
      ) : (
        <>
          {produtos.length === 0 ? (
            /* --- TELA DE ESTOQUE VAZIO --- */
            <div className="container-vazio">
              <div className="ilustracao-vazia">📦</div>
              <h2>Seu inventário está pronto!</h2>
              <p>Parece que você ainda não tem itens cadastrados no Zenvyx Control.</p>
              <button 
                onClick={() => setMostrandoFormulario(true)} 
                className="btn-vazio-pro"
              >
                + Adicionar Meu Primeiro Produto
              </button>
            </div>
          ) : (
            /* --- GRADE DE PRODUTOS (CARDS) --- */
            <div className="grade-produtos">
              {produtos.map(produto => (
                <div 
                  key={produto.id} 
                  className={`card-produto ${produto.quantidade <= (produto.estoqueBaixo || 5) ? 'alerta-estoque' : ''}`}
                >
                  <div className="card-corpo">
                    <div className="card-cabecalho">
                      <h3>{produto.nome}</h3>
                      <span className="sku-tag">{produto.sku}</span>
                    </div>
                    
                    <div className="info-precos">
                      <div className="preco-item">
                        <label>Venda</label>
                        <span>R$ {Number(produto.precoVenda).toFixed(2)}</span>
                      </div>
                      <div className="separador"></div>
                      <div className="estoque-item">
                        <label>Estoque</label>
                        <span className="qtd">{produto.quantidade} un.</span>
                      </div>
                    </div>
                  </div>
                  
                  <footer className="card-acoes">
                    <button onClick={() => handleEditar(produto)} className="btn-editar">
                      ✏️ Editar
                    </button>
                    <button onClick={() => excluirProduto(produto.id)} className="btn-excluir">
                      🗑️ Excluir
                    </button>
                  </footer>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default Estoque;
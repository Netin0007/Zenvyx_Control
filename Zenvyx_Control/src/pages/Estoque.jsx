import { useState } from 'react';
import { useProdutos } from '../hooks/useProdutos';
import FormularioProduto from '../components/FormularioProduto';

function Estoque() {
  const { produtos, carregando, adicionarProduto, atualizarProduto, excluirProduto } = useProdutos();
  const [mostrandoFormulario, setMostrandoFormulario] = useState(false);
  const [produtoParaEditar, setProdutoParaEditar] = useState(null);

  const handleSalvar = async (dadosProduto) => {
    if (produtoParaEditar) {
      await atualizarProduto(dadosProduto);
    } else {
      await adicionarProduto(dadosProduto);
    }
    setMostrandoFormulario(false);
    setProdutoParaEditar(null);
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
        
        {/* Botão de topo que só aparece se já tiver produtos na lista */}
        {produtos.length > 0 && !mostrandoFormulario && (
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
            /* --- TELA DE ESTOQUE VAZIO BONITONA --- */
            <div className="container-vazio">
              <div className="ilustracao-vazia">📦</div>
              <h2>Seu inventário está pronto!</h2>
              <p>Parece que você ainda não tem itens cadastrados. Vamos adicionar o primeiro?</p>
              <button 
                onClick={() => setMostrandoFormulario(true)} 
                className="btn-vazio-pro"
              >
                + Adicionar Meu Primeiro Produto
              </button>
            </div>
          ) : (
            /* --- GRADE DE PRODUTOS --- */
            <div className="grade-produtos">
              {produtos.map(produto => (
                <div key={produto.id} className={`card-produto ${produto.quantidade <= produto.estoqueBaixo ? 'alerta-estoque' : ''}`}>
                  <div className="card-corpo">
                    <h3>{produto.nome}</h3>
                    <span className="sku-tag">{produto.sku}</span>
                    
                    <div className="info-precos">
                      <div className="preco">
                        <label>Venda</label>
                        <span>R$ {Number(produto.precoVenda).toFixed(2)}</span>
                      </div>
                      <div className="estoque-status">
                        <label>Estoque</label>
                        <span className="qtd">{produto.quantidade} un.</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="card-acoes">
                    <button onClick={() => handleEditar(produto)} className="btn-editar">Editar</button>
                    <button onClick={() => excluirProduto(produto.id)} className="btn-excluir">Excluir</button>
                  </div>
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
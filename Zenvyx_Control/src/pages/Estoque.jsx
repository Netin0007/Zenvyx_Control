import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Plus, AlertTriangle, Check, XCircle } from 'lucide-react';

function Estoque() {
  const navigate = useNavigate();
  const [produtos, setProdutos] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);
  const [busca, setBusca] = useState('');
  const [categoria, setCategoria] = useState('');
  const [situacao, setSituacao] = useState('');

  useEffect(() => {
    // Carrega catálogo de produtos ao abrir a tela.
    carregarProdutos();
  }, []);

  const carregarProdutos = async () => {
    try {
      setCarregando(true);
      const response = await fetch('http://localhost:3001/api/produtos');
      if (!response.ok) throw new Error('Erro ao carregar produtos');
      const data = await response.json();
      setProdutos(data);
      setErro(null);
    } catch (erro) {
      console.error('Erro:', erro);
      setErro('Erro ao carregar dados. Verifique se o backend está rodando.');
      // Fallback para manter usabilidade da tela sem dependência do backend.
      setProdutos([
        { id: 1, nome: 'Mouse Wireless Logitech', sku: 'ELE-001', quantidade: 45, precoVenda: 89.90, categoria: 'Eletrônicos', estoqueBaixo: 10 },
        { id: 2, nome: 'Teclado Mecânico RGB', sku: 'ELE-002', quantidade: 23, precoVenda: 349.90, categoria: 'Eletrônicos', estoqueBaixo: 10 },
        { id: 3, nome: 'Café Espresso Premium 500g', sku: 'ALI-001', quantidade: 8, precoVenda: 32.90, categoria: 'Alimentos', estoqueBaixo: 10 },
        { id: 4, nome: 'Água Mineral 500ml (Pack 12un)', sku: 'BEB-001', quantidade: 0, precoVenda: 18.90, categoria: 'Bebidas', estoqueBaixo: 10 },
        { id: 5, nome: 'Detergente Líquido 500ml', sku: 'LIM-001', quantidade: 0, precoVenda: 5.00, categoria: 'Limpeza', estoqueBaixo: 5 },
        { id: 6, nome: 'Papel A4 Resma 500 folhas', sku: 'ESC-001', quantidade: 25, precoVenda: 22.50, categoria: 'Escritório', estoqueBaixo: 5 },
        { id: 7, nome: 'Monitor LED 24"', sku: 'ELE-003', quantidade: 3, precoVenda: 899.90, categoria: 'Eletrônicos', estoqueBaixo: 2 },
        { id: 8, nome: 'Webcam Full HD', sku: 'ELE-004', quantidade: 12, precoVenda: 249.90, categoria: 'Eletrônicos', estoqueBaixo: 4 }
      ]);
    } finally {
      setCarregando(false);
    }
  };

  // Aplica filtros combinando texto, categoria e situação de estoque.
  const produtosFiltrados = produtos.filter(p => {
    const matchBusca = busca === '' || 
      p.nome.toLowerCase().includes(busca.toLowerCase()) ||
      p.sku.toLowerCase().includes(busca.toLowerCase()) ||
      (p.descricao && p.descricao.toLowerCase().includes(busca.toLowerCase()));
    
    const matchCategoria = categoria === '' || p.categoria === categoria;
    
    let matchSituacao = true;
    if (situacao === 'em-estoque') matchSituacao = p.quantidade > 0;
    if (situacao === 'baixo-estoque') matchSituacao = p.quantidade > 0 && p.quantidade <= (p.estoqueBaixo || 10);
    if (situacao === 'sem-estoque') matchSituacao = p.quantidade === 0;
    
    return matchBusca && matchCategoria && matchSituacao;
  });

  // Gera lista de categorias únicas para o seletor.
  const categorias = [...new Set(produtos.map(p => p.categoria))].sort();

  // Determina estado visual do card de acordo com saldo e limite mínimo.
  const obterStatus = (quantidade, estoqueBaixo) => {
    if (quantidade === 0) return { texto: 'Sem estoque', cor: 'danger', pct: 0 };
    if (quantidade <= (estoqueBaixo || 10)) return { texto: 'Estoque baixo', cor: 'warning', pct: Math.min(100, (quantidade / (estoqueBaixo || 10)) * 100) };
    return { texto: 'Em estoque', cor: 'success', pct: 100 };
  };

  if (carregando) {
    return <div className="page-container">Carregando...</div>;
  }

  return (
    <div className="estoque-page">
      {/* Header */}
      <div className="estoque-header">
        <div>
          <h1>Produtos</h1>
          <p className="estoque-subtitle">{produtosFiltrados.length} de {produtos.length} produtos</p>
        </div>
        <button className="btn-novo-produto" onClick={() => navigate('/novo-produto')}>
          <Plus size={20} />
          Novo Produto
        </button>
      </div>

      {/* Erro (se houver) */}
      {erro && <div className="alert-erro">{erro}</div>}

      {/* Busca e Filtros */}
      <div className="filtros-container">
        <div className="search-box">
          <Search size={20} />
          <input
            type="text"
            placeholder="Buscar por nome, SKU, descrição..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
          />
        </div>

        <select 
          className="filtro-select"
          value={categoria}
          onChange={(e) => setCategoria(e.target.value)}
        >
          <option value="">Todas as categorias</option>
          {categorias.map(cat => <option key={cat} value={cat}>{cat}</option>)}
        </select>

        <select 
          className="filtro-select"
          value={situacao}
          onChange={(e) => setSituacao(e.target.value)}
        >
          <option value="">Todas as situações</option>
          <option value="em-estoque">Em estoque</option>
          <option value="baixo-estoque">Estoque baixo</option>
          <option value="sem-estoque">Sem estoque</option>
        </select>
      </div>

      {/* Grid de Produtos */}
      {produtosFiltrados.length === 0 ? (
        <div className="empty-state">
          <AlertTriangle size={48} />
          <h2>Nenhum produto encontrado</h2>
          <p>Tente ajustar seus filtros ou criar um novo produto</p>
        </div>
      ) : (
        <div className="produtos-grid">
          {produtosFiltrados.map(produto => {
            const status = obterStatus(produto.quantidade, produto.estoqueBaixo);
            return (
              <div key={produto.id} className={`produto-card status-${status.cor}`}>
                {status.texto === 'Sem estoque' && (
                  <div className="badge-alerta">
                    <AlertTriangle size={14} />
                  </div>
                )}
                
                <div className="produto-header">
                  <h3>{produto.nome}</h3>
                  <span className="sku">{produto.sku}</span>
                </div>

                <div className="produto-categoria">
                  {produto.categoria}
                </div>

                <div className="produto-estoque">
                  <div className="estoque-info">
                    <span className={`status-badge status-${status.cor}`}>
                      {status.texto === 'Sem estoque' && <XCircle size={16} />}
                      {status.texto === 'Estoque baixo' && <AlertTriangle size={16} />}
                      {status.texto === 'Em estoque' && <Check size={16} />}
                      {' '}{status.texto}
                    </span>
                    <span className="quantidade">{produto.quantidade}un</span>
                  </div>
                  <div className={`progress-bar status-${status.cor}`}>
                    <div 
                      className="progress-fill"
                      style={{ width: `${status.pct}%` }}
                    />
                  </div>
                </div>

                <div className="produto-footer">
                  <span className="label">Preço de venda</span>
                  <span className="preco">R$ {produto.precoVenda.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default Estoque;

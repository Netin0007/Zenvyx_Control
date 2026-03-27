import { useState, useEffect } from 'react';
import { Package, DollarSign, AlertCircle, TrendingDown, TrendingUp } from 'lucide-react';

function Dashboard() {
  const [produtos, setProdutos] = useState([]);
  const [movimentacoes, setMovimentacoes] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);

  useEffect(() => {
    // Carrega dados iniciais apenas no primeiro render.
    carregarDados();
  }, []);

  const carregarDados = async () => {
    try {
      setCarregando(true);
      // Busca produtos e movimentações em paralelo para reduzir tempo de carregamento.
      const [prodRes, movRes] = await Promise.all([
        fetch('http://localhost:3001/api/produtos'),
        fetch('http://localhost:3001/api/movimentacoes')
      ]);

      if (!prodRes.ok) throw new Error('Erro ao carregar produtos');

      const prodData = await prodRes.json();
      setProdutos(prodData);

      // Carregar movimentações se a requisição for bem-sucedida
      if (movRes.ok) {
        const movData = await movRes.json();
        // Limita no frontend para manter o card enxuto.
        setMovimentacoes(movData.slice(0, 5));
      }

      setErro(null);
    } catch (erro) {
      console.error('Erro:', erro);
      setErro('Erro ao carregar dados. Verifique se o backend está rodando.');
      // Fallback local para manter a página demonstrável sem backend.
      setProdutos([
        {
          id: 1,
          nome: 'Detergente Líquido 500ml',
          sku: 'LIM-001',
          quantidade: 0,
          precoCusto: 2.50,
          precoVenda: 5.00,
          estoqueBaixo: 5
        },
        {
          id: 2,
          nome: 'Café Espresso Premium 500g',
          sku: 'CAF-001',
          quantidade: 8,
          precoCusto: 15.00,
          precoVenda: 29.90,
          estoqueBaixo: 10
        },
        {
          id: 3,
          nome: 'Refrigerante Cola 2L',
          sku: 'REF-001',
          quantidade: 5,
          precoCusto: 4.50,
          precoVenda: 8.90,
          estoqueBaixo: 8
        },
        {
          id: 4,
          nome: 'Mouse Wireless Logitech',
          sku: 'MOU-001',
          quantidade: 2,
          precoCusto: 45.00,
          precoVenda: 89.90,
          estoqueBaixo: 3
        },
        {
          id: 5,
          nome: 'Teclado Mecânico RGB',
          sku: 'TEC-001',
          quantidade: 15,
          precoCusto: 150.00,
          precoVenda: 299.90,
          estoqueBaixo: 5
        },
        {
          id: 6,
          nome: 'Monitor LED 24"',
          sku: 'MON-001',
          quantidade: 3,
          precoCusto: 450.00,
          precoVenda: 899.90,
          estoqueBaixo: 2
        },
        {
          id: 7,
          nome: 'Headfone Gamer',
          sku: 'HEAD-001',
          quantidade: 10,
          precoCusto: 80.00,
          precoVenda: 199.90,
          estoqueBaixo: 5
        },
        {
          id: 8,
          nome: 'Webcam Full HD',
          sku: 'WEB-001',
          quantidade: 12,
          precoCusto: 120.00,
          precoVenda: 249.90,
          estoqueBaixo: 4
        }
      ]);
      setMovimentacoes([]);
    } finally {
      setCarregando(false);
    }
  };

  // Cálculos de estatísticas
  const totalProdutos = produtos.length;
  // Soma valor de custo para estimar capital imobilizado em estoque.
  const valorEmEstoque = produtos.reduce((acc, p) => acc + (p.precoCusto * p.quantidade), 0);
  const produtosBaixo = produtos.filter(p => p.quantidade > 0 && p.quantidade <= (p.estoqueBaixo || 5)).length;
  const produtosSemEstoque = produtos.filter(p => p.quantidade === 0).length;

  // Consolida alertas críticos (zerado) e de atenção (baixo estoque).
  const alertas = produtos.filter(p => p.quantidade === 0 || p.quantidade <= (p.estoqueBaixo || 5));

  // Formatar data e hora
  const formatarData = (data) => {
    const d = new Date(data);
    return d.toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (carregando) {
    return <div className="page-container">Carregando...</div>;
  }

  return (
    <div className="dashboard-page">
      {/* Header */}
      <div className="dashboard-header">
        <div>
          <h1>Dashboard</h1>
          <p>Visão geral do seu estoque</p>
        </div>
      </div>

      {/* Erro (se houver) */}
      {erro && (
        <div className="alert-erro">
          {erro}
        </div>
      )}

      {/* Cards de Estatísticas */}
      <div className="stats-grid">
        <div className="stat-card stat-blue">
          <div className="stat-icon"><Package size={32} /></div>
          <div className="stat-content">
            <span className="stat-label">TOTAL DE PRODUTOS</span>
            <span className="stat-value">{totalProdutos}</span>
          </div>
        </div>

        <div className="stat-card stat-green">
          <div className="stat-icon"><DollarSign size={32} /></div>
          <div className="stat-content">
            <span className="stat-label">VALOR EM ESTOQUE</span>
            <span className="stat-value">R$ {valorEmEstoque.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
          </div>
        </div>

        <div className="stat-card stat-orange">
          <div className="stat-icon"><AlertCircle size={32} /></div>
          <div className="stat-content">
            <span className="stat-label">ESTOQUE BAIXO</span>
            <span className="stat-value">{produtosBaixo}</span>
          </div>
        </div>

        <div className="stat-card stat-red">
          <div className="stat-icon"><TrendingDown size={32} /></div>
          <div className="stat-content">
            <span className="stat-label">SEM ESTOQUE</span>
            <span className="stat-value">{produtosSemEstoque}</span>
          </div>
        </div>
      </div>

      {/* Alertas de Estoque */}
      <div className="alertas-section">
        <h2>Alertas de Estoque</h2>
        {alertas.length === 0 ? (
          <p style={{ color: '#64748b', textAlign: 'center', padding: '20px' }}>Nenhum alerta de estoque</p>
        ) : (
          <div className="alertas-container">
            {alertas.filter(p => p.quantidade === 0).length > 0 && (
              <div className="alerta-box alerta-critico">
                <div className="alerta-header">
                  <AlertCircle size={20} />
                  <span className="alerta-titulo">{alertas.filter(p => p.quantidade === 0).length} produto(s) sem estoque</span>
                </div>
                {alertas.filter(p => p.quantidade === 0).map(p => (
                  <div key={p.id} className="alerta-item">
                    {p.nome} • <span className="alerta-sku">{p.sku}</span>
                  </div>
                ))}
              </div>
            )}

            {alertas.filter(p => p.quantidade > 0 && p.quantidade <= (p.estoqueBaixo || 5)).length > 0 && (
              <div className="alerta-box alerta-aviso">
                <div className="alerta-header">
                  <AlertCircle size={20} />
                  <span className="alerta-titulo">{alertas.filter(p => p.quantidade > 0).length} produto(s) com estoque baixo</span>
                </div>
                {alertas.filter(p => p.quantidade > 0).map(p => (
                  <div key={p.id} className="alerta-item">
                    {p.nome} • <span className="alerta-texto">{p.quantidade} un restantes</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Movimentações Recentes */}
      <div className="movimentacoes-section">
        <div className="movimentacoes-header">
          <h2>Movimentações Recentes</h2>
          <a href="/movimentacao" className="ver-mais">Ver todas</a>
        </div>
        <div className="movimentacoes-list">
          {movimentacoes.length === 0 ? (
            <p style={{ color: '#64748b', textAlign: 'center', padding: '20px' }}>Nenhuma movimentação registrada</p>
          ) : (
            movimentacoes.map((mov) => (
              <div key={mov.id} className={`movimento-item mov-${mov.tipo}`}>
                <div className="movimento-icon">
                  {mov.tipo === 'entrada' ? <TrendingUp size={24} /> : <TrendingDown size={24} />}
                </div>
                <div className="movimento-info">
                  <div className="movimento-nome">{mov.nomeProduto}</div>
                  <div className="movimento-tipo">{mov.motivo || '-'}</div>
                </div>
                <div className="movimento-dados">
                  <div className={`movimento-qtd mov-${mov.tipo}`}>
                    {mov.tipo === 'entrada' ? '+' : '-'}{mov.quantidade}
                  </div>
                  <div className="movimento-data">{formatarData(mov.dataMov)}</div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;

import { useProdutos } from '../hooks/useProdutos';
import { Link } from 'react-router-dom';

function Dashboard() {
  const { produtos } = useProdutos();
  
  const totalProdutos = produtos.length;
  const estoqueBaixo = produtos.filter(p => p.quantidade <= p.estoqueBaixo).length;

  return (
    <div className="fade-in">
      <header className="dashboard-header">
        <h2>Visão Geral do Negócio</h2>
        <p>Bem-vindo ao painel de controle do Zenvyx.</p>
      </header>

      <div className="grid-stats">
        <div className="card-stat">
          <div className="icon">📦</div>
          <div>
            <h3>Total de Itens</h3>
            <p className="valor">{totalProdutos}</p>
          </div>
        </div>

        <div className="card-stat alerta">
          <div className="icon">⚠️</div>
          <div>
            <h3>Estoque Baixo</h3>
            <p className="valor">{estoqueBaixo}</p>
          </div>
        </div>

        <div className="card-stat info">
          <div className="icon">💰</div>
          <div>
            <h3>Valor em Estoque</h3>
            <p className="valor">
              R$ {produtos.reduce((acc, p) => acc + (p.precoCusto * p.quantidade), 0).toFixed(2)}
            </p>
          </div>
        </div>
      </div>

      <div className="dashboard-actions">
        <Link title="Ir para o estoque" to="/estoque" className="btn-primario">
          Gerenciar Estoque →
        </Link>
      </div>
    </div>
  );
}

export default Dashboard;
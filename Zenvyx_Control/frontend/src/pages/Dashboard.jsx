import { useProdutos } from '../hooks/useProdutos';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const { produtos, carregando } = useProdutos();

  if (carregando) return <p>Carregando dados...</p>;

  const totalProdutos = produtos.length;
  const estoqueBaixo = produtos.filter(p => p.quantidade <= (p.estoqueBaixo || 5)).length;

  return (
    <div className="dashboard-container">
      <h2>Visão Geral do Negócio</h2>
      
      <div className="form-grid">
        <div className="card-produto">
          <h3>Total de Produtos no Catálogo</h3>
          <p className="preco">{totalProdutos}</p>
        </div>
        <div className="card-produto alerta-estoque">
          <h3>Alertas de Estoque Baixo</h3>
          <p className="preco" style={{ color: '#d35400' }}>{estoqueBaixo}</p>
        </div>
      </div>

      <div style={{ marginTop: '30px' }}>
        <Link to="/estoque" className="btn-novo-produto" style={{ textDecoration: 'none', display: 'inline-block' }}>
          Gerenciar Estoque ➔
        </Link>
      </div>
    </div>
  );
}   
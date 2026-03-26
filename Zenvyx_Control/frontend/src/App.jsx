import { Routes, Route, Link } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Estoque from './pages/Estoque';
import './styles/App.css';

function App() {
  return (
    <div className="app-container">
      {/* Menu de Navegação */}
      <nav className="navbar">
        <h1>Zenvyx Control</h1>
        <div className="nav-links">
          <Link to="/">Dashboard</Link>
          <Link to="/estoque">Meu Estoque</Link>
        </div>
      </nav>

      {/* Onde as telas vão aparecer */}
      <main className="conteudo-principal">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/estoque" element={<Estoque />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
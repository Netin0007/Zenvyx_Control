import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Estoque from './pages/Estoque';

// 🚨 A MÁGICA ACONTECE AQUI: Ligando a "roupa" ao site
import './styles/App.css';

function App() {
  return (
    <Router>
      <div className="app-container">
        {/* Barra de Navegação Superior */}
        <nav className="navbar">
          <h1>Zenvyx Control</h1>
          <div className="nav-links">
            <Link to="/">Dashboard</Link>
            <Link to="/estoque">Meu Estoque</Link>
          </div>
        </nav>

        {/* Onde as páginas vão aparecer */}
        <main>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/estoque" element={<Estoque />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
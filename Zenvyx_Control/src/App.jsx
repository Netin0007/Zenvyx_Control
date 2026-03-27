import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Estoque from './pages/Estoque';
import Movimentacao from './pages/Movimentacao';
import NovoProduto from './pages/NovoProduto';
import Navbar from './components/Navbar';
import './styles/App.css';


function App() {
  return (
    // Router centraliza navegação entre as telas sem recarregar a página.
    <Router>
      <div className='App'>
        <Navbar />
        <div className="app-content">
          {/* Mapeamento das rotas principais do sistema. */}
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/estoque" element={<Estoque />} />
            <Route path="/movimentacao" element={<Movimentacao />} />
            <Route path="/novo-produto" element={<NovoProduto />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
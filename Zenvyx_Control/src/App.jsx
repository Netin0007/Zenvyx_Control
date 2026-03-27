import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Estoque from './pages/Estoque';
import Navbar from './components/Navbar';
import './styles/App.css';


function App() {
  return (
    <Router>
      <div className='App'>
        <Navbar />
        <div className="app-content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/estoque" element={<Estoque />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
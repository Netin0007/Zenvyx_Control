
import { LayoutDashboard, Package, ArrowRightLeft, PlusCircle } from 'lucide-react';

export default function Navbar() {
  return (
    <nav className="topnav">
      <a href="/" className="topnav-brand">Zenvyx Control</a>
      <ul className="topnav-menu">
        <li>
            <a href="/dashboard" className="nav-item">
              <LayoutDashboard size={20} className="nav-icon" />
              <span className="nav-text">Dashboard</span>
            </a>
        </li>
        <li>
            <a href="/estoque" className="nav-item">
              <Package size={20} className="nav-icon" />
              <span className="nav-text">Estoque</span>
            </a>
        </li>
        <li>
            <a href="/movimentacao" className='nav-item'>
                <ArrowRightLeft size={20} className="nav-icon" />
                <span className="nav-text">Movimentação</span>
            </a>
        </li>
        <li>
            <a href="/novoproduto" className='nav-item'>
            <PlusCircle size={20} className='nav-icon'/>
            <span className='nav-text'>Novo Produto</span>
            </a>
        </li>
      </ul>
    </nav>
  )
}

/**
 * Ponto de entrada da aplicação React
 * Responsável por:
 * - Inicializar a árvore de componentes
 * - Conectar o React ao DOM
 */

// Importa modo estrito do React
import { StrictMode } from 'react';

// Função para criar a raiz da aplicação (React 18+)
import { createRoot } from 'react-dom/client';

// Componente principal da aplicação
import App from './App.jsx';

/**
 * Inicializa a aplicação React
 * - Busca o elemento #root no HTML
 * - Renderiza o componente App dentro dele
 */
createRoot(document.getElementById('root')).render(

  /**
   * StrictMode:
   * - Ativa verificações adicionais em desenvolvimento
   * - Ajuda a identificar problemas e más práticas
   * - NÃO afeta produção
   */
  <StrictMode>
    <App />
  </StrictMode>,
);
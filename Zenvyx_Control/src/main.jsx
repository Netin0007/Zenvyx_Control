import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'

// Ponto de entrada da aplicação React.
ReactDOM.createRoot(document.getElementById('root')).render(
  // StrictMode ajuda a identificar efeitos colaterais durante desenvolvimento.
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
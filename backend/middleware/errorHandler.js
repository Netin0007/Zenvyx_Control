export const errorHandler = (err, req, res, next) => {
  // Log completo no servidor para facilitar diagnóstico.
  console.error(err.stack);

  // Padroniza fallback de status/mensagem para erros não tratados.
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Erro interno do servidor';

  res.status(statusCode).json({
    erro: message,
    status: statusCode,
    timestamp: new Date().toISOString()
  });
};

export const notFoundHandler = (req, res) => {
  // Resposta consistente para rotas inexistentes.
  res.status(404).json({
    erro: 'Rota não encontrada',
    caminho: req.path,
    metodo: req.method
  });
};

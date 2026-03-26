// src/services/api.js
const API_URL = "http://localhost:3001"; // Seu JSON Server

export const fetchZoho = async (endpoint, options = {}) => {
  const url = `${API_URL}${endpoint}`;
  
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  const response = await fetch(url, { ...options, headers });
  
  if (!response.ok) {
    throw new Error('Erro na comunicação com o servidor local');
  }

  return response.json();
};
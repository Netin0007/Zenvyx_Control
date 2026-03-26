// src/services/api.js
const API_URL = "http://localhost:3001"; 

export const fetchZoho = async (endpoint, options = {}) => {
  const url = `${API_URL}${endpoint}`;
  
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  try {
    const response = await fetch(url, { ...options, headers });
    
    if (!response.ok) {
      throw new Error('Servidor local não respondeu corretamente');
    }

    return await response.json();
  } catch (error) {
    console.error("Erro na API Local:", error);
    throw error;
  }
};
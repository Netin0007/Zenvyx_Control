const API_URL = "http://localhost:3001";

const ORG_ID = import.meta.env.VITE_ZOHO_ORG_ID;
const REFRESH_TOKEN = import.meta.env.VITE_ZOHO_REFRESH_TOKEN;
const CLIENT_ID = import.meta.env.VITE_ZOHO_CLIENT_ID;
const CLIENT_SECRET = import.meta.env.VITE_ZOHO_CLIENT_SECRET;

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
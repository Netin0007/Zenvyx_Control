const renovarToken = async () => {
  const url = "https://accounts.zoho.com/oauth/v2/token";
  
  const params = new URLSearchParams({
    refresh_token: "1000.26f098e5ab338e230cd223404e129517.a1c2f49f485083ea6f5a9b2079c72555",
    client_id: "1000.ZVFD3P8BE3F0PMZDK0BSLY9WI0U0RS",
    client_secret: "37a4a64f953cc0959a242bc7784887af0f280e90f5",
    grant_type: "refresh_token"
  });

  try {
    const response = await fetch(`${url}?${params}`, { method: 'POST' });
    const data = await response.json();
    console.log("🔑 SEU NOVO ACCESS TOKEN É:");
    console.log(data.access_token);
  } catch (erro) {
    console.error("Erro:", erro);
  }
};

renovarToken();
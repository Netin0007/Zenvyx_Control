// teste-zoho.js
const REFRESH_TOKEN = "1000.26f098e5ab338e230cd223404e129517.a1c2f49f485083ea6f5a9b2079c72555";
const CLIENT_ID = "1000.ZVFD3P8BE3F0PMZDK0BSLY9WI0U0RS";
const CLIENT_SECRET = "37a4a64f953cc0959a242bc7784887af0f280e90f5";
const ORG_ID = "919155911";

async function testarZoho() {
  try {
    console.log("⏳ 1. Gerando um token fresquinho...");
    const params = new URLSearchParams({
      refresh_token: REFRESH_TOKEN,
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      grant_type: "refresh_token"
    });

    const resToken = await fetch(`https://accounts.zoho.com/oauth/v2/token?${params}`, { method: 'POST' });
    const dataToken = await resToken.json();
    const accessToken = dataToken.access_token;
    
    console.log("✅ Token gerado com sucesso! Enviando produto para a Zoho...");

    // Aqui não tem Vite, o link vai inteiro e perfeito!
    const urlApi = `https://www.zohoapis.com/inventory/v1/items?organization_id=${ORG_ID}`;
    
    const payloadProduto = {
      name: "Produto Teste Terminal",
      sku: "TESTE-001",
      rate: 50.00,
      item_type: "inventory"
    };

    const resApi = await fetch(urlApi, {
      method: 'POST',
      headers: {
        'Authorization': `Zoho-oauthtoken ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payloadProduto)
    });

    const dataApi = await resApi.json();
    console.log("🔥 RESPOSTA DA ZOHO:");
    console.log(dataApi);

  } catch (erro) {
    console.error("❌ Deu erro no script:", erro);
  }
}

testarZoho();
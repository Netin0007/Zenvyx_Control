import { useState, useEffect } from 'react';
import { Search, Filter, TrendingUp, TrendingDown, Calendar, Plus, X, DollarSign } from 'lucide-react';

function Movimentacao() {
  const [movimentacoes, setMovimentacoes] = useState([]);
  const [produtos, setProdutos] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);
  const [busca, setBusca] = useState('');
  const [tipo, setTipo] = useState('');
  const [dataInicio, setDataInicio] = useState('');
  const [dataFim, setDataFim] = useState('');
  const [showNovaMovModal, setShowNovaMovModal] = useState(false);
  const [formData, setFormData] = useState({
    produtoId: '',
    tipo: 'entrada',
    quantidade: 0,
    motivo: ''
  });
  const [carregandoForm, setCarregandoForm] = useState(false);
  const [erroForm, setErroForm] = useState(null);

  useEffect(() => {
    // Carrega histórico e catálogo de produtos ao entrar na página.
    carregarDados();
  }, []);

  const carregarDados = async () => {
    try {
      setCarregando(true);
      // Requisições em paralelo para reduzir latência na abertura da tela.
      const [movRes, prodRes] = await Promise.all([
        fetch('http://localhost:3001/api/movimentacoes'),
        fetch('http://localhost:3001/api/produtos')
      ]);

      if (!movRes.ok || !prodRes.ok) throw new Error('Erro ao carregar');

      const movData = await movRes.json();
      const prodData = await prodRes.json();

      setMovimentacoes(movData);
      setProdutos(prodData);
      setErro(null);
    } catch (erro) {
      console.error('Erro:', erro);
      setErro('Erro ao carregar dados. Verifique se o backend está rodando.');
      setMovimentacoes([]);
      setProdutos([]);
    } finally {
      setCarregando(false);
    }
  };

  // Filtros combinam busca textual, tipo da movimentação e intervalo de datas.
  const movimentacoesFiltradas = movimentacoes.filter(m => {
    const matchBusca = busca === '' ||
      m.nomeProduto.toLowerCase().includes(busca.toLowerCase()) ||
      m.sku.toLowerCase().includes(busca.toLowerCase());

    const matchTipo = tipo === '' || m.tipo === tipo;

    let matchData = true;
    if (dataInicio || dataFim) {
      const dataMov = new Date(m.dataMov);
      if (dataInicio) {
        matchData = matchData && dataMov >= new Date(dataInicio);
      }
      if (dataFim) {
        matchData = matchData && dataMov <= new Date(dataFim + 'T23:59:59');
      }
    }

    return matchBusca && matchTipo && matchData;
  });

  // Indicadores agregados da visão atual filtrada.
  const totalEntrada = movimentacoesFiltradas
    .filter(m => m.tipo === 'entrada')
    .reduce((acc, m) => acc + m.quantidade, 0);

  const totalSaida = movimentacoesFiltradas
    .filter(m => m.tipo === 'saida')
    .reduce((acc, m) => acc + m.quantidade, 0);

  const saldo = totalEntrada - totalSaida;

  // Format data
  const formatarData = (data) => {
    const d = new Date(data);
    return d.toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleChangeForm = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'quantidade' ? parseInt(value) || 0 : value
    }));
  };

  const handleSubmitForm = async (e) => {
    e.preventDefault();
    setErroForm(null);

    if (!formData.produtoId || !formData.quantidade) {
      setErroForm('Selecione um produto e insira uma quantidade');
      return;
    }

    try {
      setCarregandoForm(true);
      // Cria movimentação no backend, que também atualiza o saldo do produto.
      const response = await fetch('http://localhost:3001/api/movimentacoes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.erro || 'Erro ao criar movimentação');
      }

      // Recarrega lista para refletir estado persistido no banco.
      await carregarDados();
      
      // Reseta formulário para a próxima operação.
      setFormData({ produtoId: '', tipo: 'entrada', quantidade: 0, motivo: '' });
      setShowNovaMovModal(false);
    } catch (erro) {
      console.error('Erro:', erro);
      setErroForm(erro.message);
    } finally {
      setCarregandoForm(false);
    }
  };

  if (carregando) {
    return <div className="page-container">Carregando...</div>;
  }

  return (
    <div className="movimentacao-page">
      {/* Header */}
      <div className="movimentacao-header">
        <div>
          <h1>Movimentações</h1>
          <p className="movimentacao-subtitle">Histórico de entradas e saídas do estoque</p>
        </div>
        <button className="btn-nova-mov" onClick={() => setShowNovaMovModal(true)}>
          <Plus size={20} />
          Nova Movimentação
        </button>
      </div>

      {/* Erro (se houver) */}
      {erro && (
        <div className="alert-erro" style={{ marginBottom: '20px' }}>
          {erro}
        </div>
      )}

      {/* Cards de Resumo */}
      <div className="resumo-grid">
        <div className="resumo-card resumo-entrada">
          <div className="resumo-icon">
            <TrendingUp size={32} />
          </div>
          <div className="resumo-content">
            <span className="resumo-label">Total Entrada</span>
            <span className="resumo-valor">{totalEntrada}</span>
            <span className="resumo-unidade">unidades</span>
          </div>
        </div>

        <div className="resumo-card resumo-saida">
          <div className="resumo-icon">
            <TrendingDown size={32} />
          </div>
          <div className="resumo-content">
            <span className="resumo-label">Total Saída</span>
            <span className="resumo-valor">{totalSaida}</span>
            <span className="resumo-unidade">unidades</span>
          </div>
        </div>

        <div className="resumo-card resumo-saldo">
          <div className="resumo-icon">
            <DollarSign size={32} />
          </div>
          <div className="resumo-content">
            <span className="resumo-label">Saldo</span>
            <span className="resumo-valor">{saldo}</span>
            <span className="resumo-unidade">unidades</span>
          </div>
        </div>
      </div>

      {/* Filtros */}
      <div className="filtros-container">
        <div className="search-box">
          <Search size={20} />
          <input
            type="text"
            placeholder="Buscar por produto ou SKU..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
          />
        </div>

        <select
          className="filtro-select"
          value={tipo}
          onChange={(e) => setTipo(e.target.value)}
        >
          <option value="">Todos os tipos</option>
          <option value="entrada">Entrada</option>
          <option value="saida">Saída</option>
        </select>

        <div className="filtro-data">
          <input
            type="date"
            value={dataInicio}
            onChange={(e) => setDataInicio(e.target.value)}
            placeholder="Data início"
          />
          <span className="data-separador">até</span>
          <input
            type="date"
            value={dataFim}
            onChange={(e) => setDataFim(e.target.value)}
            placeholder="Data fim"
          />
        </div>
      </div>

      {/* Lista de Movimentações */}
      {movimentacoesFiltradas.length === 0 ? (
        <div className="empty-state">
          <Filter size={48} />
          <h2>Nenhuma movimentação encontrada</h2>
          <p>Tente ajustar seus filtros ou criar uma nova movimentação</p>
        </div>
      ) : (
        <div className="movimentacoes-table">
          <div className="table-header">
            <div className="col-tipo">Tipo</div>
            <div className="col-produto">Produto</div>
            <div className="col-quantidade">Quantidade</div>
            <div className="col-motivo">Motivo</div>
            <div className="col-data">Data/Hora</div>
          </div>

          <div className="table-body">
            {movimentacoesFiltradas.map((mov) => (
              <div key={mov.id} className={`table-row mov-${mov.tipo}`}>
                <div className="col-tipo">
                  <div className={`tipo-badge tipo-${mov.tipo}`}>
                    {mov.tipo === 'entrada' ? (
                      <>
                        <TrendingUp size={16} />
                        <span>Entrada</span>
                      </>
                    ) : (
                      <>
                        <TrendingDown size={16} />
                        <span>Saída</span>
                      </>
                    )}
                  </div>
                </div>
                <div className="col-produto">
                  <div className="produto-info">
                    <div className="produto-nome">{mov.nomeProduto}</div>
                    <div className="produto-sku">{mov.sku}</div>
                  </div>
                </div>
                <div className="col-quantidade">
                  <span className={`quantidade-valor qtd-${mov.tipo}`}>
                    {mov.tipo === 'entrada' ? '+' : '-'}{mov.quantidade}
                  </span>
                </div>
                <div className="col-motivo">
                  <span className="motivo-texto">{mov.motivo || '-'}</span>
                </div>
                <div className="col-data">
                  <div className="data-info">
                    <Calendar size={16} />
                    <span>{formatarData(mov.dataMov)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Rodapé com contagem */}
      {movimentacoesFiltradas.length > 0 && (
        <div className="movimentacoes-footer">
          <p>Exibindo <strong>{movimentacoesFiltradas.length}</strong> movimentação(ões)</p>
        </div>
      )}

      {/* Modal Nova Movimentação */}
      {showNovaMovModal && (
        <div className="modal-overlay" onClick={() => setShowNovaMovModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button 
              className="modal-close" 
              onClick={() => setShowNovaMovModal(false)}
            >
              <X size={24} />
            </button>

            <div className="form-header">
              <h2>Nova Movimentação</h2>
              <p>Registre uma entrada ou saída de produto</p>
            </div>

            {erroForm && (
              <div className="alert-erro" style={{ margin: '0 20px 20px' }}>
                {erroForm}
              </div>
            )}

            <form onSubmit={handleSubmitForm} style={{ padding: '0 20px 20px' }}>
              <div className="form-secao">
                <div className="input-group">
                  <label htmlFor="produtoId">Produto *</label>
                  <select
                    id="produtoId"
                    name="produtoId"
                    value={formData.produtoId}
                    onChange={handleChangeForm}
                    required
                  >
                    <option value="">Selecione um produto</option>
                    {produtos.map(p => (
                      <option key={p.id} value={p.id}>
                        {p.nome} ({p.sku})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-grid">
                <div className="input-group">
                  <label htmlFor="tipo">Tipo *</label>
                  <select
                    id="tipo"
                    name="tipo"
                    value={formData.tipo}
                    onChange={handleChangeForm}
                  >
                    <option value="entrada">Entrada</option>
                    <option value="saida">Saída</option>
                  </select>
                </div>

                <div className="input-group">
                  <label htmlFor="quantidade">Quantidade *</label>
                  <input
                    type="number"
                    id="quantidade"
                    name="quantidade"
                    min="1"
                    value={formData.quantidade}
                    onChange={handleChangeForm}
                    required
                  />
                </div>
              </div>

              <div className="form-secao">
                <div className="input-group">
                  <label htmlFor="motivo">Motivo</label>
                  <input
                    type="text"
                    id="motivo"
                    name="motivo"
                    placeholder="Ex: Compra de fornecedor, Venda, Devolução..."
                    value={formData.motivo}
                    onChange={handleChangeForm}
                  />
                </div>
              </div>

              <div className="form-footer">
                <button 
                  type="button" 
                  className="btn-secundario"
                  onClick={() => setShowNovaMovModal(false)}
                >
                  Cancelar
                </button>
                <button 
                  type="submit" 
                  className="btn-primario"
                  disabled={carregandoForm}
                >
                  {carregandoForm ? 'Registrando...' : 'Registrar Movimentação'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Movimentacao;

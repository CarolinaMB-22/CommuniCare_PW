import { useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { api } from "../../../utils/axios.js";
import "./PendentesPedido.css";
import { FaSearch, FaCubes } from "react-icons/fa";
import HeaderProfileCares from "../../../components/HeaderProfile/headerProfile.js";

import iconFallback from "../../../assets/icon.jpg";

const Search = () => {
  const navigate = useNavigate();

  return (
    <div>
      <div className="mainName">
        <h1>Pedidos Pendentes</h1>
      </div>
      <div className="tabs">
        <div className="choose">
          <button className="tab" onClick={() => navigate("/meusPedidos")}>
            Meus Pedidos
          </button>
          <button className="tab" onClick={() => navigate("/outrosPedidos")}>
            Outros Pedidos
          </button>
          <button className="tab active" onClick={() => navigate("/pendentesPedidos")}>
            Pedidos Pendentes
          </button>
        </div>
        <div className="search-wrapper">
          <input type="text" placeholder="Pesquisar..." className="search" />
          <FaSearch className="search-icon" />
        </div>
      </div>
    </div>
  );
};

const HeaderSecundario = ({ onValidarRequisicao, onValidarAquisicao, onValidarDevolucao }) => {
  return (
    <div className="header-secundario">
      <button className="botao-header-secundario" onClick={onValidarRequisicao}>
        Validar Pedido de Ajuda
      </button>
      <button className="botao-header-secundario" onClick={onValidarAquisicao}>
        Validar Voluntário
      </button>
      <button className="botao-header-secundario" onClick={onValidarDevolucao}>
        Validar Conclusão
      </button>
    </div>
  );
};

const getImagemSrc = (foto) => {
    return foto && foto.trim() && foto !== "null" && foto !== "string"
      ? `data:image/jpeg;base64,${foto}`
      : iconFallback;
  };
  
const ListaPedidos = () => {
  const [pedidos, setPedidos] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPedidos = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await api.get('/PedidosAjuda/Admin/Pendentes', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log("Pedidos pendentes recebidos:", response.data);

        // Fetch photos for each pedido
        const pedidosWithPhotos = await Promise.all(
          response.data.map(async (pedido) => {
            try {
              const photoResponse = await api.get(`/PedidosAjuda/${pedido.pedidoId}/foto-dono`, {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              });
              console.log(`Foto do dono para pedido ${pedido.pedidoId}:`, photoResponse.data);
              return {
                ...pedido,
                fotoDono: photoResponse.data && photoResponse.data.trim() && photoResponse.data !== "null"
                  ? `http://localhost:5182/${photoResponse.data}`
                  : iconFallback,
              };
            } catch (error) {
              console.error(`Erro ao buscar foto do dono para pedido ${pedido.pedidoId}:`, error);
              return { ...pedido, fotoDono: iconFallback };
            }
          })
        );

        setPedidos(pedidosWithPhotos);
      } catch (error) {
        console.error('Erro ao buscar os pedidos pendentes:', error);
      }
    };

    fetchPedidos();
  }, []);

  return (
    <div className="cards">
      {pedidos.map((pedido) => (
        <div className="card" key={pedido.pedidoId}>
          <div className="userTitleOE">
            <img
              className="imgUsers"
              src={pedido.fotoDono}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = iconFallback;
              }}
              alt="Foto do dono"
              width={70}
              height={70}
            />
            <h2>{pedido.titulo}</h2>
          </div>
          <img
            className="imgItemOE"
            src={getImagemSrc(pedido.fotografiaPA)}
            alt={pedido.titulo}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = iconFallback;
            }}
          />
          <p>{pedido.descricao || "Sem descrição disponível."}</p>
          <div className="infoItemOE">
            <span><FaCubes /> Voluntários: {pedido.numeroVoluntarios}</span>
            <span><FaCubes /> Horas: {pedido.nHoras}</span>
          </div>
          <div className="moreInfo">
            <button onClick={() => navigate(`/pedidos/pendentes/mais-info/${pedido.pedidoId}`)}>
              Mais Informações
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

const ListaPedidosAquisicao = () => {
  const [pedidosWithPhotos, setPedidos] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPedidos = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await api.get('/PedidosAjuda/Admin/ObterValidarVoluntariado', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log("Pedidos para validar voluntariado recebidos:", response.data);

        // Fetch photos for each pedido
        const pedidosWithPhotos = await Promise.all(
          response.data.map(async (pedido) => {
            try {
              const photoResponse = await api.get(`/PedidosAjuda/${pedido.pedidoId}/foto-dono`, {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              });
              console.log(`Foto do dono para pedido ${pedido.pedidoId}:`, photoResponse.data);
              return {
                ...pedido,
                fotoDono: photoResponse.data && photoResponse.data.trim() && photoResponse.data !== "null"
                  ? `http://localhost:5182/${photoResponse.data}`
                  : iconFallback,
              };
            } catch (error) {
              console.error(`Erro ao buscar foto do dono para pedido ${pedido.pedidoId}:`, error);
              return { ...pedido, fotoDono: iconFallback };
            }
          })
        );

        setPedidos(pedidosWithPhotos);
      } catch (error) {
        console.error('Erro ao buscar os pedidos:', error);
      }
    };

    fetchPedidos();
  }, []);

  return (
    <div className="cards">
      {pedidosWithPhotos.map((pedido) => (
        <div className="card" key={pedido.pedidoId}>
          <div className="userTitleOE">
            <img
              className="imgUsers"
              src={pedido.fotoDono}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = iconFallback;
              }}
              alt="Foto do dono"
              width={70}
              height={70}
            />
            <h2>{pedido.titulo}</h2>
          </div>
          <img
            className="imgItemOE"
            src={getImagemSrc(pedido.fotografiaPA)}
            alt={pedido.titulo}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = iconFallback;
            }}
          />
          <p>{pedido.descricao || "Sem descrição disponível."}</p>
          <div className="infoItemOE">
            <span><FaCubes /> Voluntários: {pedido.numeroVoluntarios}</span>
            <span><FaCubes /> Horas: {pedido.nHoras}</span>
          </div>
          <div className="moreInfo">
            <button onClick={() => navigate(`/pedidos/pendentes/mais-info2/${pedido.pedidoId}`)}>
              Mais Informações
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

const ListaPedidosDevolucao = () => {
  const [pedidos, setPedidos] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPedidos = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await api.get('/PedidosAjuda/Admin/ObterValidarConclusaoPedido', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log("Pedidos para validar conclusão recebidos:", response.data);

        // Fetch photos for each pedido
        const pedidosWithPhotos = await Promise.all(
          response.data.map(async (pedido) => {
            try {
              const photoResponse = await api.get(`/PedidosAjuda/${pedido.pedidoId}/foto-dono`, {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              });
              console.log(`Foto do dono para pedido ${pedido.pedidoId}:`, photoResponse.data);
              return {
                ...pedido,
                fotoDono: photoResponse.data && photoResponse.data.trim() && photoResponse.data !== "null"
                  ? `http://localhost:5182/${photoResponse.data}`
                  : iconFallback,
              };
            } catch (error) {
              console.error(`Erro ao buscar foto do dono para pedido ${pedido.pedidoId}:`, error);
              return { ...pedido, fotoDono: iconFallback };
            }
          })
        );

        setPedidos(pedidosWithPhotos);
      } catch (error) {
        console.error('Erro ao buscar os pedidos:', error);
      }
    };

    fetchPedidos();
  }, []);

  return (
    <div className="cards">
      {pedidos.map((pedido) => (
        <div className="card" key={pedido.pedidoId}>
          <div className="userTitleOE">
            <img
              className="imgUsers"
              src={pedido.fotoDono}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = iconFallback;
              }}
              alt="Foto do dono"
              width={70}
              height={70}
            />
            <h2>{pedido.titulo}</h2>
          </div>
          <img
            className="imgItemOE"
            src={getImagemSrc(pedido.fotografiaPA)}
            alt={pedido.titulo}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = iconFallback;
            }}
          />
          <p>{pedido.descricao || "Sem descrição disponível."}</p>
          <div className="infoItemOE">
            <span><FaCubes /> Voluntários: {pedido.numeroVoluntarios}</span>
            <span><FaCubes /> Horas: {pedido.nHoras}</span>
          </div>
          <div className="moreInfo">
            <button onClick={() => navigate(`/pedidos/pendentes/mais-info3/${pedido.pedidoId}`)}>
              Mais Informações
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

function PendentesPedidos() {
  const [secaoAtiva, setSecaoAtiva] = useState(null);
  const [reloadKey, setReloadKey] = useState(0);

  const handleClick = (secao) => {
    setSecaoAtiva(secao);
    setReloadKey(prev => prev + 1);
  };

  return (
    <>
      <HeaderProfileCares />
      <Search />
      <HeaderSecundario
        secaoAtiva={secaoAtiva}
        onValidarRequisicao={() => handleClick('validarRequisicao')}
        onValidarAquisicao={() => handleClick('validarAquisicao')}
        onValidarDevolucao={() => handleClick('validarConclusao')}
      />

      {secaoAtiva === 'validarRequisicao' && <ListaPedidos key={`requisicao-${reloadKey}`} />}
      {secaoAtiva === 'validarAquisicao' && <ListaPedidosAquisicao key={`aquisicao-${reloadKey}`} />}
      {secaoAtiva === 'validarConclusao' && <ListaPedidosDevolucao key={`conclusao-${reloadKey}`} />}
    </>
  );
}

export default PendentesPedidos;
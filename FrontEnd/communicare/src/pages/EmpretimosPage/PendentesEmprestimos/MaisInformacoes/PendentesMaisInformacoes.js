import React, { useEffect, useState } from "react";
import { FaCubes, FaSearch } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
import { api } from '../../../../utils/axios.js';
import { getUserImageUrl } from '../../../../utils/url';
import HeaderProfileCares from "../../../../components/HeaderProfile/headerProfile.js";

import iconFallback from '../../../../assets/icon.jpg';
import cares from '../../../../assets/Cares.png';

import "./PendentesMaisInformacoes.css";

const getImagemSrc = (fotoItem) => {
  if (fotoItem && fotoItem.trim() !== "" && fotoItem !== "null") {
    return `data:image/jpeg;base64,${fotoItem}`;
  } else {
    return iconFallback;
  }
};

const Search = () => {
  const navigate = useNavigate();
  const [userTipoUtilizadorId, setUserTipoUtilizadorId] = useState(null);

  useEffect(() => {
    const verificarTipoUtilizador = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await api.get("/Utilizadores/VerificarAdmin", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUserTipoUtilizadorId(response.data);
      } catch (error) {
        console.error("Erro ao verificar o tipo de utilizador", error);
        setUserTipoUtilizadorId(false);
      }
    };
    verificarTipoUtilizador();
  }, []);

  const handleClickPendentes = () => {
    if (userTipoUtilizadorId === true) {
      navigate("/PendentesEmprestimos");
    } else {
      alert("Apenas administradores podem aceder a esta página!");
    }
  };

  return (
    <div>
      <div className="mainName">
        <h1>Empréstimos</h1>
      </div>
      <div className="tabs">
        <div className="choose">
          <button className="tab" onClick={() => navigate("/meusEmprestimos")}>Meus Empréstimos</button>
          <button className="tab" onClick={() => navigate("/outrosEmprestimos")}>Outros Empréstimos</button>
          {userTipoUtilizadorId === true && (
            <button className="tab active" onClick={handleClickPendentes}>Empréstimos Pendentes</button>
          )}
        </div>
        <div className="search-wrapper">
          <input type="text" placeholder="Pesquisar..." className="search" />
          <FaSearch className="search-icon" />
        </div>
      </div>
    </div>
  );
};

const DetalhesItem = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const [fotoEmprestador, setFotoEmprestador] = useState(null);

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await api.get(`/ItensEmprestimo/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setItem(response.data[0]);
      } catch (error) {
        console.error('Erro ao buscar detalhes do item:', error);
      }
    };

    const fetchFotoEmprestador = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await api.get(`/ItensEmprestimo/${id}/foto-emprestador`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const urlFoto = `http://localhost:5182/${response.data}`;
        setFotoEmprestador(urlFoto);
      } catch (error) {
        console.error('Erro ao buscar foto do emprestador:', error);
        setFotoEmprestador(iconFallback);
      }
    };

    fetchItem();
    fetchFotoEmprestador();
  }, [id]);

  const validarItem = async (itemId) => {
    try {
      const token = localStorage.getItem('token');
      await api.post(`/ItensEmprestimo/ValidarItem-(admin)/${itemId}`, null, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Item validado com sucesso!");
      navigate("/PendentesEmprestimos");
    } catch (error) {
      console.error("Erro ao validar item:", error);
      alert("Erro ao validar item.");
    }
  };

  const rejeitarItem = async (itemId) => {
    try {
      const token = localStorage.getItem('token');
      await api.delete(`/ItensEmprestimo/RejeitarItem-(admin)/${itemId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Item rejeitado com sucesso!");
      navigate("/PendentesEmprestimos");
    } catch (error) {
      console.error("Erro ao rejeitar item:", error);
      alert("Erro ao rejeitar item.");
    }
  };

  if (!item) return <p>A carregar detalhes do item...</p>;

  return (
    <div className="detalhesContainer">
      {/* Lado Esquerdo */}
      <div className="colunaEsquerda">
        <div className="userTitle">
          <img
            className="imgUsers"
            src={fotoEmprestador || iconFallback}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = iconFallback;
            }}
            alt="User"
            width={70}
            height={70}
          />
          <h2 className="tituloItem">{item.nomeItem}</h2>
        </div>

        <img
          className="imgItemDetalhes"
          src={getImagemSrc(item.fotografiaItem)}
          alt={item.nomeItem}
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = iconFallback;
          }}
        />

        <div className="infoItem detalhes">
          <span><FaCubes /> {item.disponivel}</span>
          <span><img src={cares} width={30} height={30} alt="Cares" /> {item.comissaoCares}/h</span>
        </div>

        <div className="BotAcao">
          <button className="botaoAceitar" onClick={() => validarItem(item.itemId)}>Aceitar</button>
          <button className="botaoRejeitar" onClick={() => rejeitarItem(item.itemId)}>Rejeitar</button>
        </div>
      </div>

      {/* Lado Direito */}
      <div className="colunaDireita">
        <h2 className="tituloItem">{item.nomeItem}</h2>
        <div className="descricaoDetalhe">
          <p className="decriptionText">{item.descItem || "Sem descrição disponível."}</p>
        </div>
      </div>
    </div>
  );
};

function MaisInformacoes() {
  return (
    <>
      <HeaderProfileCares />
      <Search />
      <DetalhesItem />
    </>
  );
}

export default MaisInformacoes;

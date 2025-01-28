import './style.css';
import React, { useState, useEffect, useRef } from 'react';
import { MdDeleteOutline } from "react-icons/md";
import { FaRegEdit } from "react-icons/fa";
import { CgDarkMode } from "react-icons/cg"; // Importa o ícone do modo escuro
import api from '../../services/api';

function Cadastro() {
  const [erros, setErros] = useState([]);
  const [selectedType, setSelectedType] = useState(null);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [editMode, setEditMode] = useState(false); // Controle de edição
  const [editingErrorId, setEditingErrorId] = useState(null); // ID do erro que está sendo editado
  const [isDarkMode, setIsDarkMode] = useState(false); // Controle do modo escuro

  const inputTitle = useRef();
  const inputDesc = useRef();

  async function getErros() {
    const errosFromApi = await api.get('/Cadastro');
    setErros(errosFromApi.data);
  }

  async function createOrUpdateErro() {
    const title = inputTitle.current.value.trim();
    const desc = inputDesc.current.value.trim();

    if (!selectedType) {
      showMessage("Por favor, selecione um tipo!", "error");
      return;
    }

    if (editMode) {
      // Atualizar o erro
      await api.put(`/Cadastro/${editingErrorId}`, {
        title,
        desc,
        type: selectedType,
      });
      showMessage("Erro atualizado com sucesso!", "success");
    } else {
      // Criar um novo erro
      const erroDuplicado = erros.some(
        (erro) => erro.title === title && erro.desc === desc
      );

      if (erroDuplicado) {
        showMessage("Este erro já foi cadastrado!", "error");
        return;
      }

      await api.post('/Cadastro', {
        title,
        desc,
        type: selectedType,
      });
      showMessage("Erro cadastrado com sucesso!", "success");
    }

    setEditMode(false);
    setEditingErrorId(null);
    getErros();
    limparCampos();
  }

  function showMessage(msg, type) {
    setMessage(msg);
    setMessageType(type);

    setTimeout(() => {
      setMessage("");
      setMessageType("");
    }, 3000);
  }

  function limparCampos() {
    inputTitle.current.value = "";
    inputDesc.current.value = "";
    setSelectedType(null);
    setEditMode(false);
    setEditingErrorId(null);
    document.querySelectorAll('input[type="radio"]').forEach((radio) => {
      radio.checked = false;
    });
  }

  async function deleteErros(id) {
    await api.delete(`/Cadastro/${id}`);
    showMessage("Erro deletado com sucesso!", "success");
    getErros();
  }

  function editarErro(erro) {
    // Preenche os campos com os valores do erro selecionado
    inputTitle.current.value = erro.title;
    inputDesc.current.value = erro.desc;
    setSelectedType(erro.type);
    document.querySelector(`input[type="radio"][value="${erro.type}"]`).checked = true;

    setEditMode(true); // Ativa o modo de edição
    setEditingErrorId(erro.id); // Salva o ID do erro que está sendo editado
  }

  useEffect(() => {
    getErros();
  }, []);

  const handleTypeChange = (event) => {
    setSelectedType(event.target.value);
  };

  const toggleDarkMode = () => {
    setIsDarkMode((prevMode) => !prevMode);
  };

  return (
    <div className={`container ${isDarkMode ? "dark" : ""}`}>
      {/* Ícone de alternância no canto superior direito */}
      <div className="dark-mode-icon" onClick={toggleDarkMode}>
        <CgDarkMode size={30} />
      </div>

      <form onSubmit={(e) => e.preventDefault()}>
        <h1>{editMode ? "Editar Erro" : "Cadastro de Erros"}</h1>
        <input
          className='input-field'
          type="text"
          name="title"
          id='title'
          placeholder='Titulo'
          required
          ref={inputTitle}
        />

        <textarea
          className='input-field'
          name="desc"
          id="desc"
          rows={5}
          cols={30}
          placeholder='Descreva o ocorrido...'
          ref={inputDesc}
        ></textarea>

        <div className='radio'>
          <div>
            <input
              type="radio"
              id="fiscal"
              name="type"
              value="1"
              onChange={handleTypeChange}
              required
            />
            <label htmlFor="fiscal">Fiscal</label>
          </div>

          <div>
            <input
              type="radio"
              id="sistema"
              name="type"
              value="2"
              onChange={handleTypeChange}
            />
            <label htmlFor="sistema">Sistema</label>
          </div>

          <div>
            <input
              type="radio"
              id="os"
              name="type"
              value="3"
              onChange={handleTypeChange}
            />
            <label htmlFor="os">OS/Rede</label>
          </div>
        </div>

        {message && (
          <div className={`message ${messageType}`}>
            {message}
          </div>
        )}

        <div className='butao'>
          <button className='botao' type="button" onClick={createOrUpdateErro}>
            {editMode ? "Atualizar" : "Enviar"}
          </button>
          <button className='botao' type="button" onClick={limparCampos}>
            Limpar
          </button>
          <button className='botao' type="button">
            Cancelar
          </button>
        </div>
      </form>

      {erros.slice().reverse().map((erro) => (
        <div key={erro.id} className='card'>
          <div>
            <p>Titulo: <span>{erro.title}</span></p>
            <p>Descricao: <span>{erro.desc}</span></p>
            <div>
              <button onClick={() => deleteErros(erro.id)}>
                <MdDeleteOutline size={26} color={isDarkMode ? 'white' : 'black'} />
              </button>
              <button onClick={() => editarErro(erro)}>
                <FaRegEdit size={25} color={isDarkMode ? 'white' : 'black'} />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default Cadastro;

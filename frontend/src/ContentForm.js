import React, { useState, useEffect } from "react";
import { fetchTeams } from "./api";

const ContentForm = ({ content = {}, onSubmit, onCancel }) => {
  const [title, setTitle] = useState(content.title || "");
  const [contentText, setContentText] = useState(content.content_text || "");
  const [contentType, setContentType] = useState(
    content.content_type || "article"
  );
  const [team, setTeam] = useState(content.team || "");
  const [teams, setTeams] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadTeams = async () => {
      try {
        const teamsData = await fetchTeams();
        setTeams(teamsData);
        if (!team && teamsData.length > 0) {
          setTeam(teamsData[0].id);
        }
      } catch (err) {
        console.error("Erro ao carregar equipes para o formulário:", err);
        setError("Não foi possível carregar as equipes.");
      }
    };
    loadTeams();
  }, [team]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title || !contentText || !contentType || !team) {
      setError("Todos os campos são obrigatórios.");
      return;
    }
    setError(null);
    onSubmit({
      title,
      content_text: contentText,
      content_type: contentType,
      team: parseInt(team),
    });
  };

  return (
    <div
      style={{
        padding: "20px",
        border: "1px solid #ddd",
        borderRadius: "8px",
        marginBottom: "20px",
      }}
    >
      <h3>{content.id ? "Editar Conteúdo" : "Novo Conteúdo"}</h3>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "10px" }}>
          <label style={{ display: "block", marginBottom: "5px" }}>
            Título:
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={{ width: "100%", padding: "8px", boxSizing: "border-box" }}
            required
          />
        </div>
        <div style={{ marginBottom: "10px" }}>
          <label style={{ display: "block", marginBottom: "5px" }}>
            Conteúdo:
          </label>
          <textarea
            value={contentText}
            onChange={(e) => setContentText(e.target.value)}
            rows="5"
            style={{ width: "100%", padding: "8px", boxSizing: "border-box" }}
            required
          ></textarea>
        </div>
        <div style={{ marginBottom: "10px" }}>
          <label style={{ display: "block", marginBottom: "5px" }}>Tipo:</label>
          <select
            value={contentType}
            onChange={(e) => setContentType(e.target.value)}
            style={{ width: "100%", padding: "8px", boxSizing: "border-box" }}
            required
          >
            <option value="article">Artigo</option>
            <option value="tutorial">Tutorial</option>
            <option value="documentation">Documentação</option>
            <option value="blog_post">Post de Blog</option>
          </select>
        </div>
        <div style={{ marginBottom: "10px" }}>
          <label style={{ display: "block", marginBottom: "5px" }}>
            Equipe:
          </label>
          <select
            value={team}
            onChange={(e) => setTeam(e.target.value)}
            style={{ width: "100%", padding: "8px", boxSizing: "border-box" }}
            required
          >
            <option value="">Selecione uma equipe</option>
            {teams.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </select>
        </div>
        <div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
          <button
            type="submit"
            style={{
              padding: "10px 15px",
              backgroundColor: "#28a745",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            {content.id ? "Salvar Edição" : "Criar Conteúdo"}
          </button>
          <button
            type="button"
            onClick={onCancel}
            style={{
              padding: "10px 15px",
              backgroundColor: "#dc3545",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
};

export default ContentForm;

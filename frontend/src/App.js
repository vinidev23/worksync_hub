import React, { useState, useEffect } from "react";
import "./App.css";
import { fetchTeams, fetchContent } from "./api";

function App() {
  const [teams, setTeams] = useState([]);
  const [content, setContent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const teamsData = await fetchTeams();
        setTeams(teamsData);

        const contentData = await fetchContent();
        setContent(contentData);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) {
    return <div className="App">Carregando dados...</div>;
  }

  if (error) {
    return (
      <div className="App" style={{ color: "red" }}>
        Erro: {error.message}
      </div>
    );
  }

  return (
    <div className="App">
      <header className="App-header">
        <h1>Worksync Hub - Dashboard</h1>
      </header>
      <main>
        <section style={{ marginBottom: "40px" }}>
          <h2>Equipes</h2>
          {teams.length > 0 ? (
            <ul>
              {teams.map((team) => (
                <li key={team.id}>
                  <strong>{team.name}</strong>: {team.description} (
                  {team.members.length} membros)
                </li>
              ))}
            </ul>
          ) : (
            <p>Nenhuma equipe encontrada.</p>
          )}
        </section>

        <section>
          <h2>Conteúdo</h2>
          {content.length > 0 ? (
            <ul>
              {content.map((item) => (
                <li key={item.id}>
                  <strong>{item.title}</strong> ({item.content_type}) por{" "}
                  {item.author} na equipe {item.team_name}
                  <p>{item.content_text.substring(0, 100)}...</p>
                </li>
              ))}
            </ul>
          ) : (
            <p>
              Nenhum conteúdo encontrado. Lembre-se que você precisa estar
              autenticado com um token de um usuário membro de uma equipe para
              ver o conteúdo.
            </p>
          )}
        </section>
      </main>
    </div>
  );
}

export default App;

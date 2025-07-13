import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useNavigate,
} from "react-router-dom";
import "./App.css";
import { fetchTeams, fetchContent } from "./api";
import Login from "./Login";

function Dashboard() {
  const [teams, setTeams] = useState([]);
  const [content, setContent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const loadData = async () => {
      try {
        const teamsData = await fetchTeams();
        setTeams(teamsData);

        const contentData = await fetchContent();
        setContent(contentData);
      } catch (err) {
        setError(err);
        if (err.message.includes("401")) {
          navigate("/login");
        }
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [navigate]);

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
            Nenhum conteúdo encontrado. Você precisa estar autenticado com um
            token de um usuário membro de uma equipe para ver o conteúdo.
          </p>
        )}
      </section>
    </main>
  );
}

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(
    !!localStorage.getItem("access_token")
  );

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    setIsAuthenticated(false);
  };

  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <h1>Worksync Hub - Dashboard</h1>
          <nav>
            {isAuthenticated ? (
              <button onClick={handleLogout} style={{ marginLeft: "10px" }}>
                Sair
              </button>
            ) : (
              <Link
                to="/login"
                style={{
                  marginLeft: "10px",
                  color: "white",
                  textDecoration: "none",
                }}
              >
                Login
              </Link>
            )}
          </nav>
        </header>
        <Routes>
          <Route
            path="/login"
            element={<Login setAuth={setIsAuthenticated} />}
          />
          <Route
            path="/"
            element={
              isAuthenticated ? (
                <Dashboard />
              ) : (
                <Login setAuth={setIsAuthenticated} />
              )
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

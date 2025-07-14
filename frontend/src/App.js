import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useNavigate,
} from "react-router-dom";
import "./App.css";
import {
  fetchTeams,
  fetchContent,
  createContent,
  updateContent,
  deleteContent,
} from "./api";
import Login from "./Login";
import ContentForm from "./ContentForm";

function Dashboard() {
  const [teams, setTeams] = useState([]);
  const [content, setContent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [editingContent, setEditingContent] = useState(null);
  const navigate = useNavigate();

  const loadData = async () => {
    setLoading(true);
    setError(null);
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

  useEffect(() => {
    loadData();
  }, [navigate]);

  const handleCreateNew = () => {
    setEditingContent(null);
    setIsFormVisible(true);
  };

  const handleEdit = (item) => {
    setEditingContent(item);
    setIsFormVisible(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Tem certeza que deseja excluir este conteúdo?")) {
      try {
        await deleteContent(id);
        await loadData();
      } catch (err) {
        setError(new Error("Erro ao excluir conteúdo: " + err.message));
      }
    }
  };

  const handleFormSubmit = async (formData) => {
    try {
      if (editingContent) {
        await updateContent(editingContent.id, formData);
      } else {
        await createContent(formData);
      }
      setIsFormVisible(false);
      setEditingContent(null);
      await loadData();
    } catch (err) {
      setError(new Error("Erro ao salvar conteúdo: " + err.message));
    }
  };

  const handleCancelForm = () => {
    setIsFormVisible(false);
    setEditingContent(null);
  };

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
    <main className="main-content">
      <section className="section-block">
        <h2>Equipes</h2>
        {teams.length > 0 ? (
          <ul className="list-unstyled">
            {teams.map((team) => (
              <li key={team.id} className="list-item">
                <strong>{team.name}</strong>: {team.description} (
                {team.members.length} membros)
              </li>
            ))}
          </ul>
        ) : (
          <p>Nenhuma equipe encontrada.</p>
        )}
      </section>

      <section className="section-block">
        <h2>Conteúdo</h2>
        <button onClick={handleCreateNew} className="btn btn-primary">
          Criar Novo Conteúdo
        </button>

        {isFormVisible && (
          <ContentForm
            content={editingContent}
            onSubmit={handleFormSubmit}
            onCancel={handleCancelForm}
          />
        )}

        {content.length > 0 ? (
          <ul className="list-unstyled">
            {content.map((item) => (
              <li key={item.id} className="content-item">
                <h3>
                  {item.title} ({item.content_type})
                </h3>
                <p>
                  Por <strong>{item.author_username}</strong> na equipe{" "}
                  <strong>{item.team_name}</strong>
                </p>
                <p>{item.content_text.substring(0, 200)}...</p>
                <div className="content-actions">
                  <button
                    onClick={() => handleEdit(item)}
                    className="btn btn-warning"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="btn btn-danger"
                  >
                    Excluir
                  </button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p>
            Nenhum conteúdo encontrado. Crie um novo ou verifique suas
            permissões de equipe.
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
              <button onClick={handleLogout} className="btn btn-secondary">
                Sair
              </button>
            ) : (
              <Link to="/login" className="btn btn-primary">
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

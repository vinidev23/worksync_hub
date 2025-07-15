const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:8000";

const getAuthToken = () => {
  return localStorage.getItem("access_token");
};

const fetcher = async (url, options = {}) => {
  const token = getAuthToken();
  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(url, { ...options, headers });

  if (!response.ok) {
    if (response.status === 401) {
      console.error("Token expirado ou inválido. Redirecionando para login.");
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      window.location.href = "/login";
    }
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.detail ||
        `Erro HTTP: ${response.status} - ${response.statusText}`
    );
  }

  return response.json();
};

export const fetchTeams = async () => {
  try {
    const data = await fetcher(`${API_BASE_URL}/teams/`);
    return data;
  } catch (error) {
    console.error("Erro ao buscar equipes:", error);
    throw error;
  }
};

export const fetchContent = async () => {
  try {
    const data = await fetcher(`${API_BASE_URL}/content/`);
    return data;
  } catch (error) {
    console.error("Erro ao buscar conteúdo:", error);
    throw error;
  }
};

export const createContent = async (contentData) => {
  try {
    const data = await fetcher(`${API_BASE_URL}/content/`, {
      method: "POST",
      body: JSON.stringify(contentData),
    });
    return data;
  } catch (error) {
    console.error("Erro ao criar conteúdo:", error);
    throw error;
  }
};

export const updateContent = async (id, contentData) => {
  try {
    const data = await fetcher(`${API_BASE_URL}/content/${id}/`, {
      method: "PUT",
      body: JSON.stringify(contentData),
    });
    return data;
  } catch (error) {
    console.error(`Erro ao editar conteúdo ${id}:`, error);
    throw error;
  }
};

export const deleteContent = async (id) => {
  try {
    await fetcher(`${API_BASE_URL}/content/${id}/`, {
      method: "DELETE",
    });
    return null;
  } catch (error) {
    console.error(`Erro ao excluir conteúdo ${id}:`, error);
    throw error;
  }
};

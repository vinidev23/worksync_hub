const API_BASE_URL = "http://127.0.0.1:8000/api/";

function getAuthToken() {
  const token = "01150d1d899b1233bd005a787f76ded1329beba8";
  return token ? `Token ${token}` : "";
}

export const fetchTeams = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}teams/`, {
      headers: {
        Authorization: getAuthToken(),
      },
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || `Erro HTTP: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Erro ao buscar equipes:", error);
    throw error;
  }
};

export const fetchContent = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}content/`, {
      headers: {
        Authorization: getAuthToken(),
      },
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || `Erro HTTP: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Erro ao buscar conteúdo:", error);
    throw error;
  }
};

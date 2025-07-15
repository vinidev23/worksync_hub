# WorkSync Hub

O WorkSync Hub é uma plataforma de gerenciamento de conteúdo desenvolvida com Django (Backend) e React (Frontend). Ele permite que equipes criem, editem e organizem diferentes tipos de conteúdo, como artigos, tutoriais e documentação, associando-os a equipes específicas.

---

## 🚀 Funcionalidades

* **Autenticação de Usuários:** Login e registro de usuários.
* **Gerenciamento de Conteúdo:**
    * Criação, leitura, atualização e exclusão (CRUD) de itens de conteúdo.
    * Conteúdo com título, texto, tipo (artigo, tutorial, documentação, post de blog).
    * Associação de conteúdo a uma **equipe** específica.
    * Associação de conteúdo a um **autor** (usuário logado).
    * Geração automática e única de `slug` para URLs amigáveis.
* **Gerenciamento de Equipes:**
    * Criação, leitura, atualização e exclusão (CRUD) de equipes.
    * Associação de usuários a equipes.
* **Notificações por E-mail:** Envio de e-mail ao criar um novo conteúdo (funcionalidade configurável).

---

## 🛠️ Tecnologias Utilizadas

### Backend (Django REST Framework)

* **Python 3.10+**
* **Django 5.x:** Framework web robusto.
* **Django REST Framework:** Para construção de APIs RESTful.
* **PostgreSQL:** Banco de dados relacional.
* **Gunicorn:** Servidor de aplicação WSGI para produção.
* **psycopg2:** Adaptador PostgreSQL para Python.
* **python-dotenv:** Gerenciamento de variáveis de ambiente.
* **Pillow:** Para manipulação de imagens (se for adicionar no futuro).
* **djangorestframework-simplejwt:** Autenticação JWT.
* **django-cors-headers:** Para lidar com requisições CORS.

### Frontend (React)

* **React 18+**
* **Vite** (ou Create React App, dependendo de como você iniciou)
* **Axios:** Para requisições HTTP à API.
* **react-router-dom:** Para roteamento no lado do cliente.
* **react-dom:** Pacote DOM do React.

---

## ⚙️ Configuração

Siga os passos abaixo para configurar e rodar o projeto em sua máquina local.

### Pré-requisitos

* **Python 3.10+** e **pip** (gerenciador de pacotes Python)
* **Node.js 18+** e **npm** (gerenciador de pacotes Node)
* **PostgreSQL** instalado e rodando
* **Git**

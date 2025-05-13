# AI Workspaces

Uma plataforma para interação com IA em espaços de trabalho organizados, permitindo chats contextuais e pessoais com base em documentos.

## Screenshots

### Homepage
![Homepage da aplicação](https://i.imgur.com/G5f3SZC.jpg)  
*Página inicial da aplicação com opções de navegação*

### Listagem de Workspaces
![Listagem de Workspaces - Visão 1](https://i.imgur.com/8jmVaex.jpg)  
*Visualização principal da listagem de workspaces do usuário*

![Listagem de Workspaces - Visão 2](https://i.imgur.com/OGzjRK4.jpg)  
*Visualização alternativa sem workspaces*

### Interface de Chat
![Interface de Chat](https://i.imgur.com/mcOUQXo.jpg)  
*Interface de conversação com o assistente de IA*

### Upload de Documentos
![Upload de Documentos](https://i.imgur.com/uHsLZx5.jpg)  
*Tela de importação e gerenciamento de documentos*

## Requisitos

- Docker e Docker Compose

## Execução com Docker

### Configuração inicial

1. Clone o repositório:
```bash
git clone https://github.com/fernandovmc/ai-workspaces.git
cd ai-workspaces
```

2. Configure os arquivos de ambiente:

   a. Para o arquivo principal na raiz:
   ```bash
   cp .env.example .env
   ```

   b. Para o backend:
   ```bash
   cp backend/.env.example backend/.env
   ```

   c. Para o frontend (se necessário):
   ```bash
   cp frontend/.env.example frontend/.env   # Se existir
   ```

3. Edite os arquivos `.env` conforme necessário:

   a. No arquivo principal (`./.env`):
   ```
   OPENAI_API_KEY=sua_api_key
   JWT_SECRET=jwt_token_aqui
   POSTGRES_PASSWORD=sua_senha_do_postgres
   ```

   b. No arquivo do backend (`./backend/.env`):
   ```
   OPENAI_API_KEY=sua_api_key
   JWT_SECRET=jwt_token_aqui
   DB_PASSWORD=sua_senha_do_postgres
   ```

   > **Importante**: As configurações de ambiente são carregadas de ambos os arquivos - o arquivo na raiz é usado pelo Docker Compose, enquanto o arquivo no backend é usado pela aplicação Node.js dentro do contêiner.

### Construindo e iniciando a aplicação

Execute o seguinte comando na pasta raiz do projeto para construir e iniciar todos os serviços:

```bash
docker-compose up --build
```

A aplicação estará disponível em:
- Frontend: http://localhost:3000
- Backend: http://localhost:5000
- Postgres: localhost:5432

## Estrutura do projeto

- `/backend`: API NestJS com autenticação, gestão de usuários, workspaces e integração com a OpenAI
- `/frontend`: Aplicação Next.js com interface de usuário para interação com a API

### Erros relacionados a variáveis de ambiente
Se a aplicação apresentar erros relacionados a variáveis de ambiente faltantes:

1. Verifique se todos os arquivos `.env` foram criados corretamente:
   - `./.env` (raiz do projeto)
   - `./backend/.env`
   - `./frontend/.env` (se aplicável)

2. Certifique-se de que as variáveis esperadas estão definidas em cada arquivo.

3. Reconstrua os contêineres para aplicar as alterações:
```bash
docker-compose down
docker-compose up --build
```

> **Nota**: As variáveis definidas no arquivo `.env` da raiz serão usadas pelo Docker Compose para configurar os contêineres, enquanto as variáveis nos arquivos `.env` específicos serão usadas pelas aplicações dentro dos contêineres.

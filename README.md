# AI Workspaces

Uma plataforma para interação com IA em espaços de trabalho organizados, permitindo chats contextuais e pessoais com base em documentos.

## Screenshots

### Homepage
![Homepage da aplicação](https://imgur.com/tM43kNB)
*Página inicial da aplicação com opções de navegação*

### Listagem de Workspaces
![https://imgur.com/bLkP2sp]
*Visualização principal da listagem de workspaces do usuário*

![Listagem de Workspaces - Visão 2](https://imgur.com/TwqK6aU)
*Visualização alternativa com detalhes dos workspaces*

### Interface de Chat
![Interface de Chat](https://imgur.com/MAP0oo2)
*Interface de conversação com o assistente de IA*

### Upload de Documentos
![Upload de Documentos](https://imgur.com/Cm3OPCs)
*Tela de importação e gerenciamento de documentos*

## Requisitos

- Docker e Docker Compose
- Node.js 18+ (para desenvolvimento local)

## Execução com Docker

### Configuração inicial

1. Clone o repositório:
```bash
git clone https://github.com/fernandovmc/ai-workspaces.git
cd ai-workspaces
```

2. Configure os arquivos de ambiente:

Para o backend:
```bash
cp backend/.env.example backend/.env
```

Para o frontend:
```bash
cp frontend/.env.example frontend/.env
```

3. Edite os arquivos `.env` conforme necessário, especialmente adicionando sua chave de API da OpenAI no arquivo `backend/.env`:
```
OPENAI_API_KEY=sua_chave_da_openai_aqui
```

### Iniciando a aplicação

Execute o seguinte comando na pasta raiz do projeto:

```bash
docker-compose up
```

A aplicação estará disponível em:
- Frontend: http://localhost:3000
- Backend: http://localhost:5000
- Postgres: localhost:5432

### Parando a aplicação

```bash
docker-compose down
```

Para remover os volumes também (isso apagará os dados do banco):
```bash
docker-compose down -v
```

## Desenvolvimento local (sem Docker)

Caso prefira executar o projeto localmente sem o Docker:

### Backend

1. Navegue até a pasta do backend:
```bash
cd backend
```

2. Instale as dependências:
```bash
npm install
```

3. Certifique-se de ter o PostgreSQL rodando localmente e atualize o arquivo `.env` com as configurações corretas.

4. Execute o servidor de desenvolvimento:
```bash
npm run start:dev
```

O backend estará disponível em http://localhost:5000.

### Frontend

1. Navegue até a pasta do frontend:
```bash
cd frontend
```

2. Instale as dependências:
```bash
npm install
```

3. Execute o servidor de desenvolvimento:
```bash
npm run dev
```

O frontend estará disponível em http://localhost:3000.

## Estrutura do projeto

- `/backend`: API NestJS com autenticação, gestão de usuários, workspaces e integração com a OpenAI
- `/frontend`: Aplicação Next.js com interface de usuário para interação com a API

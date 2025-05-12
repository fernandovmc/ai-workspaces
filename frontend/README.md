# Frontend da aplicação AI Workspaces

Interface de usuário construída com Next.js para interação com a API de workspaces e IA.

## Tecnologias utilizadas

- Next.js 15
- React 19
- TypeScript
- Tailwind CSS
- React Query para gerenciamento de estado e requisições
- Axios para comunicação com API

## Configuração do ambiente

1. Crie um arquivo `.env` baseado no `.env.example`:

```bash
cp .env.example .env
```

2. Configure as variáveis no arquivo `.env`:
- `NEXT_PUBLIC_API_URL`: URL da API backend (padrão: http://localhost:5000)

## Screenshots

### Homepage
![Homepage da aplicação](/caminho/para/screenshot-homepage.png)
*Página inicial da aplicação com opções de navegação*

### Listagem de Workspaces
![Listagem de Workspaces - Visão 1](/caminho/para/screenshot-workspaces-1.png)
*Visualização principal da listagem de workspaces do usuário*

![Listagem de Workspaces - Visão 2](/caminho/para/screenshot-workspaces-2.png)
*Visualização alternativa com detalhes dos workspaces*

### Interface de Chat
![Interface de Chat](/caminho/para/screenshot-chatbot.png)
*Interface de conversação com o assistente de IA*

### Upload de Documentos
![Upload de Documentos](/caminho/para/screenshot-documentos.png)
*Tela de importação e gerenciamento de documentos*

## Instalação

```bash
npm install
```

## Executando a aplicação

### Desenvolvimento

```bash
npm run dev
```

A aplicação estará disponível em http://localhost:3000.

### Produção

```bash
npm run build
npm start
```

## Estrutura da aplicação

### Páginas principais

- **Login/Registro**: Autenticação de usuários
- **Workspaces**: Lista de workspaces do usuário
- **Workspace individual**: Interface de chat e gerenciamento de documentos

### Componentes principais

- **ChatInterface**: Interface para interação com a IA
- **DocumentUpload**: Componente para upload e visualização de documentos
- **Navbar**: Navegação principal da aplicação

## Fluxo de uso

1. O usuário registra uma conta ou faz login
2. Na página principal, o usuário pode criar ou selecionar workspaces
3. Dentro de um workspace, o usuário pode:
   - Fazer upload de documentos
   - Iniciar conversas contextuais com base nos documentos
   - Iniciar conversas pessoais com a IA
   - Ver o histórico de conversas

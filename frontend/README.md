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

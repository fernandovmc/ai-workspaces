# Backend da aplicação AI Workspaces

API construída com NestJS para gerenciar workspaces, documentos e interações com IA.

## Tecnologias utilizadas

- NestJS
- TypeORM
- PostgreSQL
- JWT para autenticação
- OpenAI API
- Multer para upload de arquivos

## Configuração do ambiente

1. Crie um arquivo `.env` baseado no `.env.example`:

```bash
cp .env.example .env
```

2. Configure as variáveis no arquivo `.env`:
- `JWT_SECRET`: Chave secreta para assinatura de tokens JWT
- `JWT_EXPIRATION`: Tempo de expiração dos tokens JWT
- `OPENAI_API_KEY`: Sua chave de API da OpenAI
- Configurações do banco de dados (host, porta, usuário, senha)

## Instalação

```bash
npm install
```

## Executando a aplicação

### Desenvolvimento

```bash
npm run start:dev
```

### Produção

```bash
npm run build
npm run start:prod
```

## Estrutura de módulos

- **Users**: Gerenciamento de usuários
- **Auth**: Autenticação e autorização
- **Workspaces**: Organização de espaços de trabalho
- **Documents**: Gerenciamento de documentos
- **Chat**: Histórico de conversas
- **AI**: Integração com modelos de IA

## API Endpoints

### Autenticação

- `POST /auth/register` - Registro de usuários
- `POST /auth/login` - Login de usuários

### Workspaces

- `GET /workspaces` - Listar todos os workspaces do usuário
- `POST /workspaces` - Criar novo workspace
- `GET /workspaces/:id` - Obter detalhes de um workspace
- `DELETE /workspaces/:id` - Excluir um workspace

### Documentos

- `GET /workspaces/:id/documents` - Listar documentos de um workspace
- `POST /workspaces/:id/documents` - Fazer upload de documento
- `GET /workspaces/:id/documents/:docId` - Obter detalhes de um documento
- `DELETE /workspaces/:id/documents/:docId` - Excluir um documento

### Chat

- `POST /workspaces/:id/chat/contextual` - Chat contextual com documentos
- `POST /workspaces/:id/chat/personal` - Chat pessoal sem contexto
- `GET /workspaces/:id/chat/history` - Obter histórico de chat
# Backend da aplicação AI Workspaces

API construída com NestJS para gerenciar workspaces, documentos e interações com IA.

## Tecnologias utilizadas

- NestJS
- TypeORM
- PostgreSQL
- JWT para autenticação
- OpenAI API
- Multer para upload de arquivos

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
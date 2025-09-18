# Plush API

Bem-vindo à API Plush! Este documento fornece informações essenciais para que os desenvolvedores de front-end possam começar a usar a API.

## Sobre a API

A API Plush é um serviço de backend moderno, rápido e confiável que fornece autenticação de usuário, funcionalidades de bate-papo e muito mais. Ela foi construída com o desempenho e a experiência do desenvolvedor em mente.

## Tecnologias Utilizadas

- **Framework:** [Fastify](https://www.fastify.io/)
- **Banco de Dados:** [PostgreSQL](https://www.postgresql.org/)
- **ORM:** [Drizzle ORM](https://orm.drizzle.team/)
- **Autenticação:** [JWT](https://jwt.io/), [OAuth 2.0](https://oauth.net/2/)
- **Validação:** [Zod](https://zod.dev/)
- **Runtime:** [Bun](https://bun.sh/)

## Começando

Para colocar o servidor da API em funcionamento na sua máquina local, siga estes passos simples:

1.  **Instale as Dependências:**

    ```bash
    bun install
    ```

2.  **Execute o Servidor de Desenvolvimento:**

    ```bash
    bun run dev
    ```

O servidor será iniciado na porta especificada no seu arquivo `.env`.

## Documentação da API

Para informações detalhadas sobre os endpoints da API, corpos de requisição e respostas, consulte nossa documentação `Swagger`, que é gerada automaticamente e está disponível em:

- **[http://localhost:PORTA/docs](http://localhost:PORTA/docs)**

*Substitua `PORTA` pelo número da porta em que o servidor está sendo executado.*

## Endpoints da API

Aqui está um resumo dos endpoints da API disponíveis:

### Autenticação

| Método | Caminho                     | Descrição                                    |
| :----- | :-------------------------- | :------------------------------------------- |
| `POST` | `/sessions`                 | Faça login com e-mail e senha.               |
| `POST` | `/sessions/signup`          | Crie uma nova conta de usuário.              |
| `POST` | `/sessions/refresh`         | Atualize o token de acesso.                  |
| `DELETE`| `/sessions/@me`             | Desconecte o usuário atual.                  |
| `DELETE`| `/sessions/:id`             | Exclua uma sessão de usuário específica.     |
| `GET`  | `/sessions/oauth/google`    | Inicie o fluxo do Google OAuth2.             |
| `GET`  | `/sessions/google/cb`       | URL de retorno para o Google OAuth2.         |

### Verificação de Saúde

| Método | Caminho   | Descrição                    |
| :----- | :-------- | :--------------------------- |
| `GET`  | `/health` | Verifique a saúde da API.    |

### WebSockets

| Método | Caminho | Descrição                              |
| :----- | :--- | :--------------------------------------- |
| `GET`  | `/ws`| Estabeleça uma conexão WebSocket.        |

## Esquema do Banco de Dados

O esquema do banco de dados está organizado nas seguintes tabelas:

- **`users`**: Armazena informações do usuário, incluindo detalhes de autenticação.
- **`sessions`**: Gerencia as sessões do usuário para autenticação.
- **`chats`**: Contém informações sobre as salas de bate-papo.
- **`chat_participants`**: Gerencia os participantes de cada sala de bate-papo.
- **`messages`**: Armazena as mensagens enviadas nas salas de bate-papo.

Para mais detalhes sobre as estruturas das tabelas, consulte os arquivos no diretório `src/db/schema`.

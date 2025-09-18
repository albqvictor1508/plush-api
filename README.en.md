# Plush API

Welcome to the Plush API! This document provides essential information for frontend developers to get started with the API.

## About the API

The Plush API is a modern, fast, and reliable backend service that provides user authentication, chat functionalities, and more. It's built with performance and developer experience in mind.

## Technologies Used

- **Framework:** [Fastify](https://www.fastify.io/)
- **Database:** [PostgreSQL](https://www.postgresql.org/)
- **ORM:** [Drizzle ORM](https://orm.drizzle.team/)
- **Authentication:** [JWT](https://jwt.io/), [OAuth 2.0](https://oauth.net/2/)
- **Validation:** [Zod](https://zod.dev/)
- **Runtime:** [Bun](https://bun.sh/)

## Getting Started

To get the API server up and running on your local machine, follow these simple steps:

1.  **Install Dependencies:**

    ```bash
    bun install
    ```

2.  **Run the Development Server:**

    ```bash
    bun run dev
    ```

The server will start on the port specified in your `.env` file.

## API Documentation

For detailed information about the API endpoints, request bodies, and responses, please refer to our Swagger documentation, which is automatically generated and available at:

- **[http://localhost:PORT/docs](http://localhost:PORT/docs)**

*Replace `PORT` with the actual port number the server is running on.*

## API Endpoints

Here is a summary of the available API endpoints:

### Authentication

| Method | Path                        | Description                                  |
| :----- | :-------------------------- | :------------------------------------------- |
| `POST` | `/sessions`                 | Login with email and password.               |
| `POST` | `/sessions/signup`          | Create a new user account.                   |
| `POST` | `/sessions/refresh`         | Refresh the access token.                    |
| `DELETE`| `/sessions/@me`             | Logout the current user.                     |
| `DELETE`| `/sessions/:id`             | Delete a specific user session.              |
| `GET`  | `/sessions/oauth/google`    | Initiate the Google OAuth2 flow.             |
| `GET`  | `/sessions/google/cb`       | Callback URL for Google OAuth2.              |

### Health Check

| Method | Path      | Description                  |
| :----- | :-------- | :--------------------------- |
| `GET`  | `/health` | Check the health of the API. |

### WebSockets

| Method | Path | Description                            |
| :----- | :--- | :------------------------------------- |
| `GET`  | `/ws`| Establish a WebSocket connection.      |

## Database Schema

The database schema is organized into the following tables:

- **`users`**: Stores user information, including authentication details.
- **`sessions`**: Manages user sessions for authentication.
- **`chats`**: Contains information about chat rooms.
- **`chat_participants`**: Manages the participants of each chat room.
- **`messages`**: Stores the messages sent in the chat rooms.

For more details on the table structures, please refer to the files in the `src/db/schema` directory.
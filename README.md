# Plush API
O banco ta sendo rodado pela Neon Database, eles sobem em uma instância da AWS, então não precisa se preocupar com ligar o banco, ele vai tá o tempo todo ligado lá, só vai precisar conectar o ORM ao banco

ORM é o ```Mapeamento Objeto-Relacional```, é como a gente vai escrever consulta pro banco sem escrever SQL puro, vou criar uma rota básica pra tu vê como vai ser inscrito

<<<<<<< HEAD
## Seed
    npm run seed
Apagando os dados que já estão no banco e adicionando novos dados pra teste, porém recomendo criar um usuário em um API Client como ```Postman```, já que 90% das rotas utilizam de *cookie-sections*(cookies de sessão), com seu *JWT*

## Env

Existe um arquivo chamado ```env.ts```, que informa quais são as *variáveis de ambiente* necessárias para executar a API

*(você só conseguirá executar com esses envs)*

      npm run dev

Executa a API e o Websocket

## Routes

### Send Code To User Route

Envia email com código pro usuário

    Body: {"name": "name", "email": "email@email.com"}

    Response: {"success": true}

### Create New User Route
Recebe o código, valida se condiz com o que foi gerado e se sim, cria o user no banco

    Body: {"email": "mybetteremail@gmail.com", "code": "0000"}

    Response: {"success": true}

{*essas duas responses vão ser retiradas no caso, coloquei só pra teste*}

### Create Chat Route
Cria o chat, colocando o próprio user, que é autenticado via cookie assim que loga no app, e um array de uuid's, que pode ser tanto 1 só, quanto vários id's

    Body: {"title": "my-title", participantsId: ["uuid", "uuid", "uuid"]}


    Response: {"title": "", "id": 1, createdAt, createdBy: "id do user que criou", lastMessageAt: timestamp da ultima mensagem, chatType: "private" | "group"}

### List Chats By User Route
Lista todos os chats daquele user, ordenados pelo ```lastMessageAt```

    Response:

    const listedChats: {
        title: string | null;
        id: number;
        lastMessage: string;
        lastMessageAt: Date | null;
    }[]

### Get Profile Route
Pega as informações do usuário e sua foto, se não tem foto, retorna null, aí vocês coloca uma foto ai pra ficar no lugar

    Response:

    {
        name: string;
        email: string;
        fileUrl: "url da imagem" | null
    }

### Update User Route
Atualiza info do user, (coloca ela junto da de profile tlgd)

    Response:

    {
        name: string;
        email: string;
        fileUrl: "url da imagem" | null
    }

### Toggle User Role Route
altera o participante do chat de membro pra admin, e valida se é um admin que tá realizando a requisição, (*essa dá pra testar mas ainda vou mexer nela*)

    Response:

    {
        participantId: z.string().uuid(),
		chatId: z.number().positive(),
    }

## Seed
    npm run seed
Apagando os dados que já estão no banco e adicionando novos dados pra teste, porém recomendo criar um usuário em um API Client como ```Postman```, já que 90% das rotas utilizam de *cookie-sections*(cookies de sessão), com seu *JWT*

## Env

Existe um arquivo chamado ```env.ts```, que informa quais são as *variáveis de ambiente* necessárias para executar a API

*(você só conseguirá executar com esses envs)*

      npm run dev

Executa a API e o Websocket

## Routes

### Send Code To User Route

Envia email com código pro usuário

    Body: {"name": "name", "email": "email@email.com"}

    Response: {"success": true}

### Create New User Route
Recebe o código, valida se condiz com o que foi gerado e se sim, cria o user no banco

    Body: {"email": "mybetteremail@gmail.com", "code": "0000"}

    Response: {"success": true}

{*essas duas responses vão ser retiradas no caso, coloquei só pra teste*}

### Create Chat Route
Cria o chat, colocando o próprio user, que é autenticado via cookie assim que loga no app, e um array de uuid's, que pode ser tanto 1 só, quanto vários id's

    Body: {"title": "my-title", participantsId: ["uuid", "uuid", "uuid"]}


    Response: {"title": "", "id": 1, createdAt, createdBy: "id do user que criou", lastMessageAt: timestamp da ultima mensagem, chatType: "private" | "group"}

### List Chats By User Route
Lista todos os chats daquele user, ordenados pelo ```lastMessageAt```

    Response:

    const listedChats: {
        title: string | null;
        id: number;
        lastMessage: string;
        lastMessageAt: Date | null;
    }[]

### Get Profile Route
Pega as informações do usuário e sua foto, se não tem foto, retorna null, aí vocês coloca uma foto ai pra ficar no lugar

    Response:

    {
        name: string;
        email: string;
        fileUrl: "url da imagem" | null
    }

### Update User Route
Atualiza info do user, (coloca ela junto da de profile tlgd)

    Response:

    {
        name: string;
        email: string;
        fileUrl: "url da imagem" | null
    }

### Toggle User Role Route
altera o participante do chat de membro pra admin, e valida se é um admin que tá realizando a requisição, (*essa dá pra testar mas ainda vou mexer nela*)

    Response:

    {
        participantId: z.string().uuid(),
		chatId: z.number().positive(),
    }

## Websocket

Funciona dessa maneira: Instância a classe ```WebSocket```, nativa da API do Node.js, e nessa instância, crie os observadores, que vão aguardar por esses eventos e captar os pacotes, a lógica é mais ou menos essa, mas qualquer coisa eu complemento aq

    const socket = new WebSocket('wss://www.example.com/socketserver', 'protocolo');

    socket.onopen = () => socket.send('Conectado ao servidor');

    socket.onmessage = (event) => console.log('Mensagem:', event.data);

    socket.onclose = () => console.log('Conexão fechada');

    socket.onerror = (error) => console.error('Erro:', error);
>>>>>>> Stashed changes
>>>>>>> b73fa37 (docs: introducing websocket on front)

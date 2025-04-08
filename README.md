## Como rodar a API
O banco ta sendo rodado pela Neon Database, eles sobem em uma instância da AWS, então não precisa se preocupar com ligar o banco, ele vai tá o tempo todo ligado lá, só vai precisar conectar o ORM ao banco

ORM é o ```Mapeamento Objeto-Relacional```, é como a gente vai escrever consulta pro banco sem escrever SQL puro, vou criar uma rota básica pra tu vê como vai ser inscrito

### Seed
    npm run seed
Apagando os dados que já estão no banco e adicionando novos dados pra teste, porém recomendo criar um usuário em um API Client como ```Postman```, já que 90% das rotas utilizam de *cookie-sections*(cookies de sessão), com seu *JWT*

### Env

Existe um arquivo chamado ```env.ts```, que informa quais são as *variáveis de ambiente* necessárias para executar a API 

*(você só conseguirá executar com esses envs)*
    
      npm run dev
      
Executa a API e o Websocket

### Routes

{...}

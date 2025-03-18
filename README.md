## Como rodar a API
O banco ta sendo rodado pela Neon Database, eles sobem em uma instância da AWS, então não precisa se preocupar com ligar o banco, ele vai tá o tempo todo ligado lá, só vai precisar conectar o ORM ao banco

ORM é o ```Mapeamento Objeto-Relacional```, é como a gente vai escrever consulta pro banco sem escrever SQL puro, vou criar uma rota básica pra tu vê como vai ser inscrito

### Drizzle Kit
    npx drizzle-kit generate
Vai gerar o SQL das tabelas e criar um arquivo de migration pra caso tu queira ver o SQL que foi gerado

      npx drizzle-kit migrate
Vai executar esse SQL lá no banco, pegando a ```DATABASE URL```, que vai tá no teu arquivo ```.env``` como variável de ambiente pra não ser exposto

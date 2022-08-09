# Aplicações para cenários reais

## Executando o repositório

- Clone o repositório e abra sua raiz no terminal;
- Execute o comando: `npm install`;
- Garanta que em sua máquina você possua o MySQL instalado;
    - Crie um arquivo '.env' com base no '.env.sample' e configure corretamente sua conexão ao banco de dados;
- Execute a aplicação com `npm start`, ou no modo de desenvolvimento: `npm run start:dev`;

## Gerando Build

- Execute o comando `npm run build`;

A distribuição estará na pasta `build`;

## Rotas da API

### Users

- GET /users

- POST /users
{
    name: "string",
    password: "string",
    email: "string"
}
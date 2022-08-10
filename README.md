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

- GET /user

headers: {
    session-token: "string"
}

response: {
    "id": "8f5a1b92-18b6-11ed-8f30-070401f7d74d",
    "name": "Jonny",
    "email": "email@test.com",
    "createdAt": "2022-08-10T14:13:08.000Z",
    "updatedAt": "2022-08-10T14:13:08.000Z"
}
> Retorna o usuário logado no sistema

- POST /user

body: {
    name: "string",
    password: "string",
    email: "string"
}

headers: {
    session-token: "string"
}
> Cria um novo usuário

- PUT /user

body: {
    name: "string",
    email: "string"
}

headers: {
    session-token: "string"
}
> Atualiza o usuário logado no sistema

- DELETE /user

headers: {
    session-token: "string"
}
> Deleta o usuário logado

### Auth

- POST /auth/login

body: {
    email: "string",
    password: "string"
}
> Retorna o session-token (necessário para as outras requests) com validade de 2 horas

- POST /auth/refresh

headers: {
    session-token: "string"
}
> Retorna um novo session-token com expiração renovada para mais 2 horas, caso o token passado ainda não esteja vencido

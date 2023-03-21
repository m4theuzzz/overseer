# Overseer

## Executando o repositório para desenvolvimento

- Clone o repositório e abra sua raiz no terminal;
- Caso não possua Docker instalado, instale através deste link: [https://www.docker.com]
- Na raiz da pasta `Codigo` execute os comandos: `npm install`, `npm install --dev`, `(cd ./frontend && npm install)` e `docker compose up`
- O objetivo de executar estes comandos fora do docker é possuir todas as dependências localmente para que sua IDE de edição de código reconheça os pacotes, mas realizar estas instalações não é necessário para a execução do projeto.
- O frontend estará rodando em `http://localhost/login` e a API em: `http://localhost:3000`

## Gerando Build

- Execute o comando `npm run build`;

A distribuição estará na pasta `build`;

## Rotas da API

### Auth

- POST /auth/login

body:

```
{
    email: "string",
    password: "string"
}
```

response (200 OK):

```
{
    "session-token": "string"
}
```

> Retorna o session-token (necessário para as outras requests) com validade de 2 horas

- POST /auth/refresh

headers:

```
{
    session-token: "string"
}
```

response (200 OK):

```
{
    "session-token": "string"
}
```

> Retorna um novo session-token com expiração renovada para mais 2 horas, caso o token passado ainda não esteja vencido


### Users

- GET /users

headers:

```
{
    session-token: "string"
}
```

response (200 OK):

```
[
    {
        "id": "1",
        "name": "Jonny",
        "email": "email@test.com",
        "phone": null,
        "level": 7,
        "createdAt": "2022-08-24T03:04:31.000Z",
        "updatedAt": "2022-08-24T03:04:31.000Z"
    },
    ...
]
```

> Retorna os usuários da mesma empresa

- GET /users/:id

headers:

```
{
    session-token: "string"
}
```

response (200 OK):

```
{
    "id": "1",
    "name": "Jonny",
    "email": "email@test.com",
    "phone": null,
    "level": 7,
    "createdAt": "2022-08-24T03:04:31.000Z",
    "updatedAt": "2022-08-24T03:04:31.000Z"
}
```

> Retorna o usuário indicado, desde que pertença a mesma empresa

- POST /users

body:

```
{
    name: "string",         //required
    password: "string",     //required
    email: "string",        //required
    level: "int"
}
```

headers:

```
{
    session-token: "string"
}
```

response (200 OK):

```
"Usuário criado com sucesso."
```

> Cria um novo usuário da mesma empresa

- PUT /users/:id

headers:

```
{
    session-token: "string"
}
```

body:

```
{
    name: "string",     //required
    email: "string",     //required
    level: "number"
}
```

response (200 OK):

```
"Usuário atualizado com sucesso."
```

> Atualiza o usuário indicado, caso pertença à mesma empresa

- DELETE /users/:id

headers:

```
{
    session-token: "string"
}
```

response (200 OK):

```
"Usuário removido com sucesso."
```

> Deleta o usuário desde que pertença à mesma empresa

### Clients

- GET /clients

headers:

```
{
    session-token: "string"
}
```

response (200 OK):

```
[
    {
        "id": "1",
        "company_id": "1",
        "name": "Cliente teste 1",
        "cpf_cnpj": "00.000.000/0001-00",
        "email": "clinte@teste.com",
        "phone": "+55(31)98765-4321",
        "address": "Rua Sinhá, 555",
        "created_by": "1",
        "created_at": "2022-08-24T03:04:31.000Z",
        "updated_at": "2022-08-24T03:04:31.000Z"
    },
    ...
]
```

> Retorna todos os clientes associados ao usuário logado

- GET /clients/:id

headers:

```
{
    session-token: "string"
}
```

response (200 OK):

```
{
    "id": "string",
    "user_id": "string",
    "name": "string",
    "cpf_cnpj": "string",
    "email": "string",
    "phone": "string",
    "address": "string",
    "created_at": "datetime",
    "updated_at": "datetime"
}
```

> Retorna o cliente indicado, caso ele pertença ao usuário logado

- POST /clients

headers:

```
{
    session-token: "string"
}
```

body:

```
{
    "name": string,     //required
    "cpf_cnpj": string, //required
    "email": string,    //required
    "phone": string,
    "address": string
}
```

response (200 OK):

```
"Cliente criado com sucesso."
```

> Cadastra um novo cliente associado ao usuário logado

- PUT /clients/:id

headers:

```
{
    session-token: "string"
}
```

body:

```
{
    "name": string,     //required
    "cpf_cnpj": string, //required
    "email": string,    //required
    "phone": string,
    "address": string
}
```

response (200 OK):

```
"Cliente atualizado com sucesso."
```

> Atualiza um cliente, caso ele pertença ao usuário logado

- DELETE /clients/:id

headers:

```
{
    session-token: "string"
}
```

response (200 OK):

```
"Cliente removido com sucesso."
```

> Remove um cliente, caso ele pertença ao usuário logado

### Constructions

- GET /constructions

headers:

```
{
    session-token: "string"
}
```

response (200 OK):

```
[
    {
        "id": "1",
        "company_id": "1",
        "client_id": "1",
        "name": "Obra 1",
        "status": "budget",
        "address": "Rua Sôór e Sange, 666",
        "created_by": "1",
        "created_at": "2022-08-24T13:34:47.000Z",
        "updated_at": "2022-08-24T13:34:47.000Z"
    },
    ...
]
```

> Retorna todos as construções associadas ao usuário logado

- GET /constructions/:id

headers:

```
{
    session-token: "string"
}
```

response (200 OK):

```
{
    "id": "1",
    "company_id": "1",
    "client_id": "1",
    "name": "Obra 1",
    "status": "budget",
    "address": "Rua Sôór e Sange, 666",
    "created_by": "1",
    "created_at": "2022-08-24T13:34:47.000Z",
    "updated_at": "2022-08-24T13:34:47.000Z"
}
```

> Retorna a construção indicada, caso ele pertença ao usuário logado

- POST /constructions

headers:

```
{
    session-token: "string"
}
```

body:

```
{
    "client_id": "1",
    "name": "Obra POST Test 2",
    "status": "budget",
    "address": "Rua Aloho Mora, 24"
}
```

response (200 OK):

```
"Obra criada com sucesso."
```

> Cadastra uma nova construção associado ao usuário logado

- PUT /constructions/:id

headers:

```
{
    session-token: "string"
}
```

body:

```
{
    "client_id": "1",
    "name": "Obra PUT Test",
    "status": "budget",
    "address": "Rua Aloho Mora, 2469"
}
```

response (200 OK):

```
"Obra atualizada com sucesso."
```

> Atualiza uma construção, caso ela pertença ao usuário logado

- DELETE /constructions/:id

headers:

```
{
    session-token: "string"
}
```

response (200 OK):

```
"Obra removida com sucesso."
```

> Remove uma, caso ele pertença ao usuário logado

### Budgets

- GET /budgets

headers:

```
{
    session-token: "string"
}
```

response (200 OK):

```
[
    {
        "id": "1",
        "company_id": "1",
        "client_id": "1",
        "construction_id": "1",
        "created_by": "1",
        "created_at": "2022-08-24T13:34:47.000Z",
        "updated_at": "2022-08-24T13:34:47.000Z"
    },
    ...
]
```

> Retorna todos os orçamentos associados ao usuário logado

- GET /budgets/:id

headers:

```
{
    session-token: "string"
}
```

response (200 OK):

```
{
    "id": "1",
    "company_id": "1",
    "client_id": "1",
    "construction_id": "1",
    "created_by": "1",
    "created_at": "2022-08-24T13:34:47.000Z",
    "updated_at": "2022-08-24T13:34:47.000Z"
}
```

> Retorna o orçamento indicado, caso ele pertença ao usuário logado

- GET /budgets/:id/services

headers:

```
{
    session-token: "string"
}
```

response (200 OK):

```
[
    {
        "company_id": "1",
        "budget_id": "1",
        "service_id": "1",
        "quantity": 4,
        "sector": "Primeiro Andar",
        "deadline": "2023-01-12T13:00:00.000Z",
        "status": "ok",
        "type": "default",
        "overrides": null,
        "created_at": "2022-08-24T13:34:47.000Z",
        "updated_at": "2022-08-24T13:34:47.000Z"
    },
    ...
]
```

> Retorna os serviços do orçamento indicado, caso ele pertença ao usuário logado

- POST /budgets

headers:

```
{
    session-token: "string"
}
```

body:

```
{
    "client_id": "1",
    "construction_id": "1"
}
```

response (200 OK):

```
"Orçamento criado com sucesso."
```

> Cadastra um novo orçamento associado ao usuário logado

- POST /budgets/:id/services

headers:

```
{
    session-token: "string"
}
```

body:

```
{
    "serviceId": "1",
    "quantity": 5,
    "sector": "Primeiro",
    "deadline": null,
    "status": "ok",
    "type": "default",
    "overrides": null
}
```

response (200 OK):

```
"Serviço inserido no orçamento com sucesso"
```

> Cadastra um novo serviço no orçamento indicado

- PUT /budgets/:id

headers:

```
{
    session-token: "string"
}
```

body:

```
{
    "client_id": "1",
    "construction_id": "1"
}
```

response (200 OK):

```
"Orçamento atualizado com sucesso."
```

> Atualiza um orçamento, caso ele pertença ao usuário logado

- DELETE /budgets/:id

headers:

```
{
    session-token: "string"
}
```

response (200 OK):

```
"Orçamento removido com sucesso."
```

> Remove um orçamento, caso ele pertença ao usuário logado

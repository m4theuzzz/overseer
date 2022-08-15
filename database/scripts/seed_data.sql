-- senha: 123456789
INSERT INTO Users(
    name,
    password,
    email
) VALUES (
    'Jonny',
    'XFPM4gXEShxUbXfIcgIOevlsWEdPidZEnhvcFynjnBF+kmEn9EC7Izhx4kuZ4HNREnd1v0/7ILS9Q+NbOOOGdkR8VDKyh34hBqGatuHXk5H8IUe0cz4VM2erfgXMofVZYsca5jH1sV4T',
    'email@test.com'
);

INSERT INTO Clients(
    user_id,
    name,
    cpf_cnpj,
    email,
    phone,
    address
) VALUES (
    '8f5a1b92-18b6-11ed-8f30-070401f7d74d',
    'Cliente teste 1',
    '00.000.000/0001-00',
    'clinte@teste.com',
    '+55(31)98765-4321',
    'Rua Sinhá, 555'
), (
    '8f5a1b92-18b6-11ed-8f30-070401f7d74d',
    'second test client',
    '00.000.000/0002-00',
    'test@client.com',
    '+1(201)2987481',
    'Sinhá St., 555'
);

INSERT INTO Services(
    user_id,
    name,
    description,
    employee_role,
    productivity,
    mesure_unit,
    daily_cost,
    hour_cost,
    sq_meter_cost
) VALUES (
    '8f5a1b92-18b6-11ed-8f30-070401f7d74d',
    'Assentamento de cerâmica - Pedreiro',
    'teste servico 1.0',
    'Pedreiro',
    1.2,
    'm²/dia',
    150.00,
    21.43,
    17.86
), (
    '8f5a1b92-18b6-11ed-8f30-070401f7d74d',
    'Assentamento de cerâmica - Servente',
	'teste servico 1.1',
    'Servente',
    1.2,
    'm²/dia',
    70.00,
    10.00,
    8.34
);

INSERT INTO Constructions(
    user_id,
    name,
    status,
    address
) VALUES (
    '8f5a1b92-18b6-11ed-8f30-070401f7d74d',
    'Obra 1',
    'budget',
    'Rua Sôór e Sange, 666'
), (
    '8f5a1b92-18b6-11ed-8f30-070401f7d74d',
    'Obra 2',
    'constructing',
    'Rua Dô e Safrimentu, 333'
);

INSERT INTO Budgets(
    user_id,
    construction_id,
    service_id,
    quantity,
    sector,
    deadline
) VALUES (
    '8f5a1b92-18b6-11ed-8f30-070401f7d74d',
    'b2203778-1cdb-11ed-8ef8-01ea9425fc81',
    'b21fc022-1cdb-11ed-8ef8-01ea9425fc81',
    4,
    'Primeiro Andar',
    '2023-01-12 10:00:00'
), (
    '8f5a1b92-18b6-11ed-8f30-070401f7d74d',
    'b2203778-1cdb-11ed-8ef8-01ea9425fc81',
    'b21fc59a-1cdb-11ed-8ef8-01ea9425fc81',
    2,
    'Segundo Andar',
    '2023-01-21 10:00:00'
), (
    '8f5a1b92-18b6-11ed-8f30-070401f7d74d',
    'b22040a6-1cdb-11ed-8ef8-01ea9425fc81',
    'b21fc022-1cdb-11ed-8ef8-01ea9425fc81',
    2,
    'Fundação',
    '2022-11-10 10:00:00'
);

INSERT INTO Transactions(
    user_id,
    budget_id,
    name,
    value,
    file
) VALUES (
    '8f5a1b92-18b6-11ed-8f30-070401f7d74d',
    'e9468e80-1cdd-11ed-8ef8-01ea9425fc81',
    'Pagamento 1',
    -1097.53,
    null
), (
    '8f5a1b92-18b6-11ed-8f30-070401f7d74d',
    'e946a23a-1cdd-11ed-8ef8-01ea9425fc81',
    'Pagamento 2',
    127.57,
    null
), (
    '8f5a1b92-18b6-11ed-8f30-070401f7d74d',
    'e946a47e-1cdd-11ed-8ef8-01ea9425fc81',
    'Pagamento 3',
    -562.10,
    null
);

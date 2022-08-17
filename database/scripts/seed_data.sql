-- senha: 123456789
INSERT INTO Users(
    id,
    name,
    password,
    email,
    cnpj,
    phone
) VALUES (
    '1',
    'Jonny',
    'XFPM4gXEShxUbXfIcgIOevlsWEdPidZEnhvcFynjnBF+kmEn9EC7Izhx4kuZ4HNREnd1v0/7ILS9Q+NbOOOGdkR8VDKyh34hBqGatuHXk5H8IUe0cz4VM2erfgXMofVZYsca5jH1sV4T',
    'email@test.com',
    '00.000.000/0000-00',
    null
);

INSERT INTO Clients(
    id,
    user_id,
    name,
    cpf_cnpj,
    email,
    phone,
    address
) VALUES (
    '1',
    '1',
    'Cliente teste 1',
    '00.000.000/0001-00',
    'clinte@teste.com',
    '+55(31)98765-4321',
    'Rua Sinhá, 555'
), (
    '2',
    '1',
    'second test client',
    '00.000.000/0002-00',
    'test@client.com',
    '+1(201)2987481',
    'Sinhá St., 555'
);

INSERT INTO Services(
    id,
    user_id,
    name,
    description,
    employee_role,
    mesure_unit,
    daily_cost,
    hour_cost,
    sq_meter_cost,
    error_margin,
    coefficient,
    multiplier
) VALUES (
    '1',
    '1',
    'Assentamento de cerâmica - Pedreiro',
    'teste servico 1.0',
    'Pedreiro',
    'm²/dia',
    150.00,
    21.43,
    17.86,
    0.05,
    1.2,
    'daily'
), (
    '2',
    '1',
    'Assentamento de cerâmica - Servente',
	'teste servico 1.1',
    'Servente',
    'm²/dia',
    70.00,
    10.00,
    8.34,
    0.05,
    0.8,
    'daily'
);

INSERT INTO Constructions(
    id,
    user_id,
    client_id,
    name,
    status,
    address
) VALUES (
    '1',
    '1',
    '1',
    'Obra 1',
    'budget',
    'Rua Sôór e Sange, 666'
), (
    '2',
    '1',
    '2',
    'Obra 2',
    'constructing',
    'Rua Dô e Safrimentu, 333'
);

INSERT INTO Budgets(
    id,
    user_id,
    client_id,
    construction_id,
    service_id,
    quantity,
    sector,
    deadline,
    status
) VALUES (
    '1',
    '1',
    '1',
    '1',
    '1',
    4,
    'Primeiro Andar',
    '2023-01-12 10:00:00',
    null
), (
    '2',
    '1',
    '1',
    '1',
    '2',
    2,
    'Segundo Andar',
    '2023-01-21 10:00:00',
    null
), (
    '3',
    '1',
    '2',
    '2',
    '1',
    2,
    'Fundação',
    '2022-11-10 10:00:00',
    null
);

INSERT INTO Transactions(
    id,
    user_id,
    budget_id,
    name,
    description,
    value,
    type,
    scheduling,
    file
) VALUES (
    '1',
    '1',
    '1',
    'Pagamento 1',
    'Descrição 1',
    -1097.53,
    'salary',
    '2022-08-16 00:00:00',
    null
), (
    '2',
    '1',
    '2',
    'Pagamento 2',
    'Descrição 2',
    127.57,
    'revenue',
    '2022-10-15 06:00:00',
    null
), (
    '3',
    '1',
    '3',
    'Pagamento 3',
    'Descrição 3',
    -562.10,
    'transport',
    '2022-08-16 03:00:00',
    null
);

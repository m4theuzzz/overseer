USE Overseer;

INSERT INTO Companies(
    name,
    cnpj,
    logo
) VALUES (
    'Lider Redes',
    '123456789000123',
    null
);

INSERT INTO Users(
    id,
    company_id,
    level,
    name,
    password,
    email,
    phone
) VALUES (
    '1',
    '1',
    '10',
    'Overseer',
    'kg0tHftBDJzapEtTfN3nFGCm4C1FzPLBkGIMrU6cnOgZUlOmeTEQg/eAWIZTcIVgEK4HWyuj7XQkMMP+9UARcLMJsAJqSO/E3jInAqTZsBu0ZdT/WnlEJffAIPTa14LqunkV7T7/xsY+RIR7+6cYQHkIdKo=',
    'admin@overseer.com',
    null
);

INSERT INTO Transactions(
    id,
    company_id,
    name,
    value,
    type,
    created_by
) VALUES (
    '1',
    '1',
    'Transaction Base',
    0,
    'incoming',
    '1'
);

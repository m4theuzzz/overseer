CREATE SCHEMA IF NOT EXISTS Overseer;

USE Overseer;

CREATE TABLE IF NOT EXISTS Companies (
    id int not null unique auto_increment,
    name varchar(64) not null,
    cnpj varchar(24) unique not null,
    logo text default null,
    created_at datetime not null default current_timestamp,
    updated_at datetime not null default current_timestamp on update current_timestamp,
    PRIMARY KEY(id)
);

CREATE TABLE IF NOT EXISTS Users (
	id int not null unique auto_increment,
    company_id int not null,
    name varchar(64) not null,
    password text not null,
    email varchar(64) unique not null,
    phone varchar(24) default null,
    level integer not null default 7, -- 0 a 7, definindo quais tabelas tem direito de acessar
    profile_image longtext default null,
    created_at datetime not null default current_timestamp,
    updated_at datetime not null default current_timestamp on update current_timestamp,
    PRIMARY KEY(id),
    FOREIGN KEY(company_id) REFERENCES Companies(id) ON DELETE CASCADE
) ENGINE = InnoDB;

CREATE TABLE IF NOT EXISTS Addresses (
    id int not null unique auto_increment,
    company_id int not null,
    cep bigint(14) not null,
    state varchar(32) not null,
    city varchar(32) not null,
    street varchar(64) not null,
    district varchar(32) not null,
    number int not null,
    created_at datetime not null default current_timestamp,
    updated_at datetime not null default current_timestamp on update current_timestamp,
    PRIMARY KEY(id),
    FOREIGN KEY(company_id) REFERENCES Companies(id) ON DELETE CASCADE
) ENGINE = InnoDB;

CREATE TABLE IF NOT EXISTS Clients (
	id int not null unique auto_increment,
    company_id int not null,
    name varchar(64) not null,
    cpf_cnpj varchar(24) not null unique,
    email varchar(64) not null unique,
    phone varchar(24) default null,
    address_id int not null,
    created_by int,
    created_at datetime not null default current_timestamp,
    updated_at datetime not null default current_timestamp on update current_timestamp,
    PRIMARY KEY(id),
    FOREIGN KEY(address_id) REFERENCES Addresses(id),
    FOREIGN KEY(created_by) REFERENCES Users(id) ON DELETE SET NULL,
    FOREIGN KEY(company_id) REFERENCES Companies(id) ON DELETE CASCADE
) ENGINE = InnoDB;

CREATE TABLE IF NOT EXISTS Services (
	id int not null unique auto_increment,
    company_id int not null,
    name varchar(64) not null unique,
    description text default null,
    employee_role varchar(16) default null,
    mesure_unit varchar(8) not null,
    unity_cost float default null,
    error_margin float not null default 0,
    coefficient float not null,
    multiplier varchar(32) not null, -- forma como o serviço será multiplicado --
    created_by int,
	created_at datetime not null default current_timestamp,
    updated_at datetime not null default current_timestamp on update current_timestamp,
    PRIMARY KEY(id),
    FOREIGN KEY(created_by) REFERENCES Users(id) ON DELETE SET NULL,
    FOREIGN KEY(company_id) REFERENCES Companies(id) ON DELETE CASCADE
) ENGINE = InnoDB;

CREATE TABLE IF NOT EXISTS Constructions (
	id int not null unique auto_increment,
    company_id int not null,
    client_id int not null,
    name varchar(64) not null unique,
    address_id int not null,
    incoming_margin int not null default 17,
    teams int not null default 1,
    created_by int,
    created_at datetime not null default current_timestamp,
    updated_at datetime not null default current_timestamp on update current_timestamp,
    PRIMARY KEY(id),
    FOREIGN KEY(created_by) REFERENCES Users(id) ON DELETE SET NULL,
    FOREIGN KEY(client_id) REFERENCES Clients(id),
    FOREIGN KEY(address_id) REFERENCES Addresses(id),
    FOREIGN KEY(company_id) REFERENCES Companies(id) ON DELETE CASCADE
) ENGINE = InnoDB;

CREATE TABLE IF NOT EXISTS Budgets (
    id int not null unique auto_increment,
	company_id int not null,
    client_id int not null,
    construction_id int not null,
    name varchar(64) not null,
    status varchar(16) not null default "budget", -- etapas: "budget", "construction", "finished"
    construction_start datetime default null,
    construction_end datetime default null,
    created_by int,
    created_at datetime not null default current_timestamp,
    updated_at datetime not null default current_timestamp on update current_timestamp,
    PRIMARY KEY(id),
    FOREIGN KEY(created_by) REFERENCES Users(id) ON DELETE SET NULL,
    FOREIGN KEY(construction_id) REFERENCES Constructions(id) ON DELETE CASCADE,
    FOREIGN KEY(client_id) REFERENCES Clients(id) ON DELETE CASCADE,
    FOREIGN KEY(company_id) REFERENCES Companies(id) ON DELETE CASCADE
) ENGINE = InnoDB;

CREATE TABLE IF NOT EXISTS BudgetServices (
    id int not null unique auto_increment,
    company_id int not null,
    budget_id int not null,
    service_id int not null,
    quantity integer not null default 1,
    sector varchar(128) default null,
    deadline datetime default null,
    status varchar(16) not null default "ok", -- como foi alterado
    type varchar(16) not null default "default", -- quando foi adicionado
    budgetedCost int default null,
    overrides varchar(64) default null,
    created_at datetime not null default current_timestamp,
    updated_at datetime not null default current_timestamp on update current_timestamp,
    FOREIGN KEY(company_id) REFERENCES Companies(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS Transactions (
    id int not null unique auto_increment,
	company_id int not null,
    budget_id int default null,
    service_id int default null,
    name varchar(32) not null,
    description text default null,
    value float not null default 0.00,
    type varchar(32) default null, -- tipo de despesa: "recebimento", "insumo", "salário", etc. --
    scheduling datetime default current_timestamp,
    file longtext default null, -- cupom fiscal --
    created_by int,
    created_at datetime not null default current_timestamp,
    updated_at datetime not null default current_timestamp on update current_timestamp,
    FOREIGN KEY(created_by) REFERENCES Users(id) ON DELETE SET NULL,
    FOREIGN KEY(budget_id) REFERENCES Budgets(id) ON DELETE SET NULL,
    FOREIGN KEY(service_id) REFERENCES Services(id) ON DELETE SET NULL,
    FOREIGN KEY(company_id) REFERENCES Companies(id) ON DELETE CASCADE,
    PRIMARY KEY(id)
) ENGINE = InnoDB;

DELIMITER $;

CREATE TRIGGER bud_sec_ins
    BEFORE INSERT
    ON BudgetServices
    FOR EACH ROW
BEGIN
    IF (
        new.sector IN (SELECT sector FROM BudgetServices WHERE service_id = new.service_id AND budget_id = new.budget_id AND status = "ok")
    )
    THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Este setor já possui este serviço';
    END IF;
END;

CREATE TRIGGER dataSafetyBeforeDelete
    BEFORE DELETE
    ON BudgetServices
    FOR EACH ROW
BEGIN
    IF (
        (SELECT B.status
        FROM Budgets B
        INNER JOIN Constructions C
        ON C.id = B.construction_id
        WHERE B.id = old.budget_id) != "budget"
    )
    THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Você não pode remover serviços de uma obra que não esteja em etapa de orçamento. Ao invés disso, tente editar seu estado.';
    END IF;
END;

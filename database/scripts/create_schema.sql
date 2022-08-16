USE Overseer;

CREATE TABLE IF NOT EXISTS Users (
	id varchar(64) default (uuid()) unique not null,
    name varchar(64) not null,
    password text not null,
    email varchar(64) unique not null,
    phone varchar(24) default null,
    created_at datetime default current_timestamp,
    updated_at datetime default current_timestamp on update current_timestamp,
    PRIMARY KEY(id)
) ENGINE = InnoDB;

CREATE TABLE IF NOT EXISTS Clients (
	id varchar(64) default (uuid()) unique not null,
    user_id varchar(64) not null,
    name varchar(64) not null,
    cpf_cnpj varchar(24) not null unique,
    email varchar(64) not null unique,
    phone varchar(24) default null,
    address varchar(64) default null,
    created_at datetime default current_timestamp,
    updated_at datetime default current_timestamp on update current_timestamp,
    PRIMARY KEY(id),
    FOREIGN KEY(user_id) REFERENCES Users(id) ON DELETE CASCADE
) ENGINE = InnoDB;

CREATE TABLE IF NOT EXISTS Services (
	id varchar(64) default (uuid()) unique not null,
    user_id varchar(64) not null,
    name varchar(64) not null unique,
    description text,
    employee_role varchar(16) default null,
    productivity float not null,
    mesure_unit varchar(8) not null,
    daily_cost float default null, -- avaliar necessidade: pode ser calculado a partir do sq_meter_cost * productivity --
    hour_cost float default null, -- avaliar necessidade: pode ser calculado a partir do daily_cost --
    sq_meter_cost float not null,
    error_margin float default 0,
    coefficient float not null,
    multiplier varchar(32) not null, -- forma como o serviço será multiplicado --
	created_at datetime default current_timestamp,
    updated_at datetime default current_timestamp on update current_timestamp,
    PRIMARY KEY(id),
    FOREIGN KEY(user_id) REFERENCES Users(id) ON DELETE CASCADE
) ENGINE = InnoDB;

CREATE TABLE IF NOT EXISTS Constructions (
	id varchar(64) default (uuid()) unique not null,
    user_id varchar(64) not null,
    client_id varchar(64) not null,
    name varchar(64) not null unique,
    status varchar(16) not null default "budget", -- etapas: "budget", "construction", "finished"
    address varchar(128) not null,
    created_at datetime default current_timestamp,
    updated_at datetime default current_timestamp on update current_timestamp,
    PRIMARY KEY(id),
    FOREIGN KEY(client_id) REFERENCES Clients(id),
    FOREIGN KEY(user_id) REFERENCES Users(id) ON DELETE CASCADE
) ENGINE = InnoDB;

CREATE TABLE IF NOT EXISTS Budgets (
	id varchar(64) default (uuid()) unique not null,
	user_id varchar(64) not null,
    construction_id varchar(64) not null,
    service_id varchar(64) not null,
    quantity integer not null default 1,
    sector varchar(64) default null,
    deadline datetime default null,
    created_at datetime default current_timestamp,
    updated_at datetime default current_timestamp on update current_timestamp,
    PRIMARY KEY(id),
    FOREIGN KEY(construction_id) REFERENCES Constructions(id) ON DELETE CASCADE,
    FOREIGN KEY(service_id) REFERENCES Services(id) ON DELETE CASCADE,
    FOREIGN KEY(user_id) REFERENCES Users(id) ON DELETE CASCADE
) ENGINE = InnoDB;

CREATE TABLE IF NOT EXISTS Transactions (
	id varchar(64) default (uuid()) unique not null,
	user_id varchar(64) not null,
    budget_id varchar(64) default null,
    name varchar(32) not null,
    description text default null,
    value float not null default 0.00,
    type varchar(32) default null, -- tipo de despesa: "recebimento", "insumo", "salário", etc. --
    scheduling datetime default current_timestamp,
    file text default null, -- cupom fiscal --
    created_at datetime default current_timestamp,
    updated_at datetime default current_timestamp on update current_timestamp,
    PRIMARY KEY(id),
    FOREIGN KEY(budget_id) REFERENCES Budgets(id),
    FOREIGN KEY(user_id) REFERENCES Users(id) ON DELETE CASCADE
) ENGINE = InnoDB;

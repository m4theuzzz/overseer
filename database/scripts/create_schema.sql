CREATE DATABASE [IF NOT EXISTS] Overseer;

USE Overseer;

CREATE TABLE [IF NOT EXISTS] Users (
	id varchar(64) default (uuid()) unique not null Primary Key,
    name varchar(64) not null,
    password text not null,
    email varchar(64) unique not null,
    created_at datetime default current_timestamp,
    updated_at datetime default current_timestamp on update current_timestamp
) ENGINE = InnoDB;
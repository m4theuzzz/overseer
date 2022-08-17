CREATE USER 'admin'@'localhost' IDENTIFIED BY 'toor';

SET GLOBAL log_bin_trust_function_creators = 1;

GRANT ALL PRIVILEGES ON Overseer TO 'admin'@'localhost' WITH GRANT OPTION;

flush PRIVILEGES;
USE Overseer;

CREATE USER 'admin' IDENTIFIED BY 'toor';

SET GLOBAL log_bin_trust_function_creators = 1;

GRANT ALL PRIVILEGES ON Overseer TO 'admin' WITH GRANT OPTION;

ALTER USER 'admin' IDENTIFIED WITH mysql_native_password BY 'toor';

ALTER USER 'root' IDENTIFIED WITH mysql_native_password BY 'toor';

flush PRIVILEGES;
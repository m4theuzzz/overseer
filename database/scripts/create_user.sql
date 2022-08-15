CREATE USER 'admin'@'localhost' IDENTIFIED BY 'toor';

GRANT ALL PRIVILEGES ON Overseer TO 'admin'@'localhost';

flush PRIVILEGES;
CREATE USER 'admin'@'localhost' IDENTIFIED BY 'toor';

GRANT ALL PRIVILEGES ON Overseer.Users TO 'admin'@'localhost';

flush PRIVILEGES;
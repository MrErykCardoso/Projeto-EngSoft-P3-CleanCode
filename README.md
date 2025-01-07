# Projeto-TCC---NoCleanCode

localgroup docker-users "user-id" /ADD

# criar uma imagem do docker Linux/MacOS
sudo docker run --name mysql-database \
  -e MYSQL_ROOT_PASSWORD=root123 \
  -e MYSQL_DATABASE=mysqlDatabase \
  -e MYSQL_USER=user \
  -e MYSQL_PASSWORD=user123 \
  -v ~/mysql_data:/var/lib/mysql \
  -p 3307:3306 \
  -d mysql:latest

# criar uma imagem do docker windows
docker run --name mysql-database -e MYSQL_ROOT_PASSWORD=root123 -e MYSQL_DATABASE=mysqlDatabase -e MYSQL_USER=user -e MYSQL_PASSWORD=user123 -v C:/Users/SeuUsuario/mysql_data:/var/lib/mysql -p 3307:3306 -d mysql:latest

FROM php:8.3-apache
RUN apt update && apt install  -y sqlite3 libsqlite3-dev pkg-config
RUN docker-php-ext-install pdo_sqlite
RUN mkdir -p /var/lib/lab && chown -R www-data:www-data /var/lib/lab
COPY apache-lab.conf /etc/apache2/conf-available/lab.conf
RUN a2enconf lab

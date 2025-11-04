FROM mysql:8.4

ENV MYSQL_ROOT_PASSWORD=changeit

COPY bgg.sql /docker-entrypoint-initdb.d

VOLUME /var/lib/mysql

#!/bin/bash
docker run -d -p 3306:3306 \
  -e MYSQL_ROOT_PASSWORD=changeit \
  chukmunnlee/bgg-database:nov-2025

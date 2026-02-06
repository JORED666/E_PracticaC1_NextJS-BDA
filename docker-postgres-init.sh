#!/bin/sh
# Script que ejecuta roles.sql con variables de entorno

echo "Ejecutando roles.sql con variables de entorno..."

# Exportar variables para que psql las pueda usar
export APP_DB_PASS="${APP_DB_PASS}"

# Ejecutar roles.sql con la variable disponible
psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" -f /docker-entrypoint-initdb.d/05_roles.sql

echo "Usuario app_user creado con contraseña desde variable de entorno"

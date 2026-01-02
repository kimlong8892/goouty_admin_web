#!/bin/bash
set -e

docker compose \
  -p goouty-api-local \
  -f docker-compose.local.yml \
  down

echo "Updating Admin Local containers..."
docker compose \
  -p goouty-api-local \
  -f docker-compose.local.yml \
  up -d --build admin_app admin_web

echo "Running composer install..."
docker compose \
  -p goouty-api-local \
  -f docker-compose.local.yml \
  exec -T admin_app composer install

echo "Running migrations..."
docker compose \
  -p goouty-api-local \
  -f docker-compose.local.yml \
  exec -T admin_app php artisan migrate

echo "Clearing cache..."
docker compose \
  -p goouty-api-local \
  -f docker-compose.local.yml \
  exec -T admin_app php artisan config:clear
docker compose \
  -p goouty-api-local \
  -f docker-compose.local.yml \
  exec -T admin_app php artisan cache:clear

echo "Local environment rebuilt successfully!"

#!/bin/bash
set -e


echo "Updating Admin Dev containers..."
docker compose -p goouty-api-dev -f docker-compose.dev.yml up -d --build admin_app admin_web

echo "Running migrations..."
docker compose -p goouty-api-dev -f docker-compose.dev.yml exec -T admin_app php artisan migrate --force

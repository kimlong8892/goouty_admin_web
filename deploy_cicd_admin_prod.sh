#!/bin/bash
set -e


echo "Updating Admin Prod containers..."
docker compose -p goouty-api-prod -f docker-compose.prod.yml up -d --build admin_app admin_web

echo "Running migrations..."
docker compose -p goouty-api-prod -f docker-compose.prod.yml exec -T admin_app php artisan migrate --force

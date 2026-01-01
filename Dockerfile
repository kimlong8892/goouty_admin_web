FROM php:8.4-fpm-alpine

WORKDIR /var/www

RUN apk update && apk add --no-cache \
    build-base \
    libpng-dev \
    libzip-dev \
    zip \
    unzip \
    git \
    curl \
    oniguruma-dev \
    libxml2-dev \
    postgresql-dev

RUN docker-php-ext-install pdo_mysql pdo_pgsql pgsql mbstring exif pcntl bcmath gd zip

COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

WORKDIR /var/www

# Copy composer files first for caching
COPY composer.json composer.lock ./

# Install dependencies
RUN composer install --no-dev --no-scripts --no-autoloader --prefer-dist

# Copy the rest of the application
COPY . /var/www

# Finish composer setup
RUN composer dump-autoload --optimize

RUN chown -R www-data:www-data /var/www

EXPOSE 9000
CMD ["php-fpm"]

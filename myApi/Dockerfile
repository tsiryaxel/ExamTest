FROM php:8.3-cli

# Installer les dépendances système
RUN apt-get update && apt-get install -y \
    git \
    unzip \
    libzip-dev \
    libonig-dev \
    mariadb-client \
    && docker-php-ext-install pdo pdo_mysql zip

# Installer Composer
COPY --from=composer:2.6 /usr/bin/composer /usr/bin/composer

# Copier le code
WORKDIR /app
COPY . .

# Installer les dépendances PHP
RUN composer install --no-interaction --optimize-autoloader

# Permissions pour cache et logs
RUN mkdir -p var/cache var/log && chown -R www-data:www-data var



# Exposer le port Symfony
EXPOSE 8000

# Commande par défaut : serveur interne Symfony
CMD ["php", "-S", "0.0.0.0:8000", "-t", "public"]

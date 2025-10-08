#!/bin/sh
set -e

# Attendre que la base de données soit disponible
until mariadb -h"$DB_HOST" -u"$DB_USER" --password="$DB_PASSWORD" -e "SELECT 1;" >/dev/null 2>&1; do
  sleep 1
done

echo "Base de données disponible, initialisation..."

# php bin/console doctrine:database:drop --if-exists --force 

php bin/console doctrine:database:create --if-not-exists
php bin/console d:s:u -f
php bin/console doctrine:fixtures:load  --no-interaction

# Créer la DB si elle n'existe pas
# php bin/console doctrine:database:create --if-not-exists

# Appliquer les migrations
# php bin/console doctrine:migrations:migrate --no-interaction

# Charger les fixtures (optionnel)
# php bin/console doctrine:fixtures:load --no-interaction



# Lancer le serveur Symfony
exec php -S 0.0.0.0:8000 -t public

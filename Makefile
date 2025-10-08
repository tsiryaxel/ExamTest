# ==============================================
# Makefile pour projet Angular 19 + Symfony + MariaDB
# ==============================================

COMPOSE = docker-compose
FRONT = frontend
BACK = backend
DB = db


# ==============================================
# Commandes principales
# ==============================================

# Build toutes les images Docker
build:
	$(COMPOSE) build

# Lancer tous les conteneurs en arrière-plan
up:
	$(COMPOSE) up -d

# Stopper et supprimer les conteneurs, réseaux, etc.
down:
	$(COMPOSE) down
	

# Initialiser la base de données (à lancer après 'make up')
init-db:
	$(COMPOSE) exec backend sh -c "\
	php bin/console lexik:jwt:generate-keypair --overwrite &&  \
	php bin/console doctrine:database:drop --if-exists --force && \
	php bin/console doctrine:database:create && \
	php bin/console doctrine:schema:update --force && \
	php bin/console doctrine:fixtures:load --no-interaction"


# ==============================================
# Lancer les services séparément
# ==============================================

# Lancer uniquement le frontend (Angular)
front:
	$(COMPOSE) up -d $(FRONT)

# Restart frontend uniquement
front-restart:
	$(COMPOSE) stop $(FRONT)
	$(COMPOSE) up -d $(FRONT)


# Lancer le backend (Symfony) + la base de données (MariaDB)
back:
	$(COMPOSE) up -d $(BACK) $(DB)

# Lancer uniquement la base de données
db:
	$(COMPOSE) up -d $(DB)

# ==============================================
# Shells interactifs
# ==============================================

# Ouvrir un shell dans le conteneur frontend
shell-front:
	$(COMPOSE) exec $(FRONT) sh

# Ouvrir un shell dans le conteneur backend
shell-back:
	$(COMPOSE) exec $(BACK) bash

# Ouvrir un shell dans le conteneur MariaDB
shell-db:
	$(COMPOSE) exec $(DB) sh

# ==============================================
# Logs
# ==============================================

# Logs de tous les services
logs:
	$(COMPOSE) logs -f

# Logs du frontend
logs-front:
	$(COMPOSE) logs -f $(FRONT)

# Logs du backend
logs-back:
	$(COMPOSE) logs -f $(BACK)

# Logs de la base de données
logs-db:
	$(COMPOSE) logs -f $(DB)

# ==============================================
# Maintenance / Utilitaires
# ==============================================

# Rebuild complet (avec suppression des anciens conteneurs)
rebuild:
	$(COMPOSE) down --volumes --remove-orphans
	$(COMPOSE) build --no-cache
	$(COMPOSE) up -d

# Nettoyer les volumes (⚠️ supprime les données de la BDD)
clean:
	$(COMPOSE) down -v --remove-orphans
	docker volume prune -f


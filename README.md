Exam Manager - Fullstack Symfony 7 & Angular
=========================

Description
-----------
Application de gestion des examens pour enseignants.

- Backend : Symfony 7 + API Platform
- Frontend : Angular 20 + Tailwind v4
- API sécurisée avec JWT
- Conteneurisation complète avec Docker Compose

Fonctionnalités
----------------
Backend :
- CRUD complet sur /api/exams
- GET only sur /api/students
- Validation des données côté serveur
- JWT pour sécuriser les routes
- Compatible MariaDB

Frontend :
- Page de login (email + mot de passe)
- Liste des examens avec badges colorés
- Indicateur du nombre d'examens par statut (Confirmé, À organiser, Annulé, En recherche de place)
- Formulaire pour ajouter un nouvel examen
- Gestion du statut via modal
- Mise à jour en temps réel avec `signal()` et `computed()`
- Respect du design mockup Tailwind v4

Conteneurisation
----------------
- Backend : Symfony 7 + PHP 8.3
- Frontend : Angular 20 + Node 22
- Base de données : MariaDB 10.4
- Tous les services démarrent avec `make up`

Prérequis
---------
- Docker & Docker Compose installés
- Make disponible

Installation et Démarrage
-------------------------
Build :
> make build

Démarrage de tous les services :
> make up


Init database :
> make init-db

Arrêt des services :
> make down

Commandes utiles
----------------
Backend :
> shell-back

Frontend :
> shell-front

Database :
> shell-db


Utilisateur/Admin par défaut
----------------------------
- Email : admin@example.com
- Mot de passe : secret123
- Rôle : ROLE_ADMIN
- Créé via fixtures : `UserFixtures.php`

Accès
-----
- Frontend : http://localhost:4200
- Backend API : http://localhost:8000/api
- MariaDB : port 3306, user=root, password=root, db=app

Notes
-----
- Clés JWT : `config/jwt/private.pem` / `public.pem`
- Token JWT stocké côté frontend dans localStorage
- Toute modification d'examen est instantanément reflétée dans l'interface
- Fixtures utilisées pour créer l’utilisateur admin par défaut

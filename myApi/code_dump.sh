#!/bin/sh
# ===============================================
# Script : dump_code.sh
# Objectif : Afficher le contenu des fichiers clés
# ===============================================

echo "===== DUMP DU CODE SYMFONY ====="
echo "Date : $(date)"
echo "--------------------------------"

# Liste des fichiers
FILES="
src/Entity/User.php
config/packages/security.yaml
config/packages/lexik_jwt_authentication.yaml
src/DataFixtures/UserFixtures.php
config/routes.yaml
composer.json
"

for FILE in $FILES; do
    if [ -f "$FILE" ]; then
        echo ""
        echo "===== FICHIER : $FILE ====="
        cat "$FILE"
        echo ""
    else
        echo ""
        echo "⚠️  Fichier manquant : $FILE"
        echo ""
    fi
done

echo "===== FIN DU DUMP ====="

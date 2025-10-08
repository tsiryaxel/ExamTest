#!/bin/sh
# ===============================================
# Script : code_dump.sh
# Objectif : Afficher le contenu de tous les fichiers sous ./src/
# ===============================================

echo "===== DUMP DU CODE ANGULAR 20 ====="
echo "Date : $(date)"
echo "--------------------------------"

# Vérifie si le répertoire ./src/ existe
if [ ! -d "./src/" ]; then
    echo "⚠️  Répertoire ./src/ introuvable !"
    exit 1
fi

# Récupérer tous les fichiers sous ./src/
FILES=$(find ./src/ -type f)

for FILE in $FILES; do
    echo ""
    echo "===== FICHIER : $FILE ====="
    cat "$FILE"
    echo ""
done

echo "===== FIN DU DUMP ====="

# Plexxo - Procédures de Développement

Ce document définit les standards et workflows obligatoires pour le projet Plexxo.

## 🔄 Workflow de Fin de Tâche
Avant de passer à une nouvelle étape ou phase du projet, les étapes suivantes **doivent** être respectées :

1. **Validation (Tests)** :
    - Exécuter la suite de tests complète : `php artisan test`.
    - Créer de nouveaux tests pour les fonctionnalités ajoutées.
    - Vérifier la qualité du code (Pint, Rector, PHPStan).

2. **Commit** :
    - Vérifier l'état des fichiers : `git status`.
    - Ajouter les fichiers pertinents : `git add .`.
    - Créer un commit avec un message clair et descriptif.

3. **Push** :
    - Envoyer les changements vers le dépôt distant : `git push`.

## 🛠️ Qualité du Code
- **Pint** : Formatage PSR-12 automatique.
- **Rector** : Refactoring automatisé pour PHP 8.4.
- **PHPStan** : Analyse statique (Niveau 5 minimum).

## 🧠 IA & RAG
- Les sources de documents (RAG) doivent être traitées en arrière-plan via des Jobs.
- L'Agent Réviseur doit toujours retourner une version améliorée du contenu.

---
*Dernière mise à jour : 14 Mars 2026*

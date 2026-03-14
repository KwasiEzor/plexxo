# Guide de Contribution - Plexxo

Merci de contribuer à Plexxo ! Pour maintenir une qualité de code exceptionnelle, nous suivons des procédures strictes.

## 🔄 Workflow de Fin de Tâche
Avant de soumettre une modification ou de passer à l'étape suivante, vous **devez** :

1. **Validation (Tests)** :
    - Exécuter la suite complète : `php artisan test --compact`.
    - Les nouveaux tests doivent être écrits en **Pest**.
    - Couverture minimale requise pour toute nouvelle feature.

2. **Qualité du Code (Linting)** :
    - Exécuter le pipeline de qualité : `composer run lint`.
    - Ce pipeline inclut :
        - **Laravel Pint** : Formatage automatique.
        - **Rector** : Refactoring PHP 8.4.
        - **PHPStan** : Analyse statique (doit être vierge d'erreurs).

3. **Soumission** :
    - Vérifier les fichiers : `git status`.
    - Commiter avec un message suivant la convention [Conventional Commits](https://www.conventionalcommits.org/).
    - Pusher vers la branche `main` (ou votre branche de feature).

## 🛠️ Standards Techniques

### Backend
- **Type Hinting** : Obligatoire partout (propriétés, paramètres, retours).
- **Enums** : Utiliser les Enums pour tout état fini (Status, Roles, Types).
- **Models** : Utiliser le format Laravel 11+ pour les casts (méthode `casts()`).
- **Dependencies** : Préférer les outils de l'écosystème Laravel (Cashier, MediaLibrary, Sluggable).

### Frontend (React)
- **Composants** : Utiliser les composants `shadcn/ui` existants dans `@/components/ui`.
- **Icons** : Utiliser exclusivement `lucide-react`.
- **Routes** : Utiliser **Wayfinder** pour les liens et les actions (ex: `route('projects.show', ...)`).

### IA
- Toute interaction LLM doit passer par `AIOrchestrator` ou utiliser les agents spécialisés dans `app/Services/AI`.
- Utiliser **Prism** pour les nouvelles fonctionnalités IA.

---
*Dernière mise à jour : 14 Mars 2026*

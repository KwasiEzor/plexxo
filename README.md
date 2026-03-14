# Plexxo - L'IA au Service de votre Créativité ✍️✨

**Plexxo** est une plateforme d'édition collaborative augmentée par l'intelligence artificielle, conçue pour transformer vos idées en ebooks professionnels (PDF, EPUB, HTML) en quelques minutes.

---

## 🚀 Vision
Devenir la "Forge" de référence pour les auteurs et créateurs de contenu, en combinant la rapidité des modèles de langage modernes (GPT-4o, Claude 3.5) avec une collaboration humaine fluide et des outils de distribution pro.

## ✨ Fonctionnalités Clés

### 🧠 Intelligence Artificielle Augmentée (Phase 3 & 5)
- **AI Forge** : Génération automatique de plans (Outlines) et rédaction assistée de chapitres.
- **RAG (Retrieval-Augmented Generation)** : Uploadez vos propres sources (PDF, Docx) pour que l'IA rédige en se basant sur vos données.
- **Agent Réviseur (Critic Agent)** : Analyse automatique du style, du ton et de la grammaire.
- **Traduction Culturelle** : Traduction intelligente adaptant les idiomes et les nuances locales.
- **Illustration IA** : Génération de couvertures professionnelles via DALL-E 3.

### 🎭 Collaboration & Studio (Phase 2)
- **Studio en Temps Réel** : Éditeur synchronisé via WebSockets (Laravel Reverb).
- **Indicateurs de Présence** : Visualisez qui travaille sur le projet en temps réel.
- **Système de Commentaires** : Discutez et résolvez des points précis chapitre par chapitre.
- **Gestion des Rôles** : Admin, Éditeur, Lecteur avec permissions granulaires.

### 💰 Monétisation & Distribution (Phase 4)
- **Abonnements Stripe** : Système Premium géré via Laravel Cashier.
- **Export Multi-format** : PDF haute qualité, EPUB (standard industriel) et HTML optimisé SEO.
- **Publication Directe** : Intégration avec Gumroad pour une mise en vente instantanée.

---

## 🛠️ Stack Technique

### Backend (Laravel 12)
- **PHP 8.4** : Utilisation intensive des Enums, readonly properties et typage strict.
- **Laravel Reverb** : Serveur WebSocket natif pour le temps réel.
- **Laravel Cashier** : Gestion des paiements Stripe.
- **Prism (AI SDK)** : Interface unifiée pour OpenAI et Anthropic.
- **Spatie MediaLibrary** : Gestion robuste des couvertures et fichiers sources.

### Frontend (React 19)
- **Inertia.js v2** : Expérience SPA avec la simplicité du routing Laravel.
- **Tailwind CSS v4** : Styling moderne et performant.
- **Shadcn/UI** : Composants d'interface élégants et accessibles.
- **Lucide React** : Iconographie cohérente.

---

## 🏗️ Architecture & Qualité
Le projet respecte les plus hauts standards d'ingénierie logicielle :
- **Analyse Statique** : PHPStan (Niveau 5).
- **Refactoring Automatisé** : Rector (Ruleset PHP 8.4).
- **Tests** : Suite complète avec Pest 4.
- **Standard de Code** : Laravel Pint (PSR-12).

---

## 🚀 Installation & Démarrage

1. **Cloner le projet** :
   ```bash
   git clone https://github.com/KwasiEzor/plexxo.git
   cd plexxo
   ```

2. **Installer les dépendances** :
   ```bash
   composer install
   npm install
   ```

3. **Configurer l'environnement** :
   ```bash
   cp .env.example .env
   php artisan key:generate
   ```

4. **Lancer les migrations & seeders** :
   ```bash
   php artisan migrate --seed
   ```

5. **Démarrer les serveurs** :
   ```bash
   # Terminal 1 : Backend & WebSockets
   php artisan serve
   php artisan reverb:start
   
   # Terminal 2 : Frontend
   npm run dev
   
   # Terminal 3 : Files d'attente (IA & Exports)
   php artisan queue:listen
   ```

---

## 📖 Documentation Détaillée
- [Architecture Technique](ARCHITECTURE.md)
- [Procédures de Développement](CONTRIBUTING.md)
- [Suivi de Progression](PROGRESS.md)

---
*© 2026 Plexxo AI. Tous droits réservés.*

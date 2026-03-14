# Architecture Technique - Plexxo

Ce document détaille les choix architecturaux et la structure technique profonde de Plexxo.

## 1. Modèle de Données & Domaine

### Enums (Type Casting)
Plexxo utilise des Enums PHP 8.4 pour garantir l'intégrité des états à travers l'application. Chaque modèle principal (`Project`, `Chapter`, `Source`) caste ses attributs critiques :
- `ProjectStatus` : Gère le cycle de vie du livre (Pending -> Generating -> Draft -> Finalized).
- `ChapterStatus` : Cycle précis (Empty -> Generating -> Revising -> Revised -> Translating -> Translated -> Draft).
- `SourceStatus` : État du RAG (Pending -> Processing -> Completed -> Failed).
- `UserRole` : Permissions (Admin, Editor, Viewer).

### Relations Clés
- `Project` hasMany `Chapter` (ordonnés par `order`).
- `Project` hasMany `Source` (pour le contexte RAG).
- `Project` belongsToMany `User` (via `ProjectUser` pivot avec casting de rôle).
- `Chapter` hasMany `Comment` (pour la collaboration).

## 2. Stratégie IA & Agents

### Prism (AI SDK)
L'application utilise **Prism** comme abstraction pour interagir avec les LLMs. Cela permet de changer de fournisseur (OpenAI vers Anthropic par exemple) sans modifier la logique métier.
`AIOrchestrator` est le point d'entrée unique pour obtenir une instance de service IA.

### Agents Spécialisés
- **DocumentExtractor** : Extrait le texte brut des PDF/Docx.
- **ReviewerAgent** : Analyse le contenu et retourne des suggestions structurées (JSON).
- **TranslatorAgent** : Effectue des traductions "culturelles" basées sur le contexte du projet.
- **ImageGenerator** : Utilise DALL-E 3 pour créer des couvertures sans texte, adaptées au sujet.

### RAG (Retrieval-Augmented Generation)
Le système de sources permet d'injecter du contexte spécifique dans les prompts de génération. Les documents sont traités en arrière-plan (`ProcessSourceDocument`) et leur contenu est concaténé lors de la rédaction des chapitres.

## 3. Temps Réel & Collaboration

### WebSockets (Reverb)
Plexxo utilise **Laravel Reverb** pour toutes les interactions asynchrones :
- **Presence Channels** : Suivi des utilisateurs actifs dans le Studio via `presence-project.{id}`.
- **Private Channels** : Diffusion des mises à jour de chapitres (`ChapterUpdated`) pour synchroniser les éditeurs et l'IA.

### Studio Editor
Le studio est une application React 19 complexe utilisant :
- `useEchoPresence` pour les avatars de présence.
- `useEcho` pour écouter les retours de l'IA.
- Un système de sauvegarde automatique (`Inertia.put`) avec gestion d'état pour éviter les conflits mineurs.

## 4. Exports & Distribution

### Pipeline d'Export
- **PDF** : Généré via `dompdf`, utilisant des templates Blade élégants.
- **EPUB** : Généré via `PHPePub`, respectant les standards de l'industrie (XHTML).
- **HTML SEO** : Page statique avec Meta Tags Open Graph et Twitter Cards complets.

### Monétisation
**Laravel Cashier** gère l'abonnement Premium. L'accès aux fonctionnalités avancées (RAG, Reviewer, Exports Pro) est protégé par des middlewares et des politiques basés sur l'état de l'abonnement Stripe de l'utilisateur.

---
*Dernière mise à jour : 14 Mars 2026*

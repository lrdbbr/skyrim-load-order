# CLAUDE.md

Ce fichier donne à Claude Code le contexte nécessaire pour travailler efficacement sur ce projet.

## Vue d'ensemble du projet

**Skyrim Load Order Manager** — application web permettant d'organiser un load order de mods Skyrim (PS5) sous forme de cartouches réordonnables par glisser-déposer, catégorisées avec des couleurs personnalisées, avec description détaillée par mod. Import/export en `.txt`, `.csv`, `.xls`. Utilisable aussi bien sur desktop que sur mobile.

**Contrainte fondamentale : 100% côté client.** Pas de backend, pas de base de données, pas de compte utilisateur. Toutes les données sont stockées dans le `localStorage` du navigateur. L'import/export de fichiers est le seul mécanisme de portabilité entre appareils/sessions.

## Stack technique

- React 18 + TypeScript + Vite
- Zustand (+ middleware `persist`) pour le state management et la persistance localStorage
- @dnd-kit/core + @dnd-kit/sortable pour le drag-and-drop (accessible, tactile)
- Tailwind CSS pour le responsive
- papaparse (CSV) et xlsx / SheetJS (XLS) pour l'import/export
- Vitest + React Testing Library pour les tests
- ESLint + Prettier pour le linting/formatage
- Déploiement : Vercel

## Commandes

```bash
npm install          # installer les dépendances
npm run dev           # lancer le serveur de dev (Vite)
npm run build          # build de production
npm run preview        # prévisualiser le build
npm run lint            # ESLint
npm run format           # Prettier (écrit les corrections)
npm run test              # Vitest (mode watch)
npm run test:run           # Vitest (une passe, pour CI)
```

Avant de considérer une phase terminée : `npm run lint`, `npm run test:run` et `npm run build` doivent tous passer sans erreur.

## Structure du projet

```
src/
├── components/       # composants React, un sous-dossier par fonctionnalité
│   ├── ModCard/        # cartouche de mod (repliée + dépliée)
│   ├── ModList/         # conteneur drag-and-drop
│   ├── CategoryManager/  # gestion des catégories et couleurs
│   ├── ImportExport/      # import/export txt/csv/xls
│   └── ui/                 # composants génériques réutilisables
├── store/            # Zustand store + types de données
├── lib/
│   ├── importers/      # parsing txt/csv/xlsx → Mod[]
│   ├── exporters/       # Mod[] → fichier txt/csv/xlsx
│   ├── storage.ts         # wrapper localStorage + versioning de schéma
│   └── colors.ts           # palette de couleurs par défaut
└── test/             # setup de test global
```

## Modèle de données (référence)

```typescript
interface Category {
  id: string;
  name: string;
  color: string;   // hex
  order: number;
}

interface Mod {
  id: string;       // uuid
  name: string;
  description: string;
  categoryId: string | null;
  position: number;  // ordre dans le load order
  createdAt: string;
  updatedAt: string;
}

interface LoadOrderState {
  mods: Mod[];
  categories: Category[];
  meta: { schemaVersion: number; lastModified: string };
}
```

Toute modification du modèle de données doit s'accompagner d'une incrémentation de `schemaVersion` et d'une logique de migration dans `lib/storage.ts` pour ne pas casser les données déjà sauvegardées côté utilisateur.

## Conventions de code

- TypeScript strict (`strict: true` dans tsconfig) — pas de `any` sauf cas justifié en commentaire
- Composants fonctionnels avec hooks, un composant = un fichier
- Un fichier de test à côté de chaque composant/module non trivial (`Nom.test.tsx` / `nom.test.ts`)
- Toute la logique d'import/export/parsing vit dans `src/lib/`, jamais directement dans un composant
- Le store Zustand est la seule source de vérité pour les données du load order — pas d'état dupliqué en `useState` pour les données métier (l'état purement UI, comme "cartouche dépliée", peut rester local)
- Tailwind pour tout le style ; éviter le CSS custom sauf nécessité réelle
- Accessibilité : le drag-and-drop doit rester utilisable au clavier (dnd-kit le permet nativement, ne pas le désactiver)

## Règles à respecter

- **Ne jamais introduire de backend, d'API externe ou de dépendance à un service tiers** pour la sauvegarde des données — tout reste dans le navigateur (localStorage).
- **Ne jamais casser la persistance existante** sans plan de migration de schéma.
- **Tester le rendu mobile** (viewport étroit) pour chaque composant visuel avant de considérer une phase terminée.
- Avancer phase par phase selon le plan de développement du projet (voir le document "plan-technique" du projet) : ne pas anticiper une fonctionnalité d'une phase ultérieure avant que la phase en cours soit stable et testée.

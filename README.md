# TechStore - Backoffice Dashboard

Application Web complète de type Backoffice Dashboard pour la gestion d'un magasin de produits technologiques.

## 📋 Description

TechStore est une Single Page Application (SPA) développée en HTML5, CSS3 et JavaScript Vanilla permettant la gestion complète d'un inventaire de produits technologiques.

## 🎯 Fonctionnalités

### Module 1 : Gestion des Produits (CRUD complet)
- ✅ Ajout de produits avec formulaire validé
- ✅ Affichage en liste (cartes)
- ✅ Recherche par mot-clé
- ✅ Tri (nom, prix, stock)
- ✅ Affichage de fiche détaillée
- ✅ Modification de produits
- ✅ Suppression avec confirmation
- ✅ Sauvegarde dans LocalStorage

### Module 2 : Gestion des Catégories (CRUD simplifié)
- ✅ Ajout de catégories
- ✅ Affichage de liste
- ✅ Suppression de catégories
- ✅ Vérification avant suppression (produits liés)

### Module 3 : Dashboard & API
- ✅ KPI (Total Produits, Stock Total, Valeur Stock, Total Catégories)
- ✅ Graphique Chart.js (Répartition par catégorie)
- ✅ Intégration API FakeStore
- ✅ Import de produits depuis l'API

## 🛠️ Technologies utilisées

- **HTML5** : Structure de l'application
- **CSS3** : Styles personnalisés
- **JavaScript Vanilla** : Logique métier
- **Bootstrap 5** : Framework CSS
- **Font Awesome** : Icônes
- **Chart.js** : Graphiques
- **LocalStorage** : Persistance des données

## 📁 Structure du projet

```
techstore/
├── index.html              # Page principale (SPA)
├── css/
│   └── styles.css          # Styles personnalisés
├── js/
│   ├── app.js              # Application principale (navigation SPA)
│   ├── modules/
│   │   ├── produits.js     # Module 1 : Gestion des produits
│   │   ├── categories.js   # Module 2 : Gestion des catégories
│   │   └── dashboard.js    # Module 3 : Dashboard & API
│   └── utils/
│       └── storage.js      # Gestion LocalStorage
└── README.md               # Documentation
```

## 🚀 Installation et utilisation

1. Cloner ou télécharger le projet
2. Ouvrir `index.html` dans un navigateur web moderne
3. Aucune installation supplémentaire n'est requise (CDN pour les bibliothèques)

## 📊 Semaine 1 - Réalisations

### Structure SPA
- ✅ Sidebar de navigation verticale
- ✅ Navbar supérieure
- ✅ Sections modulaires (Dashboard, Produits, Catégories, Statistiques)
- ✅ Navigation fluide entre les sections

### Module 1 - Produits (Début)
- ✅ Formulaire d'ajout avec validation
- ✅ Affichage en cartes
- ✅ Sauvegarde dans LocalStorage
- ✅ Interface moderne et responsive

### Données par défaut
- ✅ Catégories pré-chargées (Ordinateurs, Smartphones, Tablettes, Accessoires)

## 🎨 Interface

L'interface suit les standards des backoffices professionnels avec :
- Design moderne et épuré
- Cartes KPI avec icônes
- Graphiques interactifs
- Formulaires validés
- Responsive design

## 📝 Notes

- Les données sont stockées dans le LocalStorage du navigateur
- L'application fonctionne entièrement côté client
- L'API FakeStore est utilisée pour l'import de produits

## 👥 Auteur

Projet réalisé dans le cadre du module Développement Web - Filière 3IIR

## 📄 Licence

Projet éducatif


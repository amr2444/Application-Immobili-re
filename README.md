# ImmoApp - Application Immobilière Moderne

Application immobilière complète construite avec Hono, React et Cloudflare D1.

## 🏠 Présentation

ImmoApp est une plateforme immobilière moderne permettant de :
- Rechercher des biens immobiliers (vente et location)
- Consulter les détails complets des propriétés
- Filtrer par type, prix, ville et surface
- Envoyer des demandes de renseignements
- Interface responsive et élégante

## 🌐 URLs

- **Application locale**: https://3000-ia12pol5zgxou0sx0vsnn-c07dda5e.sandbox.novita.ai
- **API**: https://3000-ia12pol5zgxou0sx0vsnn-c07dda5e.sandbox.novita.ai/api/properties
- **Projet**: `/home/user/webapp`

## ✨ Fonctionnalités Complétées

### Backend (API Hono)
- ✅ API RESTful complète pour la gestion des propriétés
- ✅ CRUD complet (Create, Read, Update, Delete)
- ✅ Système de filtres avancés (type, prix, ville, surface)
- ✅ Gestion des demandes de renseignements
- ✅ Base de données D1 (SQLite) avec migrations
- ✅ 8 propriétés de test dans différentes villes

### Frontend (React)
- ✅ Interface moderne avec TailwindCSS
- ✅ Grille de cartes de propriétés responsive
- ✅ Filtres de recherche en temps réel
- ✅ Modal de détails avec toutes les informations
- ✅ Formulaire de contact fonctionnel
- ✅ Design élégant avec dégradés et animations
- ✅ Icons Font Awesome pour une meilleure UX

### Base de Données
- ✅ Table `properties` avec 20+ champs
- ✅ Table `inquiries` pour les demandes
- ✅ Relations et index optimisés
- ✅ Données de test réalistes

## 📊 Architecture des Données

### Table Properties
```sql
- id: Identifiant unique
- title: Titre de l'annonce
- description: Description détaillée
- type: appartement | maison | villa | studio | bureau
- transaction_type: vente | location
- price: Prix (en euros)
- area: Surface en m²
- rooms, bedrooms, bathrooms: Nombre de pièces
- address, city, postal_code: Localisation
- features: Équipements (JSON)
- image_url: Photo principale
- year_built: Année de construction
- available: Disponibilité
```

### Table Inquiries
```sql
- id: Identifiant unique
- property_id: Référence à la propriété
- name, email, phone: Contact
- message: Message du demandeur
- status: nouveau | en_cours | traité
```

## 🔌 API Endpoints

### Propriétés
- `GET /api/properties` - Liste toutes les propriétés (avec filtres optionnels)
  - Paramètres: `type`, `transaction`, `city`, `minPrice`, `maxPrice`, `minArea`
- `GET /api/properties/:id` - Détails d'une propriété
- `POST /api/properties` - Créer une propriété
- `PUT /api/properties/:id` - Mettre à jour une propriété
- `DELETE /api/properties/:id` - Supprimer une propriété

### Demandes de renseignements
- `GET /api/inquiries` - Liste toutes les demandes
  - Paramètre optionnel: `status`
- `POST /api/inquiries` - Créer une demande

## 🚀 Guide d'Utilisation

### Rechercher un Bien
1. Utilisez les filtres en haut de la page
2. Sélectionnez le type (appartement, maison, villa, etc.)
3. Choisissez vente ou location
4. Entrez une ville (Lyon, Paris, Bordeaux, etc.)
5. Définissez une fourchette de prix
6. Cliquez sur "Chercher"

### Consulter un Bien
1. Cliquez sur le bouton "Détails" d'une propriété
2. Consultez toutes les informations
3. Visualisez les équipements et caractéristiques
4. Cliquez sur "Demander des informations" pour contacter

### Envoyer une Demande
1. Remplissez le formulaire de contact
2. Nom, email (obligatoires) et téléphone (optionnel)
3. Rédigez votre message
4. Cliquez sur "Envoyer"

## 🎨 Types de Biens Disponibles

- **Appartements**: Moderne, neuf, loft
- **Maisons**: Maison de ville, individuelle
- **Villas**: Avec piscine, vue mer
- **Studios**: Pour étudiants, investissement
- **Bureaux**: Espaces professionnels

## 🛠️ Technologies

- **Backend**: Hono (framework web rapide)
- **Frontend**: React 18 + TailwindCSS
- **Base de données**: Cloudflare D1 (SQLite)
- **Déploiement**: Cloudflare Pages/Workers
- **Build**: Vite
- **Process Manager**: PM2

## 📦 Scripts Disponibles

```bash
# Développement
npm run dev              # Serveur Vite de développement
npm run dev:sandbox      # Wrangler avec D1 local

# Build et déploiement
npm run build            # Build pour production
npm run deploy           # Déployer sur Cloudflare Pages

# Base de données
npm run db:migrate:local # Appliquer les migrations localement
npm run db:seed          # Charger les données de test
npm run db:reset         # Réinitialiser la base de données

# Utilitaires
npm run clean-port       # Libérer le port 3000
npm run test             # Tester l'application
```

## 🔧 Développement

### Démarrer l'application localement
```bash
# 1. Build du projet
npm run build

# 2. Démarrer avec PM2
pm2 start ecosystem.config.cjs

# 3. Vérifier les logs
pm2 logs webapp --nostream

# 4. Arrêter l'application
pm2 stop webapp
```

### Réinitialiser la base de données
```bash
npm run db:reset
```

### Ajouter de nouvelles propriétés
Éditez le fichier `seed.sql` et relancez :
```bash
npm run db:seed
```

## 📈 Prochaines Étapes Recommandées

### Améliorations Fonctionnelles
1. **Authentification utilisateur**
   - Inscription/connexion
   - Profils utilisateurs
   - Favoris et alertes

2. **Gestion des images**
   - Upload multiple d'images
   - Galerie photo pour chaque bien
   - Intégration R2 Storage

3. **Carte interactive**
   - Affichage sur carte avec géolocalisation
   - Recherche par zone géographique

4. **Panel d'administration**
   - Interface pour gérer les propriétés
   - Gestion des demandes de renseignements
   - Statistiques et analytics

5. **Fonctionnalités avancées**
   - Comparateur de biens
   - Calcul de prêt immobilier
   - Visite virtuelle 360°
   - Système de notation/avis

### Améliorations Techniques
1. **Performance**
   - Pagination des résultats
   - Cache des données
   - Lazy loading des images

2. **SEO**
   - Meta tags dynamiques
   - Sitemap XML
   - URLs optimisées

3. **Tests**
   - Tests unitaires (Vitest)
   - Tests d'intégration API
   - Tests E2E (Playwright)

4. **Monitoring**
   - Analytics utilisateurs
   - Tracking des erreurs
   - Performance monitoring

## 📝 État du Déploiement

- **Statut**: ✅ Actif
- **Environnement**: Développement (sandbox)
- **Base de données**: D1 local
- **Dernière mise à jour**: 2026-01-04

## 🤝 Contribution

Pour ajouter de nouvelles fonctionnalités :
1. Créer une nouvelle branche
2. Développer la fonctionnalité
3. Tester localement
4. Commiter avec un message descriptif
5. Déployer

## 📄 License

Projet personnel - Tous droits réservés

---

**ImmoApp** - Votre partenaire immobilier de confiance 🏡

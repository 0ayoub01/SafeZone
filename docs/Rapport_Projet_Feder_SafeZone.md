# REPUBLIQUE TUNISIENNE
## MINISTERE DE L’ENSEIGNEMENT SUPERIEUR ET DE LA RECHERCHE SCIENTIFIQUE
### UNIVERSITE TUNIS EL MANAR
### FACULTE DES SCIENCES DE TUNIS 
### DEPARTEMENT DES SCIENCES DE L'INFORMATIQUE

# RAPPORT DE PROJET FÉDÉRÉ GLSI2 LCS2

**TITRE : Conception et Réalisation d'une Application Web de Signalisations Géolocalisées : SafeZone**

**Réalisé par :** 
[Votre Nom et Prénom]
[Nom de votre binôme éventuel]

**Encadré par :** 
Faouzi MOUSSA

**Organisme d’accueil :** 
FST – DSI 

**Année Universitaire :** 2025/2026

---

## Fiche de synthèse

Dans le cadre de la gestion informatisée des stages et de l’archivage des rapports, nous vous demandons de renseigner les items suivants :

- **Formation :** LCS2_GLSI2
- **Année Universitaire :** 2025/2026
- **Session :** Principale
- **Auteur(s) :**
  - Nom & Prénom : [Votre Nom]
- **Email et téléphone du Responsable du groupe :** [Votre Contact]
- **Titre du rapport :** Conception et Réalisation d'une Application Web de Signalisations Géolocalisées : SafeZone
- **Organisme d’accueil :** FST – DSI
- **Pays d’accueil :** Tunisie
- **Responsable de stage :** MOUSSA Faouzi
- **Mots-clés :** MERN, Architecture en Couches, REST API, Diagramme de Composants

---

## Charte de non plagiat 
**Protection de la propriété intellectuelle**

Tout travail universitaire doit être réalisé dans le respect intégral de la propriété intellectuelle d’autrui. Pour tout travail personnel, ou collectif, pour lequel le candidat est autorisé à utiliser des documents, celui-ci devra très précisément signaler le crédit à la fois dans le corps du texte et dans la bibliographie.

Je soussigné(e), [Votre Nom], étudiant(e) en [Votre Classe] m’engage à respecter cette charte.

Fait à Tunis, le [Date]

Signature :

---

## Remerciements
Nous tenons à exprimer notre profonde gratitude à notre encadrant, Monsieur Faouzi MOUSSA, pour son accompagnement précieux, ses conseils avisés en matière d'architecture logicielle, et son soutien tout au long de la réalisation de ce projet. Nos remerciements s'adressent également au corps professoral et à nos familles.

---

## Synthèse du rapport en français
Ce rapport détaille la conception et le développement de "SafeZone", une plateforme web full-stack développée avec la pile MERN. L'application repose sur le modèle de conception **Layered Architectural Pattern** (Architecture en couches) combiné à une **REST API Based Topology**. L'objectif du projet est de permettre aux utilisateurs de signaler et de consulter des incidents géolocalisés. Une attention particulière a été portée à la conception architecturale, illustrée notamment par des diagrammes de composants UML, afin de garantir un couplage faible, une haute évolutivité (scalability) et une bonne séparation des responsabilités.

---

## Table des matières
1. Introduction Générale
2. Présentation de l’organisme d’accueil et de l’Encadrant
3. Chapitre 1 : PRESENTATION DU PROJET
4. Chapitre 2 : SPECIFICATION DES BESOINS
5. Chapitre 3 : CONCEPTION
6. Chapitre 4 : REALISATION
7. Conclusion Générale et Perspectives
8. Bibliographie
9. Annexes

---

## Introduction Générale 
La conception d'un système complexe nécessite un choix méticuleux d'**Architecture Logicielle**. Ce projet s'articule autour de la création de SafeZone, un système de cartographie et de signalement d'urgences en temps réel. Afin de garantir sa flexibilité et sa maintenabilité, nous nous sommes appuyés sur les enseignements du cours d'Architecture Logicielle pour adopter un système en couches (Layered Pattern) distribué. Le rapport débute par le contexte et les besoins, se poursuit par une analyse structurelle UML approfondie, puis s'achève par la phase d'implémentation technologique.

---

## Présentation de l’organisme d’accueil et de l’Encadrant
Ce projet a été réalisé au sein du département d'informatique de la Faculté des Sciences de Tunis (FST) sous la supervision de M. Faouzi MOUSSA. 

---

## Chapitre 1 : PRESENTATION DU PROJET

### 1.1 Cadre du projet 
Le projet "SafeZone" a été initié dans le cadre du Projet Fédéré (GLSI2 LCS2) avec pour but d'implémenter les modèles architecturaux de conception de manière systématique et prévisible. 

### 1.2 Problématique 
La transmission d'informations liées aux urgences géolocalisées nécessite une réactivité accrue et une tolérance aux pannes. Le défi consiste à structurer le logiciel de telle sorte que les modules (utilisateurs, signalements, carte) soient indépendants mais communiquent efficacement. Comment concevoir ces ressources en respectant la séparation des intérêts (« Separation of Concerns ») ?

### 1.3 Choix méthodologiques 
Nous avons adopté une démarche itérative Agile et une modélisation basée sur **UML 2.0**. D'un point de vue structurel, nous avons écarté l'approche monolithique obsolète (le « Big Ball of Mud ») pour embrasser la clarté d'une architecture N-Tiers, et d'un couplage lâche via le mécanisme de requêtage REST.

---

## Chapitre 2 : SPECIFICATION DES BESOINS

### 2.1 Description des besoins
- Permettre à un utilisateur de s'authentifier et d'ajouter des rapports (incidents).
- Mettre à disposition une interface (Frontend Service) communiquant avec la logique (Business Layer) à travers un système de requêtes.
- Fournir des tableaux de bord administratifs pour la modération.

### 2.2 Identification des acteurs 
- **Utilisateur (Client) :** End-user générant des "Requests" vers le système.
- **Modérateur :** Agit sur le composant métier pour statuer sur la validité des signalements.
- **Administrateur :** Assure la gestion globale des utilisateurs et accède à l'administration.

---

## Chapitre 3 : CONCEPTION

Lors de la transmission entre couches, les composants ne communiquent qu'au travers des interfaces abstraites bien définies, évitant ainsi le couplage direct par des appels de fonctions internes.

### 3.1 Diagramme de cas d’utilisation
*(Insérer ici le schéma des cas d'utilisation illustrant S'inscrire, Se connecter, Signaler, Modérer, etc.)*

### 3.2 Diagrammes UML : Vue Structurelle et Composants

Conformément à la modélisation UML abordée en cours, nous avons produit un **Diagramme de composants** représenté en modèle « boîte blanche » (White Box) afin d'exposer l'encapsulation de nos modules. 

**Diagramme de composants :**
Ce diagramme détaille l'organisation de l'application :
- **Presentation Layer (Frontend) :** Interface utilisateur gérant l'interaction (React).
- **Business Application Layer :** Processus et logique de gestion des rapports : Modération, Logs, Authentification.
- **Data Access & Persistence Layer :** Ce composant s'occupe exclusivement de la communication avec la base de données.

Les relations entre ces composants s'effectuent via des interfaces fournies et des ports, symbolisés graphiquement (interfaces de type lollipop/sucettes). L'interdépendance est réduite au minimum.

*(Insérer ici votre diagramme de composants de type "Layered" avec la représentation boîte blanche)*

### 3.3 Diagramme de classes
Le modèle objet met en avant les Design Patterns employés. 
- **User**, **Report**, **Notification**.

---

## Chapitre 4 : REALISATION

### 4.1 Environnement logiciel 
La réalisation s'appuie sur la pile **MERN** (MongoDB, Express, React, Node.js). Bien que cette technologie soit moderne, le code a été scrupuleusement structuré pour respecter l'architecture en couches, empêchant ainsi le code de n'être organisé que par dossiers sans véritable découplage.

### 4.2 Architecture de l’application (Topologie REST API)

L'architecture adoptée est explicitement une **Layered / N-Tier Architecture**. 

- **1. Frontend Data Consumer (Client Lourd) :** L'interface React joue le rôle de composant initiateur ("Frontend Services"). Il s'agit d'une topologie dite **Application REST-Based Topology**, car le client gère une grande partie de l'interface et effectue des requêtes REST (Top-Down approach).
- **2. Interface et Routage des API :** Un système de points de terminaison (Endpoints API) d'Express Node.js agit de manière similaire à une mini API Gateway pour diriger la logique.
- **3. Business Services & Persistance :** Logique encapsulée en couches (Controllers, Services, Models) communiquant vers une base isolée (MongoDB). Les couches sont "fermées" par défaut, forçant chaque requête venant du Frontend à traverser la couche Métier avant d'atteindre la Persistance, assurant ainsi sécurité et suivi des contrats de service.

### 4.3 Avantages obtenus grâce à ce Design
- **Evolutivité (Scalability) :** Le frontend et les micro-services métiers peuvent être déployés séparément.
- **Séparation des intérêts :** Maintien facilité lors de modifications d'UI sans impacter la base de données, et l'emploi de JSON via l'API aide à la standardisation (Communication Model/Contrats). 

### 4.4 Description de l’application 
L'application propose des écrans "dashboard" dynamiques (glassmorphism, asynchronisme avec `motion.div`), facilitant le "Monitoring" et offrant une forte fluidité et réactivité (Responsiveness) côté client.

*(Insérer ici des captures d'écran de l'interface SafeZone)*

---

## Conclusion Générale et Perspectives
SafeZone nous a permis de comprendre que "tout grand projet logiciel nécessite une architecture logicielle". Parfois perçue comme un concept "De tour d'ivoire", l'architecture a en fait été le ciment de la stabilité de notre projet, qui n'est pas devenu une "grosse boule de boue". 
En perspectives, ce modèle pourrait totalement évoluer vers des Solutions basées sur le **Cloud (ex: IaaS, PaaS)**, ou être refactorisé formellement en pure structure de **Microservices** (Service Oriented), avec un Enterprise Service Bus (ESB) complet ou un système "Event-driven" (Broker de données) en cas d’afflux majeur de rapports à l'échelle nationale.

---

## Bibliographie

**Ouvrages et support de cours**
- MOUSSA, Faouzi. *Software Architecture : Architecture logicielle*. Support de cours - Faculté des Sciences de Tunis, DSI.
- BASS, Len, CLEMENTS, Paul, KAZMAN, Rick. *Software Architecture in Practice* (3rd Edition). Addison Wesley.

**Ouvrages électroniques consultés**
- Documentation MERN Stack [en ligne]. 
- Arcitura Education - *SOA Patterns* [en ligne].

---

## Résumé
Le projet SafeZone illustre l'intégration méthodique de la Layered / N-Tier Architectural Pattern à une application géolocalisée (MERN). En séparant l'interface, la logique et les accès aux données selon le modèle de "REST API Based Topology", le système répond aux exigences de fiabilité, de maintenabilité et de protection dictées par les best-practices de conception logicielle.

**Mots-clés :** Architecture logicielle, Layered Pattern, REST API, Diagramme de composants UML, MERN

## Abstract
The SafeZone project illustrates the methodical integration of the Layered / N-Tier Architectural Pattern within a geolocated application (MERN). By decoupling the interface, business logic, and data access through a "REST API Based Topology", the system effectively meets the reliability, testability, and security requirements dictated by modern software engineering standards.

**Keywords:** Software Architecture, Layered Pattern, REST API, UML Component Diagram, MERN

## ملخص
يوضح مشروع (SafeZone) التطبيق المنهجي لنمط بنية الطبقات (Layered Pattern) في نظام خرائط يعتمد على تقنيات (MERN). من خلال فصل واجهة المستخدم، ومنطق العمل، والوصول إلى البيانات باستخدام طوبولوجيا واجهة برمجة تطبيقات (REST API)، يستجيب النظام لمتطلبات الموثوقية وسهولة الصيانة التي تفرضها معايير هندسة البرمجيات الحديثة المعتمدة في تصميمنا المعماري.

**الكلمات المفاتيح :** بنية البرمجيات، نمط الطبقات، REST API، رسم مكونات UML، MERN

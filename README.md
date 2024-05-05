# Pilot Helper

PilotHelper permet aux aviateurs d’être accompagnés dans la préparation 
de leurs vols. Cela se traduit par une sélection d’outils de planification 
permettant par exemple la conception d’un plan de vol ou le suivi de la 
météo en temps réel sur le trajet prévu.

## Système

Voici un résumé de l'architecture du projet :

![](./documentation/system-overview.png)

## Setup

- Lancer le script [env-setup.sh](./env-setup.sh) pour copier les fichiers env depuis [les exemples](./documentation/env) puis les paramétrer (les valeurs par défaut suffisent pour un essai).
- Installer docker et docker compose (si ce n'est pas déjà fait)
- Ajouter dans le fichier `hosts` (`C:\Windows\System32\drivers\etc\hosts` sur Windows) la ligne ```127.0.0.1 keycloak```.
- Dans ce répertoire lancer docker compose: `docker compose up -d`

Les comptes par défaut sont :
- Keycloak admin:
  - username: `admin`
  - password: `admin`
- Grafana:
  - username: `admin`
  - password: `password`
- Keycloak (page de login):
  - pas de compte par défaut, il faut en créer un (register ou via interface admin)

Toutes les valeurs par défaut sont visibles dans les fichiers `.env` après execution du script et `documentation/env/*.env.example` avant.

## Patrons de conceptions utilisés
 - Reverse Proxy : une adresse exposée, plusieurs services
 - Cache : style CouchDB
 - Media Type Negociation : json/xml/...
 - Service Descriptor : un fichier OpenAPI par service
 - Service Interceptor : Intercepte requête pour traitement, ex: Authentification
 - Idempotent retry : retry côté client (PWA + client(s) REST)
 - Consumer-Driven Contract : Test d'intégration par contrat (via OpenAPI spec, par exemple)

[![](./documentation/process.svg)](./documentation/process.puml)

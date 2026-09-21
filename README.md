# CSE — Bons Comportements

Support web de sensibilisation aux comportements du quotidien en entreprise, destiné aux postes de travail et aux séances de formation.

Chaque situation se découvre en trois étapes : **Comment commencent les ennuis**, **Ce que ça coûte**, puis **Le bon réflexe**. Les idées apparaissent progressivement, au rythme de la personne qui consulte ou présente la fiche.

Le site est autonome : HTML, CSS, JavaScript, illustrations et polices sont fournis dans le dossier. Il ne nécessite ni installation de dépendances, ni compilation, ni serveur applicatif, ni connexion à Internet.

## Démarrer

1. Copier ou extraire le dossier du site dans son intégralité.
2. Ouvrir `index.html` dans le navigateur du poste.
3. Choisir une carte sur l'accueil.

Utiliser un navigateur récent avec JavaScript activé. Valider le fonctionnement sur le navigateur réellement installé dans l'entreprise, notamment les animations et la lisibilité des textes.

### Sur un dossier réseau ou un poste de formation

Le dossier peut être placé sur un partage réseau accessible aux utilisateurs, ou copié sur le disque d'un poste dédié. Conserver les chemins relatifs et l'organisation des fichiers ; copier seulement `index.html` ne suffit pas.

Un raccourci vers `index.html` permet d'ouvrir le support. Le fonctionnement depuis un partage reste à vérifier avec les droits et les règles de sécurité du poste de travail.

**Sans Internet ne signifie pas sans réseau local :** si les fichiers restent sur un partage, celui-ci doit être accessible. Une copie complète sur le poste fonctionne indépendamment de ce partage.

Pour livrer le site, conserver :

- `index.html` et `favicon.ico` ;
- les dossiers `assets/` et `data/`, avec leur contenu ;
- ce `README.md` pour les personnes chargées de maintenir le support.

Le dossier `.git/` et les sources de travail `_originaux/` ne sont pas nécessaires à l'utilisation. La licence de la police dans `assets/fonts/LICENSE.txt` doit accompagner les fichiers de police.

## Utilisation

| Action | Commande |
| --- | --- |
| Ouvrir une situation | Cliquer sur sa carte ; au clavier, atteindre la carte avec Tab puis l'activer avec Entrée ou Espace. |
| Révéler l'idée suivante | Cliquer dans la page, en dehors des commandes. |
| Avancer au clavier | Espace, Entrée ou flèche droite, lorsque le focus n'est pas sur un bouton ou une carte. |
| Passer à l'étape suivante | Avancer une fois de plus après l'apparition de toutes les idées. |
| Terminer une fiche | Après toutes les idées de la troisième étape, avancer pour revenir à l'accueil. |
| Quitter une fiche | Bouton **Accueil**, ou la touche Échap. |
| Reprendre la fiche depuis le début | Bouton **Recommencer** : retour à la première étape et idées à nouveau masquées. |
| Changer d'ambiance | Bouton **Thème** : bascule entre clair et sombre. |

L'invite « Cliquez pour continuer » apparaît sur la première fiche ouverte, puis disparaît au premier clic d'avancement. Elle ne revient pas au cours de la même ouverture de la page.

Le thème initial suit le réglage du système. Le choix du thème et l'avancement ne sont pas enregistrés : recharger la page ramène à l'accueil et relit le thème système.

La navigation actuelle utilise les cartes et les commandes du haut de page. Il n'y a pas de retour à l'étape précédente, de menu latéral, de score ou de suivi individuel.

## Situations disponibles

| Famille | Situation | Identifiant |
| --- | --- | --- |
| Manutention | J'ai percuté un rack | `rack-percute` |
| Matériel | J'ai perdu un Mobulis | `mobulis-perdu` |
| Locaux | J'ai ouvert... et j'ai oublié | `oublis-fermeture` |
| Accès | J'ai ouvert le portail | `portail-accueil` |

La version relue le 22 septembre 2026 contient **4 fiches, 12 étapes et 36 idées**.

## Organisation des fichiers

```text
CSE-Comportements/
├── index.html                   Structure, accueil et modèles HTML
├── favicon.ico                  Icône du navigateur
├── README.md
├── data/
│   └── data.js                  Contenus des fiches et gabarit à dupliquer
├── assets/
│   ├── css/
│   │   ├── reset.css            Styles de base
│   │   ├── tokens.css           Couleurs, police et réglages visuels
│   │   └── style.css            Mise en page, effets et adaptations d'écran
│   ├── js/
│   │   └── app.js               Création des cartes, navigation et animations
│   ├── fonts/                  Police Mulish locale et sa licence
│   └── img/
│       ├── logo-u.webp
│       ├── apple-touch-icon.png
│       └── comportements/      Illustrations et vignettes
└── _originaux/                  Sources de travail, hors livraison et ignorées par Git
```

## Ajouter ou modifier une fiche

Tout le contenu est centralisé dans `data/data.js`, dans le tableau `COMPORTEMENTS`. Les cartes sont créées automatiquement dans l'ordre de ce tableau.

1. Faire une copie de sauvegarde de `data/data.js`.
2. Copier le gabarit commenté situé en bas du fichier.
3. Insérer l'objet **dans le tableau `COMPORTEMENTS`**, avant son `];` final, en dehors du commentaire du gabarit. Ajouter une virgule après l'objet précédent pour séparer les fiches.
4. Renseigner les champs ci-dessous et placer les images dans `assets/img/comportements/`.
5. Enregistrer en UTF-8, recharger la page et parcourir la nouvelle fiche jusqu'au retour à l'accueil.

### Champs de la fiche

| Champ | Contenu |
| --- | --- |
| `id` | Identifiant distinct, sans espace ni accent, par exemple `nouvelle-situation`. |
| `famille` | Catégorie affichée sur la carte et dans le fil d'Ariane. |
| `titre` | Nom de la situation dans le fil d'Ariane. |
| `accroche` | Phrase affichée sur la carte. Si elle est vide, le titre est utilisé. |
| `vignette` | Chemin de l'image de la carte. Si vide, l'image de la première étape est utilisée. |
| `faces` | Les trois étapes, dans l'ordre `geste`, `consequences`, `bon`. Conserver cet ordre : le code et la progression s'appuient dessus. |

### Champs de chaque étape

| Champ | Contenu |
| --- | --- |
| `cle` | `geste`, `consequences` ou `bon`, selon sa position. |
| `etiquette` | Conserver les libellés communs aux fiches pour faciliter le repérage. |
| `phrase` | Titre de l'étape. Une seule paire d'accolades facultative désigne le passage surligné et animé : `Un exemple {important}.` |
| `image` | Chemin relatif à `index.html`, par exemple `assets/img/comportements/exemple.webp`. |
| `cadrage` | Position verticale de l'image, par exemple `"31%"`. Par défaut : `"50%"`. Ajuster pour garder visible le sujet dans la bande panoramique. |
| `alt` | Description du visuel pour les personnes qui ne le voient pas. |
| `idees` | Trois objets contenant chacun `rang` (intertitre) et `texte` (explication). |

Les contenus sont des chaînes de texte, pas du HTML. Respecter les guillemets, virgules, crochets et accolades JavaScript. Dans une chaîne délimitée par des guillemets doubles, écrire un guillemet double interne sous la forme `\"`.

Une image volontairement laissée vide affiche un emplacement « Visuel a venir ». **Un chemin erroné ou un fichier manquant ne déclenche pas ce remplacement** : vérifier les noms de fichiers après chaque ajout. Une fiche ajoutée au tableau apparaît immédiatement sur l'accueil, même si son contenu est encore incomplet ; il n'existe pas de statut brouillon.

Les illustrations actuelles sont au format WebP. Vérifier leur lisibilité après recadrage, en particulier lorsqu'elles contiennent des bulles ou du texte.

## Réglages visuels et animations

Les réglages principaux se trouvent dans `assets/css/tokens.css` :

- `--zoom-depart` et `--zoom-duree` : amplitude et durée du dézoom ;
- `--morph-duree` : durée principale des transitions ; certaines animations de texte ont leurs propres durées dans `style.css` ;
- `--parallaxe` : déplacement à la souris (`0px` pour le neutraliser au prochain chargement) ;
- `--cadre-fondu` : largeur du fondu des bords ;
- `--grain-force` et `--lueur-force` : intensité du grain et de la lueur ;
- `--bande-basse`, `--cadre-mini` et `--entete-hauteur` : répartition de l'espace.

Les règles de hauteur d'écran, en section 8 de `style.css`, remplacent certains réglages sur les écrans courts. La section 9, consacrée aux petits écrans en largeur, doit rester la dernière du fichier : une media query n'ajoute aucune spécificité, c'est donc l'ordre d'écriture qui décide.

Pendant un morph, la classe `body.morph` met le dézoom en pause. Le JavaScript attend la fin de la transition avant de reprendre le dézoom et de décoder le titre ; la hauteur de celui-ci est temporairement maintenue pour ne pas déplacer l'image.

Si l'API View Transitions n'est pas disponible, la navigation se fait sans morph. Le réglage système de réduction des animations est également pris en compte ; recharger la page après sa modification pour que le JavaScript relise ce réglage.

Les scripts sont chargés par des balises classiques, dans l'ordre **`data/data.js` puis `assets/js/app.js`**. Conserver cette organisation pour l'ouverture directe depuis les fichiers. Aucun chargement de contenu par `fetch`, service distant ou stockage persistant n'est utilisé actuellement.

## Vérifications avant diffusion

- Ouvrir le site depuis son véritable emplacement, avec les droits d'un utilisateur du poste cible.
- Parcourir chaque carte, les trois idées de chaque étape, puis le retour final à l'accueil.
- Essayer **Accueil**, **Recommencer**, **Thème** et les commandes au clavier.
- Vérifier les images et les polices sans connexion à Internet.
- Contrôler l'affichage à la résolution du poste, avec le zoom du navigateur utilisé au quotidien, dans les deux thèmes.
- Vérifier que les intertitres, les paragraphes et les textes intégrés aux images restent lisibles.
- Recharger avec **Ctrl + F5** après une mise à jour si une ancienne version semble encore affichée.

### État de la vérification du 22 septembre 2026

La syntaxe des deux fichiers JavaScript, la structure des quatre fiches et l'existence des 26 ressources locales référencées ont été vérifiées. Les quatre parcours, le redémarrage, le thème et le retour à l'accueil ont été exercés avec un DOM simulé, dans les modes avec morph, sans API de transition et avec animations réduites.

Ces vérifications ne portent pas sur le rendu graphique. L'affichage réel et l'accès depuis le partage réseau restent à contrôler sur le poste cible.

Limite connue : les intertitres (`rang`) tiennent sur une seule ligne. Au-delà d'environ 35 caractères, ils sont abrégés par des points de suspension — la lisibilité prime, mais mieux vaut les écrire courts.

## Auteur

**Fabien Queval** — projet personnel réalisé dans le cadre de la création d'un outil de sensibilisation pour un CSE.

La licence de la police Mulish est fournie dans `assets/fonts/LICENSE.txt`. Le dépôt ne contient pas de licence générale de redistribution du code ou des illustrations.

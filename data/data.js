/* <=========================== DATA.JS ===========================>
   Tout le contenu de l'application, et rien d'autre : aucune balise,
   aucune logique. Ajouter un comportement, c'est ajouter un objet
   dans ce tableau — rien d'autre à toucher.

   Chargé par une balise <script src> classique, AVANT app.js.
   Surtout pas type="module" : les modules ES sont bloqués en file://,
   donc en double-clic.

   <---- La forme d'un comportement ---->
   {
     id       : identifiant court, sans accent ni espace
     famille  : le rayon ou le domaine, affiché dans le fil d'ariane
     titre    : la phrase du fil d'ariane, à la premiere personne
     accroche : ce que dit la carte de l'accueil — une phrase parlée,
                celle que l'employé prononcerait lui-même
     vignette : l'image de la carte. Laissée vide, la carte reprend
                l'image de sa premiere face. Aucune des deux : cadre rayé.
     faces    : exactement trois, toujours dans cet ordre :
                 geste -> consequences -> bon
   }

   <---- La forme d'une face ---->
   {
     cle       : "geste", "consequences" ou "bon" — donne sa couleur
     etiquette : le petit mot au-dessus du titre. Les trois sont
                 IDENTIQUES d'une fiche a l'autre : c'est un reperage,
                 l'employe sait ou il en est sans relire.
     phrase    : la phrase-titre. Les accolades marquent le mot-clé,
                 celui qui se décode et qui est surligné :
                   "Les accidents en réserve {arrivent}."
                 Une paire d'accolades au maximum, et pas obligatoire.
     image     : chemin depuis index.html
     cadrage   : quelle bande horizontale de l'image reste visible.
                 Le cadre n'en montre qu'une tranche, dont la hauteur
                 depend de l'ecran. 30% remonte vers le haut de l'image,
                 70% descend. Optionnel : 50% par defaut.
     alt       : description de l'image pour qui ne la voit pas
     idees     : trois blocs { rang, texte } révélés un par un au clic
   }
   <===============================================================> */

const COMPORTEMENTS = [

  {
    id: "rack-percute",
    famille: "Manutention",
    titre: "J'ai percuté un rack",
    accroche: "J'ai tapé dans une lisse !",
    vignette: "",

    faces: [

      {
        cle: "geste",
        etiquette: "Comment commencent les ennuis",
        phrase: "Les accidents en réserve {arrivent}.",
        image: "assets/img/comportements/rack-percute.jpg",
        alt: "Un gerbeur a heurté le montant d'un rack de réserve, le montant est tordu",
        idees: [
          {
            rang: "Ça arrive",
            texte: "Parfois, l'appareil est un peu brusque, et sa puissance et son poids suffisent à endommager le montant des racks."
          },
          {
            rang: "Ça se joue à peu",
            texte: "Parfois on manœuvre sans marge, ou trop près des lisses."
          },
          {
            rang: "Ça ne fait pas de bruit",
            texte: "Parfois on touche juste un montant, même pas réellement fort."
          }
        ]
      },

      {
        cle: "consequences",
        etiquette: "Ce que ça coûte",
        phrase: "Un montant plié {ne porte plus} ce qu'il portait.",
        image: "assets/img/comportements/rack-consequences.jpg",
        alt: "Un rack fragilisé cède et déverse ses palettes",
        idees: [
          {
            rang: "Ce qui est abîmé",
            texte: "Un montant plié ne porte plus ce qu'il portait avant."
          },
          {
            rang: "Ce qui finit par céder",
            texte: "La structure tient, jusqu'au jour où elle ne tient plus — avec des palettes au-dessus de la tête de quelqu'un."
          },
          {
            rang: "Ce qu'on fait alors",
            texte: "Un rack touché doit être contrôlé, et tout défaut signalé à un responsable sans attendre. En cas de défaut, on le soulage : on retire les palettes qu'il supporte."
          }
        ]
      },

      {
        cle: "bon",
        etiquette: "Le bon réflexe",
        phrase: "Parlez-en à un {responsable} !",
        image: "assets/img/comportements/rack-bon.jpg",
        alt: "Un employé explique à son responsable qu'il a tapé un montant par mégarde",
        idees: [
          {
            rang: "Ralentir et prendre de la marge",
            texte: "Il est important de ralentir dans les allées étroites et de prendre de la marge. Pour cela, avoir des allées dégagées est important."
          },
          {
            rang: "Prévenir tout de suite",
            texte: "N'oubliez pas de prévenir un responsable rapidement, afin que des mesures soient prises."
          },
          {
            rang: "Ne pas laisser passer",
            texte: "Mieux vaut signaler immédiatement un choc que découvrir ses conséquences plus tard."
          }
        ]
      }

    ]
  },

  {
    id: "mobulis-perdu",
    famille: "Matériel",
    titre: "J'ai perdu un Mobulis",
    accroche: "Je le retrouverai plus tard...",
    vignette: "assets/img/comportements/apercu-mobulis.webp",

    faces: [
      {
        cle: "geste",
        etiquette: "Comment commencent les ennuis",
        phrase: "Baisser le son paraît {anodin}.",
        image: "assets/img/comportements/mobulis-son-baisse.webp",
        cadrage: "31%",
        alt: "Un employé baisse le volume d'un Mobulis",
        idees: [
          {
            rang: "Le son sert aussi à le retrouver",
            texte: "Quand un Mobulis est égaré, on peut le faire sonner pour le localiser."
          },
          {
            rang: "Silencieux, il devient difficile à trouver",
            texte: "Avec le volume trop bas, la sonnerie peut devenir impossible à entendre."
          },
          {
            rang: "Et un Mobulis, ça se perd vite",
            texte: "Posé sur une palette, dans un carton ou sur un rayon, il peut disparaître de vue en quelques secondes."
          }
        ]
      },

      {
        cle: "consequences",
        etiquette: "Ce que ça coûte",
        phrase: "Une batterie vide ne {sonne plus}.",
        image: "assets/img/comportements/mobulis-batterie-vide.webp",
        cadrage: "50%",
        alt: "Un Mobulis oublié et déchargé est coincé entre des marchandises",
        idees: [
          {
            rang: "Plus on attend, plus on complique la recherche",
            texte: "Un Mobulis perdu doit être recherché tant qu'il est encore allumé."
          },
          {
            rang: "La batterie finit par se vider",
            texte: "Après plusieurs heures ou plusieurs jours, l'appareil peut s'éteindre complètement."
          },
          {
            rang: "Et là, plus de sonnerie",
            texte: "Une fois déchargé, impossible de le faire sonner pour savoir où il se trouve."
          }
        ]
      },

      {
        cle: "bon",
        etiquette: "Le bon réflexe",
        phrase: "Perdu ? On le cherche {tout de suite}.",
        image: "assets/img/comportements/mobulis-retrouve.webp",
        cadrage: "42%",
        alt: "Des employés recherchent immédiatement un Mobulis égaré dans le magasin",
        idees: [
          {
            rang: "Gardez un volume audible",
            texte: "Évitez de laisser le son du Mobulis trop bas : il peut servir à le retrouver."
          },
          {
            rang: "Cherchez immédiatement",
            texte: "Dès qu'un Mobulis manque, on regarde où il a été utilisé et posé en dernier."
          },
          {
            rang: "Prévenez sans attendre",
            texte: "Si vous ne le retrouvez pas rapidement, signalez-le tout de suite. N'attendez pas qu'il soit déchargé."
          }
        ]
      }
    ]
  }

];


/* <===================== GABARIT À DUPLIQUER =====================>
   Copier le bloc ci-dessous DANS le tableau COMPORTEMENTS, au-dessus
   du crochet fermant, une fois par comportement.

   Une face sans `image` s'affiche avec un cadre rayé « visuel à
   venir » : le parcours reste jouable pendant la rédaction.

  {
    id: "",
    famille: "",
    titre: "",
    accroche: "",
    vignette: "",
    faces: [
      {
        cle: "geste",
        etiquette: "Comment commencent les ennuis",
        phrase: "",
        image: "",
        cadrage: "50%",
        alt: "",
        idees: [
          { rang: "", texte: "" },
          { rang: "", texte: "" },
          { rang: "", texte: "" }
        ]
      },
      {
        cle: "consequences",
        etiquette: "Ce que ça coûte",
        phrase: "",
        image: "",
        alt: "",
        idees: [
          { rang: "", texte: "" },
          { rang: "", texte: "" },
          { rang: "", texte: "" }
        ]
      },
      {
        cle: "bon",
        etiquette: "Le bon réflexe",
        phrase: "",
        image: "",
        alt: "",
        idees: [
          { rang: "", texte: "" },
          { rang: "", texte: "" },
          { rang: "", texte: "" }
        ]
      }
    ]
  },

   <===============================================================> */

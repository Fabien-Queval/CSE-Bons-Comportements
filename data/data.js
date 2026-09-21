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
     vignette : l'image de la carte. Laisser "" tant qu'elle n'existe
                pas : la carte affiche alors un cadre rayé.
     faces    : exactement trois, toujours dans cet ordre :
                 geste -> consequences -> bon
   }

   <---- La forme d'une face ---->
   {
     cle       : "geste", "consequences" ou "bon" — donne sa couleur
     etiquette : le petit mot au-dessus du titre
     phrase    : la phrase-titre. Les accolades marquent le mot-clé,
                 celui qui se décode et qui est surligné :
                   "Les accidents en réserve {arrivent}."
                 Une paire d'accolades au maximum, et pas obligatoire.
     image     : chemin depuis index.html
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
        etiquette: "Le geste",
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
        etiquette: "Le geste",
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

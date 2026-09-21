/* <============================ APP.JS ============================>
   Le pilote du parcours. Il fait quatre choses :
     1. montrer une face à la fois, et passer à la suivante au clic
     2. révéler les idées une par une avant de changer de face
     3. demander au navigateur d'animer le passage (View Transitions)
     4. les deux effets que le CSS ne sait pas faire seul :
        le mot-clé qui se décode, et la parallaxe à la souris

   Balise <script src> classique, JAMAIS type="module" : les modules ES
   sont bloqués en file://, donc en double-clic.

   Tout est enfermé dans une fonction appelée immédiatement (IIFE) :
   aucune de ces variables ne se retrouve dans window.
   <===============================================================> */

(function () {
  "use strict";

  /* <---- Le contrat avec le CSS ---->
     La classe sans-js est posée dans le HTML et retirée ici. Tant qu'elle
     est là, le CSS affiche toutes les idées : si ce fichier ne se charge
     pas, la fiche reste lisible au lieu d'être vide. */
  document.documentElement.classList.remove("sans-js");

  var ORDRE    = ["geste", "consequences", "bon"];
  var segments = Array.prototype.slice.call(document.querySelectorAll(".progression__segment"));
  var invite   = document.querySelector(".invite");
  var bouton   = document.querySelector(".theme");

  /* Le réglage système "réduire les animations". On le lit une fois : il
     coupe le décodage, la parallaxe et le morph, sans rien casser d'autre. */
  var reduit = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* L'amplitude de la parallaxe est un token CSS, pas une valeur en dur. */
  var amplitude = parseFloat(
    getComputedStyle(document.documentElement).getPropertyValue("--parallaxe")
  ) || 0;

  var vue = "accueil";  /* "accueil" ou "fiche" — qui est a l'ecran */
  var iComportement = 0;/* le comportement ouvert */
  var iFace = 0;        /* la face affichée */
  var iIdee = 0;        /* combien d'idées sont déjà révélées dessus */
  var enTransition = false;
  var arreterDecodage = null;
  var premierClic = true;

  
  /* <=========================== RENDER ===========================>
     Fabrique la scène à partir d'un objet de data.js. Tout ce qui
     suit dans ce fichier travaille sur ce qu'elle a produit.

     Rien n'est écrit en innerHTML : on clone un moule et on remplit
     des textContent. Un texte reste un texte, même s'il contient des
     chevrons.
     <===============================================================> */

  var scene   = document.querySelector(".scene");
  var fil     = document.querySelector(".entete__fil");
  var tplFace = document.getElementById("tpl-face");
  var tplIdee = document.getElementById("tpl-idee");

  var accueil  = document.getElementById("accueil");
  var grille   = document.querySelector(".accueil__grille");
  var tplCarte = document.getElementById("tpl-carte");

  var faces = [];   /* rempli par render(), dans l'ordre de data.js */

    /* Écrit une phrase-titre dans son <h1>, en isolant le mot-clé.
     Reçoit "Les accidents en réserve {arrivent}."
     Produit  Les accidents en réserve <b class="cle">arrivent</b>. */

  function ecrirePhrase(titre, phrase) {

    /* Où sont les accolades ? indexOf renvoie leur position,
       ou -1 si le caractère n'est pas dans la chaîne. */
    var ouvre = phrase.indexOf("{");
    var ferme = phrase.indexOf("}");

    /* Le h1 est vidé : on repart d'un contenant propre. */
    titre.textContent = "";

    /* Pas de mot-clé ? La phrase s'écrit telle quelle, et on sort. */
    if (ouvre === -1 || ferme === -1) {
      titre.textContent = phrase;
      return;
    }

    /* Trois morceaux. slice(début, fin) prend le début, pas la fin.
       ouvre + 1 : le mot commence APRÈS l'accolade ouvrante.
       ferme + 1 : la suite commence APRÈS l'accolante fermante.
       slice avec un seul nombre va jusqu'au bout de la chaîne. */
    var avant = phrase.slice(0, ouvre);
    var mot   = phrase.slice(ouvre + 1, ferme);
    var apres = phrase.slice(ferme + 1);

    /* La balise <b class="cle"> est fabriquée en mémoire, vide,
       puis on lui donne sa classe et son texte. */
    var b = document.createElement("b");
    b.className = "cle";
    b.textContent = mot;

    /* createTextNode fabrique du texte sans balise autour.
       appendChild colle à la fin : trois appels = trois morceaux
       dans l'ordre. */
    titre.appendChild(document.createTextNode(avant));
    titre.appendChild(b);
    titre.appendChild(document.createTextNode(apres));
  }

  function render(comportement) {
    Array.prototype.slice.call(scene.querySelectorAll(".face"))
      .forEach(function (face) { face.remove(); });

    fil.textContent = comportement.famille + " · " + comportement.titre;

    faces = comportement.faces.map(function (donnees) {
      var face = tplFace.content.firstElementChild.cloneNode(true);
      face.id = "face-" + donnees.cle;

      /* Une face en cours de redaction n'a pas encore son visuel. On
         retire l'element plutot que de lui laisser un src vide : un
         src="" declenche une requete vers la page elle-meme. */
      var image = face.querySelector(".face__image");
      if (donnees.image) {
        image.src = donnees.image;
        image.alt = donnees.alt || "";
      } else {
        image.remove();
        face.querySelector(".face__cadre").classList.add("face__cadre--vide");
      }

      face.querySelector(".face__etiquette").textContent = donnees.etiquette;
      ecrirePhrase(face.querySelector(".face__phrase"), donnees.phrase);

      var idees = face.querySelector(".idees");
      donnees.idees.forEach(function (source) {
        var idee = tplIdee.content.firstElementChild.cloneNode(true);
        idee.querySelector(".idee__rang").textContent  = source.rang;
        idee.querySelector(".idee__texte").textContent = source.texte;
        idees.appendChild(idee);
      });

      scene.appendChild(face);
      return face;
    });
  }


  /* <========================== L'ACCUEIL ==========================>
     Une carte par comportement. La carte est un <button> : le clavier
     la traverse et l'active sans une ligne de code en plus.
     <===============================================================> */

  function renderCartes() {
    grille.textContent = "";

    COMPORTEMENTS.forEach(function (comportement, i) {
      var carte    = tplCarte.content.firstElementChild.cloneNode(true);
      var vignette = carte.querySelector(".carte__vignette");
      var image    = carte.querySelector(".carte__image");

      /* Pas encore de visuel : on retire l'element plutot que de lui
         laisser un src vide, qui declenche une requete vers la page. */
      if (comportement.vignette) {
        image.src = comportement.vignette;
        image.alt = "";
      } else {
        image.remove();
        vignette.classList.add("carte__vignette--vide");
      }

      carte.querySelector(".carte__famille").textContent  = comportement.famille;
      carte.querySelector(".carte__accroche").textContent =
        comportement.accroche || comportement.titre;

      carte.addEventListener("click", function (evenement) {
        evenement.stopPropagation();
        ouvrirFiche(i);
      });

      grille.appendChild(carte);
    });
  }


  /* <========================= LA NAVIGATION =========================>
     Une seule vue est rendue a la fois : c'est ce qui garde les
     view-transition-name uniques. Deux ecrans affiches ensemble et le
     navigateur abandonne la transition sans message d'erreur.
     <===============================================================> */

  function ouvrirFiche(i) {
    if (enTransition) { return; }
    enTransition = true;
    iComportement = i;

    transition(function () {
      render(COMPORTEMENTS[i]);
      iFace = 0;
      iIdee = 0;
      afficher(0);
      accueil.hidden = true;
      vue = "fiche";
      document.body.dataset.vue = "fiche";
      if (invite) { invite.hidden = !premierClic; }
    })
      .then(function () { decoderFace(0); })
      .catch(function (erreur) { console.error("Ouverture interrompue :", erreur); })
      .finally(function () { enTransition = false; });
  }

  function retourAccueil() {
    if (enTransition || vue !== "fiche") { return; }
    enTransition = true;
    if (arreterDecodage) { arreterDecodage(); }

    transition(function () {
      faces.forEach(function (face) { face.hidden = true; });
      accueil.hidden = false;
      vue = "accueil";
      document.body.dataset.vue = "accueil";
      if (invite) { invite.hidden = true; }
    })
      .catch(function (erreur) { console.error("Retour interrompu :", erreur); })
      .finally(function () { enTransition = false; });
  }

  function rejouer() {
    if (enTransition || vue !== "fiche") { return; }
    enTransition = true;
    if (arreterDecodage) { arreterDecodage(); }

    transition(function () {
      iFace = 0;
      iIdee = 0;
      afficher(0);
    })
      .then(function () { decoderFace(0); })
      .catch(function (erreur) { console.error("Relance interrompue :", erreur); })
      .finally(function () { enTransition = false; });
  }


  /* <======================= AFFICHER UNE FACE ======================> */

  function ideesDe(i) {
    return Array.prototype.slice.call(faces[i].querySelectorAll(".idee"));
  }

  function afficher(i) {
    faces.forEach(function (face, j) { face.hidden = (j !== i); });

    /* C'est cet attribut qui donne sa couleur à toute la scène : --face
       change, et le fond, l'étiquette et les intertitres suivent. */
    document.body.dataset.face = ORDRE[i];

    segments.forEach(function (segment, j) {
      segment.classList.toggle("franchi", j <= i);
    });

    ideesDe(i).forEach(function (idee) { idee.classList.remove("vue"); });

  }


  /* <====================== LE MORPH ENTRE FACES =====================>
     startViewTransition prend une photo de l'écran, laisse la fonction
     modifier le DOM, puis anime vers une représentation VIVANTE de la
     nouvelle face. Ses animations doivent donc être synchronisées.
     Les éléments qui portent un view-transition-name sont morphés
     individuellement : c'est le CSS qui décide comment (voir style.css).

     Repli : si le navigateur ne connaît pas l'API, on appelle simplement
     la fonction. L'écran change d'un coup, rien n'est cassé.
     <===============================================================> */

  /* La nouvelle image apparaît déjà en pause. À la fin réelle du morph,
     elle reprend sans remise à zéro. finally retire aussi la pause si la
     transition échoue. Le repli sans API conserve la navigation. */
  function transition(changer) {
    if (reduit || !document.startViewTransition) {
      changer();
      return Promise.resolve();
    }
    document.body.classList.add("morph");
    try {
      return document.startViewTransition(changer).finished
        .finally(function () { document.body.classList.remove("morph"); });
    } catch (erreur) {
      document.body.classList.remove("morph");
      return Promise.reject(erreur);
    }
  }


  /* <========================== AVANCER ==========================>
     Un clic = une idée de plus. Quand les trois sont là, le clic suivant
     change de face. Après la troisième face, on repart au début (l'écran
     d'accueil prendra cette place quand il existera).
     <=============================================================> */

  function avancer() {
    if (enTransition || vue !== "fiche") { return; }
    if (premierClic) {
      premierClic = false;
      if (invite) { invite.hidden = true; }
    }

    var idees = ideesDe(iFace);

    if (iIdee < idees.length) {
      idees[iIdee].classList.add("vue");
      iIdee += 1;
      return;
    }

    /* Un décodage encore actif est terminé avant la capture de départ.
       Les clics et la parallaxe attendent la fin du changement de face. */
    /* Apres la derniere face, on rend la main a l'accueil plutot que
       de reboucler : l'employe voit qu'il a fini. */
    if (iFace === faces.length - 1) { retourAccueil(); return; }

    if (arreterDecodage) { arreterDecodage(); }
    enTransition = true;
    var suivante = iFace + 1;

    transition(function () {
      afficher(suivante);
      iFace = suivante;
      iIdee = 0;
    })
      .then(function () { decoderFace(suivante); })
      .catch(function (erreur) { console.error("Transition interrompue :", erreur); })
      .finally(function () { enTransition = false; });

  }


  /* <=================== LE MOT-CLÉ QUI SE DÉCODE ==================>
     Le seul effet de la liste qui exige du JavaScript : le CSS ne sait
     pas remplacer des caractères. Chaque lettre se fige à son tour, de
     gauche à droite. Le texte d'origine est relu dans data-mot pour que
     la fonction puisse être rejouée autant de fois qu'on veut.
     <===============================================================> */

  var ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz#%&/*+-";

  /* Mesure le titre définitif avant de brouiller ses lettres. La classe
     empêche flex de modifier cette hauteur pendant le décodage. */
  function decoderFace(i) {
    if (arreterDecodage) { arreterDecodage(); }
    var cle = faces[i].querySelector(".cle");
    if (!cle) { return; }
    if (reduit) { decoder(cle); return; }

    var propos = faces[i].querySelector(".face__propos");
    propos.style.height = propos.getBoundingClientRect().height + "px";
    propos.classList.add("decodage");
    arreterDecodage = decoder(cle, function () {
      propos.classList.remove("decodage");
      propos.style.height = "";
      arreterDecodage = null;
    });
  }

  function decoder(element, fini) {
    var mot = element.dataset.mot || element.textContent;
    element.dataset.mot = mot;

    if (reduit) { element.textContent = mot; if (fini) { fini(); } return; }

    var debut = performance.now();
    var duree = 620;
    var frame;
    var termine = false;

    function terminer() {
      if (termine) { return; }
      termine = true;
      window.cancelAnimationFrame(frame);
      element.textContent = mot;
      if (fini) { fini(); }
    }

    function pas(maintenant) {
      var avance = Math.min(1, (maintenant - debut) / duree);
      var sortie = "";

      for (var i = 0; i < mot.length; i += 1) {
        var seuil = i / mot.length;
        if (mot[i] === " " || avance > seuil + 0.25) {
          sortie += mot[i];
        } else {
          sortie += ALPHABET[Math.floor(Math.random() * ALPHABET.length)];
        }
      }

      element.textContent = sortie;
      if (avance < 1) { frame = window.requestAnimationFrame(pas); }
      else { terminer(); }
    }

    frame = window.requestAnimationFrame(pas);
    return terminer;
  }


  /* <======================= LA PARALLAXE =======================>
     L'image se décale à contresens du curseur, de quelques pixels.
     On écrit deux variables CSS ; c'est le CSS qui décide de la durée
     et de la courbe du mouvement. Verticalement, moitié moins, sinon
     le haut de la bande se décolle de son fondu.
     <===========================================================> */

  window.addEventListener("pointermove", function (evenement) {
    if (reduit || !amplitude || enTransition) { return; }
    if (vue !== "fiche" || !faces[iFace]) { return; }

    var image = faces[iFace].querySelector(".face__image");
    if (!image) { return; }

    var dx = (evenement.clientX / window.innerWidth  - 0.5) * -2;
    var dy = (evenement.clientY / window.innerHeight - 0.5) * -2;

    image.style.setProperty("--px", (dx * amplitude).toFixed(1) + "px");
    image.style.setProperty("--py", (dy * amplitude * 0.5).toFixed(1) + "px");
  });


  /* <====================== LES ENTRÉES ======================> */

  /* Le clic est écouté sur le document entier : toute la scène avance,
     sauf le bouton de thème. */
  document.addEventListener("click", function (evenement) {
    var action = evenement.target.closest("[data-action]");
    if (action) {
      if (action.dataset.action === "accueil") { retourAccueil(); }
      if (action.dataset.action === "rejouer") { rejouer(); }
      return;
    }
    if (evenement.target.closest(".theme, .carte")) { return; }
    avancer();
  });

  /* Au clavier : espace, entrée, flèche droite. Sans ça, la fiche est
     inutilisable pour qui n'utilise pas de souris. */
  document.addEventListener("keydown", function (evenement) {
    /* Un bouton ou une carte qui a le focus gere lui-meme espace et
       entree : on ne lui coupe pas l'herbe sous le pied. */
    if (document.activeElement && document.activeElement.closest(".bouton, .carte")) { return; }

    if (evenement.key === "Escape") { retourAccueil(); return; }

    if (evenement.key === " " || evenement.key === "Enter" || evenement.key === "ArrowRight") {
      evenement.preventDefault();
      avancer();
    }
  });

  if (bouton) {
    bouton.addEventListener("click", function () {
      var sombre = document.body.dataset.theme === "sombre";
      document.body.dataset.theme = sombre ? "clair" : "sombre";
      bouton.setAttribute("aria-pressed", String(!sombre));
    });
  }

  /* Le thème suit le réglage du système au démarrage. L'utilisateur
     reprend la main dès qu'il touche au bouton. */
  if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
    document.body.dataset.theme = "sombre";
    if (bouton) { bouton.setAttribute("aria-pressed", "true"); }
  }

  renderCartes();
  document.body.dataset.vue = "accueil";

}());

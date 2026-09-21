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
  var faces    = ORDRE.map(function (nom) { return document.getElementById("face-" + nom); });
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

  var iFace = 0;        /* la face affichée */
  var iIdee = 0;        /* combien d'idées sont déjà révélées dessus */
  var premierClic = true;


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

    relancerDezoom(i);

    /* Le décodage attend la fin du morph : pendant la transition de vue,
       l'écran affiché est une PHOTO de la page, pas la page elle-même.
       Un texte qui change dessous ne se verrait pas. */
    var cle = faces[i].querySelector(".cle");
    if (cle) { window.setTimeout(function () { decoder(cle); }, reduit ? 0 : 480); }
  }

  /* Une animation CSS ne se rejoue pas parce qu'un élément redevient
     visible. On la retire, on force le navigateur à recalculer le style
     (la lecture de offsetWidth suffit), puis on la remet. */
  function relancerDezoom(i) {
    var image = faces[i].querySelector(".face__image");
    if (!image) { return; }
    image.style.animation = "none";
    void image.offsetWidth;
    image.style.animation = "";
  }


  /* <====================== LE MORPH ENTRE FACES =====================>
     startViewTransition prend une photo de l'écran, laisse la fonction
     modifier le DOM, reprend une photo, puis anime de l'une à l'autre.
     Les éléments qui portent un view-transition-name sont morphés
     individuellement : c'est le CSS qui décide comment (voir style.css).

     Repli : si le navigateur ne connaît pas l'API, on appelle simplement
     la fonction. L'écran change d'un coup, rien n'est cassé.
     <===============================================================> */

  function transition(changer) {
    if (reduit || !document.startViewTransition) { changer(); return; }
    document.startViewTransition(changer);
  }


  /* <========================== AVANCER ==========================>
     Un clic = une idée de plus. Quand les trois sont là, le clic suivant
     change de face. Après la troisième face, on repart au début (l'écran
     d'accueil prendra cette place quand il existera).
     <=============================================================> */

  function avancer() {
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

    iIdee = 0;
    iFace = (iFace + 1) % faces.length;
    transition(function () { afficher(iFace); });
  }


  /* <=================== LE MOT-CLÉ QUI SE DÉCODE ==================>
     Le seul effet de la liste qui exige du JavaScript : le CSS ne sait
     pas remplacer des caractères. Chaque lettre se fige à son tour, de
     gauche à droite. Le texte d'origine est relu dans data-mot pour que
     la fonction puisse être rejouée autant de fois qu'on veut.
     <===============================================================> */

  var ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz#%&/*+-";

  function decoder(element) {
    var mot = element.dataset.mot || element.textContent;
    element.dataset.mot = mot;

    if (reduit) { element.textContent = mot; return; }

    var debut = performance.now();
    var duree = 620;

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
      if (avance < 1) { window.requestAnimationFrame(pas); }
      else { element.textContent = mot; }
    }

    window.requestAnimationFrame(pas);
  }


  /* <======================= LA PARALLAXE =======================>
     L'image se décale à contresens du curseur, de quelques pixels.
     On écrit deux variables CSS ; c'est le CSS qui décide de la durée
     et de la courbe du mouvement. Verticalement, moitié moins, sinon
     le haut de la bande se décolle de son fondu.
     <===========================================================> */

  window.addEventListener("pointermove", function (evenement) {
    if (reduit || !amplitude) { return; }

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
    if (evenement.target.closest(".theme")) { return; }
    avancer();
  });

  /* Au clavier : espace, entrée, flèche droite. Sans ça, la fiche est
     inutilisable pour qui n'utilise pas de souris. */
  document.addEventListener("keydown", function (evenement) {
    if (document.activeElement && document.activeElement.closest(".theme")) { return; }
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

  afficher(0);

}());

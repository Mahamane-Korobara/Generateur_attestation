// Récupération des éléments du DOM pour la gestion du popup des formes et lignes
const selectionFormeLigne = document.getElementById("selection-forme-ligne"); // Bouton d'ouverture du popup
const darkBgElements = document.querySelector(".dark_bg-elements"); // Fond sombre pour le popup mobile
const surgirElements = document.querySelector(".surgir-elements"); // Popup pour mobile
const fermeBtnElements = document.querySelector(".fermeBtn-element"); // Bouton de fermeture (version mobile)
const surgirElementsOrdi = document.querySelector(".surgir-elements-ordi"); // Popup pour desktop

/**
 * Ouvre le popup en version mobile pour les éléments.
 * Affiche le fond sombre et le popup mobile.
 */
function ouverturePopupElementsMobile() {
  darkBgElements.classList.add("active-selection-elements");
  surgirElements.classList.add("active-selection-elements");
}

/**
 * Ouvre le popup en version desktop pour les éléments.
 * Affiche le popup desktop et ajoute un margin à la zone du canvas.
 */
function ouverturePopupElementsOrdinateur() {
  surgirElementsOrdi.classList.add("active-selection-elements-ordi");
  document.querySelector(".canvas-wrapper").classList.add("ajout-margin");
}

// Empêcher la fermeture du popup desktop si l'utilisateur clique à l'intérieur
surgirElementsOrdi.addEventListener("click", function (event) {
  event.stopPropagation();
});

// Ouverture du popup lors du clic sur le bouton de sélection de formes
// Dans l'ouverture du popup forme-ligne en version desktop
selectionFormeLigne.addEventListener("click", (event) => {
  event.stopPropagation();
  if (window.matchMedia("(max-width: 768px)").matches) {
    // Fermer le popup QR code s'il est ouvert
    darkBgQr.classList.remove("active-selection-qr");
    surgirQr.classList.remove("active-selection-qr");
    conteneur.classList.remove("active");
    
    // Fermer le popup de texte s'il est ouvert
    darkBg.classList.remove("active-selection");
    surgir.classList.remove("active-selection");
    
    // Fermer la palette de couleurs si elle est ouverte
    choixCouleur.classList.remove("activePalleteCouleur");
    
    // Ouvrir le popup des formes
    ouverturePopupElementsMobile();
  } else {
    // Fermer le popup QR code s'il est ouvert
    darkBgQr.classList.remove("active-selection-qr");
    surgirQr.classList.remove("active-selection-qr");
    conteneur.classList.remove("active");

    // Fermer le popup de texte en version desktop si ouvert
    surgirOrdi.classList.remove("active-selection-ordi");

    // Fermer la palette de couleurs si elle est ouverte
    choixCouleur.classList.remove("activePalleteCouleur");
    document.querySelector(".canvas-wrapper").classList.remove("ajout-margin");

    // Puis ouvrir le popup des formes
    ouverturePopupElementsOrdinateur();
  }
});

// Fermeture du popup mobile via le bouton de fermeture
fermeBtnElements.addEventListener("click", () => {
  darkBgElements.classList.remove("active-selection-elements");
  surgirElements.classList.remove("active-selection-elements");
});

// Fermeture du popup desktop via son bouton de fermeture
document
  .querySelector(".surgir-elements-ordi .fermeBtn-element")
  .addEventListener("click", () => {
    surgirElementsOrdi.classList.remove("active-selection-elements-ordi");
    document.querySelector(".canvas-wrapper").classList.remove("ajout-margin");
  });

// Fermeture du popup mobile si l'utilisateur clique sur le fond sombre
darkBgElements.addEventListener("click", () => {
  darkBgElements.classList.remove("active-selection-elements");
  surgirElements.classList.remove("active-selection-elements");
});

// Fermeture du popup desktop si l'utilisateur clique sur le body
document.body.addEventListener("click", function () {
  surgirElementsOrdi.classList.remove("active-selection-elements-ordi");
  document.querySelector(".canvas-wrapper").classList.remove("ajout-margin");
});
/**
 * Crée une étoile avec un nombre spécifié de branches.
 * @param {number} nombrePoint - Nombre de branches de l'étoile.
 * @param {number} outerRadius - la longueur des points de l'étoile.
 * @param {number} innerRadius - Rayon intérieur de l'étoile.
 * @param {number} cx - Position horizontale du centre de l'étoile.
 * @param {number} cy - Position verticale du centre de l'étoile.
 * @returns {Array} - Tableau des points constituant l'étoile.
 */
function createStarPoints(nombrePoint, outerRadius, innerRadius, cx, cy) {
  const points = []; // Tableau qui contiendra les points de l'étoile
  const calculeAnglePoint = Math.PI / nombrePoint; // Angle entre chaque point (alternant entre point externe et interne)

  // Boucle sur chaque point (double du nombre de branches pour alterner outer et inner)
  for (let i = 0; i < 2 * nombrePoint; i++) {
    // Détermine le rayon à utiliser (outer pour les points pairs, inner pour les impairs)
    const radius = i % 2 === 0 ? outerRadius : innerRadius;
    const x = cx + radius * Math.cos(i * calculeAnglePoint); // Calcul de la coordonnée x
    const y = cy + radius * Math.sin(i * calculeAnglePoint); // Calcul de la coordonnée y
    points.push({ x, y }); // Ajout du point au tableau
  }

  return points;
}

/**
 * Fonction globale pour créer et ajouter une forme au canvas.
 * @param {string} type - Le type de forme à créer (ex: "diamond", "pentagon", "star5", etc.).
 * @param {number} left - Position horizontale de la forme sur le canvas.
 * @param {number} top - Position verticale de la forme sur le canvas.
 * @param {string} fill - Couleur de remplissage de la forme.
 * @returns {fabric.Object} - L'objet Fabric.js créé.
 */
function createShape(type, left = 50, top = 50, fill = "black") {
  let shape; // Variable qui stockera la forme créée

  switch (type) {
    // ====================================================
    // Rangée 1: Formes de base
    // ====================================================
    case "diamond":
      // Création d'un losange
      shape = new fabric.Polygon(
        [
          { x: 50, y: 25 },
          { x: 75, y: 50 },
          { x: 50, y: 75 },
          { x: 25, y: 50 },
        ],
        { fill, left, top }
      );
      break;

    case "pentagon":
      // Création d'un pentagone
      shape = new fabric.Polygon(
        [
          { x: 50, y: 25 },
          { x: 75, y: 40 },
          { x: 65, y: 70 },
          { x: 35, y: 70 },
          { x: 25, y: 40 },
        ],
        { fill, left, top }
      );
      break;

    case "hexagon":
      // Création d'un hexagone
      shape = new fabric.Polygon(
        [
          { x: 50, y: 25 },
          { x: 75, y: 37 },
          { x: 75, y: 63 },
          { x: 50, y: 75 },
          { x: 25, y: 63 },
          { x: 25, y: 37 },
        ],
        { fill, left, top }
      );
      break;

    case "heptagon":
      // Création d'un heptagone
      shape = new fabric.Polygon(
        [
          { x: 50, y: 25 },
          { x: 70, y: 32 },
          { x: 75, y: 50 },
          { x: 65, y: 68 },
          { x: 35, y: 68 },
          { x: 25, y: 50 },
          { x: 30, y: 32 },
        ],
        { fill, left, top }
      );
      break;

    case "octagon":
      // Création d'un octogone
      shape = new fabric.Polygon(
        [
          { x: 75, y: 50 }, // 0° - à droite
          { x: 67.7, y: 67.7 }, // 45° - en bas à droite
          { x: 50, y: 75 }, // 90° - en bas
          { x: 32.3, y: 67.7 }, // 135° - en bas à gauche
          { x: 25, y: 50 }, // 180° - à gauche
          { x: 32.3, y: 32.3 }, // 225° - en haut à gauche
          { x: 50, y: 25 }, // 270° - en haut
          { x: 67.7, y: 32.3 }, // 315° - en haut à droite
        ],
        { fill, left, top }
      );
      break;

    // ====================================================
    // Rangée 2: Étoiles
    // ====================================================
    case "star4":
      // Création d'une étoile à 4 branches
      shape = new fabric.Polygon(createStarPoints(4, 40, 20, 50, 50), {
        fill,
        left,
        top,
      });
      break;

    case "star5":
      // Création d'une étoile à 5 branches
      shape = new fabric.Polygon(createStarPoints(5, 40, 15, 50, 50), {
        fill,
        left,
        top,
      });
      break;

    case "star6":
      // Création d'une étoile à 6 branches
      shape = new fabric.Polygon(createStarPoints(6, 40, 25, 50, 50), {
        fill,
        left,
        top,
      });
      break;

    case "star8":
      // Création d'une étoile à 8 branches
      shape = new fabric.Polygon(createStarPoints(8, 40, 31, 50, 50), {
        fill,
        left,
        top,
      });
      break;

    case "star8Rempli":
      // Création d'une étoile à 8 branches avec remplissage plus dense
      shape = new fabric.Polygon(createStarPoints(8, 40, 35, 50, 50), {
        fill,
        left,
        top,
      });
      break;

    case "multiStar1":
      // Création d'une étoile à 12 branches
      shape = new fabric.Polygon(createStarPoints(12, 40, 29, 50, 50), {
        fill,
        left,
        top,
      });
      break;

    case "multiStar2":
      // Création d'une étoile à 17 branches
      shape = new fabric.Polygon(createStarPoints(17, 40, 29, 50, 50), {
        fill,
        left,
        top,
      });
      break;

    case "multiStar3":
      // Création d'une étoile à 20 branches
      shape = new fabric.Polygon(createStarPoints(20, 40, 35, 50, 50), {
        fill,
        left,
        top,
      });
      break;

    case "multiStar4":
      // Création d'une étoile à 30 branches
      shape = new fabric.Polygon(createStarPoints(30, 40, 38, 50, 50), {
        fill,
        left,
        top,
      });
      break;
    // ====================================================
    // Rangée 3: Formes complexes et flèches
    // ====================================================
    case "rightArrow":
      // Création d'une flèche pointant vers la droite
      shape = new fabric.Polygon(
        [
          { x: 10, y: 30 },
          { x: 60, y: 30 },
          { x: 60, y: 15 },
          { x: 90, y: 50 },
          { x: 60, y: 85 },
          { x: 60, y: 70 },
          { x: 10, y: 70 },
        ],
        { fill, left, top }
      );
      break;

    case "leftArrow":
      // Création d'une flèche pointant vers la gauche
      shape = new fabric.Polygon(
        [
          { x: 90, y: 30 },
          { x: 40, y: 30 },
          { x: 40, y: 15 },
          { x: 10, y: 50 },
          { x: 40, y: 85 },
          { x: 40, y: 70 },
          { x: 90, y: 70 },
        ],
        { fill, left, top }
      );
      break;

    case "upArrow":
      // Création d'une flèche pointant vers le haut
      shape = new fabric.Polygon(
        [
          { x: 30, y: 90 },
          { x: 30, y: 40 },
          { x: 15, y: 40 },
          { x: 50, y: 10 },
          { x: 85, y: 40 },
          { x: 70, y: 40 },
          { x: 70, y: 90 },
        ],
        { fill, left, top }
      );
      break;

    case "downArrow":
      // Création d'une flèche pointant vers le bas
      shape = new fabric.Polygon(
        [
          { x: 30, y: 10 },
          { x: 30, y: 60 },
          { x: 15, y: 60 },
          { x: 50, y: 90 },
          { x: 85, y: 60 },
          { x: 70, y: 60 },
          { x: 70, y: 10 },
        ],
        { fill, left, top }
      );
      break;

    case "doubleArrow":
      // Création d'une double flèche (flèche aux deux extrémités)
      shape = new fabric.Polygon(
        [
          { x: 10, y: 40 },
          { x: 35, y: 40 },
          { x: 35, y: 25 },
          { x: 50, y: 50 },
          { x: 35, y: 75 },
          { x: 35, y: 60 },
          { x: 10, y: 60 },
          { x: 10, y: 75 },
          { x: 0, y: 50 },
          { x: 10, y: 25 },
        ],
        { fill, left, top }
      );
      break;

    case "pentagonDirection":
      // Création d'un pentagone orienté (peut-être pour indiquer une direction)
      shape = new fabric.Polygon(
        [
          { x: 10, y: 35 },
          { x: 60, y: 35 },
          { x: 90, y: 50 },
          { x: 60, y: 65 },
          { x: 10, y: 65 },
        ],
        { fill, left, top }
      );
      break;

    case "chevron":
      // Création d'un chevron avec une pointe
      shape = new fabric.Polygon(
        [
          { x: 10, y: 35 },
          { x: 60, y: 35 },
          { x: 80, y: 50 },
          { x: 60, y: 65 },
          { x: 10, y: 65 },
          { x: 30, y: 50 },
        ],
        { fill, left, top }
      );
      break;

    case "chevronNonPointu":
      // Création d'un chevron sans pointe marquée
      shape = new fabric.Polygon(
        [
          { x: 10, y: 35 },
          { x: 60, y: 35 },
          { x: 60, y: 50 },
          { x: 60, y: 65 },
          { x: 10, y: 65 },
          { x: 30, y: 50 },
        ],
        { fill, left, top }
      );
      break;

    case "croix":
      // Création d'une croix
      shape = new fabric.Polygon(
        [
          { x: 35, y: 10 },
          { x: 65, y: 10 },
          { x: 65, y: 35 },
          { x: 90, y: 35 },
          { x: 90, y: 65 },
          { x: 65, y: 65 },
          { x: 65, y: 90 },
          { x: 35, y: 90 },
          { x: 35, y: 65 },
          { x: 10, y: 65 },
          { x: 10, y: 35 },
          { x: 35, y: 35 },
        ],
        { fill, left, top }
      );
      break;

    case "decorativeFrame":
      // Création d'un cadre décoratif
      shape = new fabric.Polygon(
        [
          { x: 15, y: 15 },
          { x: 85, y: 15 },
          { x: 95, y: 25 },
          { x: 95, y: 75 },
          { x: 85, y: 85 },
          { x: 15, y: 85 },
          { x: 5, y: 75 },
          { x: 5, y: 25 },
        ],
        { fill, left, top }
      );
      break;

    case "paralellogramme":
      // Création d'un parallélogramme
      shape = new fabric.Polygon(
        [
          { x: 30, y: 20 },
          { x: 90, y: 20 },
          { x: 70, y: 80 },
          { x: 10, y: 80 },
        ],
        { fill, left, top }
      );
      break;

    case "trapeze":
      // Création d'un trapèze
      shape = new fabric.Polygon(
        [
          { x: 30, y: 20 },
          { x: 70, y: 20 },
          { x: 90, y: 80 },
          { x: 10, y: 80 },
        ],
        { fill, left, top }
      );
      break;

    case "triangle":
      // Création d'un triangle
      shape = new fabric.Polygon(
        [
          { x: 50, y: 20 },
          { x: 90, y: 80 },
          { x: 10, y: 80 },
        ],
        { fill, left, top }
      );
      break;

    case "cercle":
      // Création d'un cercle
      shape = new fabric.Circle({ radius: 40, fill, left, top });
      break;

    case "demi-cercle":
      // Création d'un demi-cercle en utilisant un chemin (path)
      shape = new fabric.Path("M 10,50 A 40,40 0 0 1 90,50 L 90,50 L 10,50 Z", {
        fill,
        left,
        top,
      });
      break;
    // ====================================================
    // Rangée 4: Formes spéciales
    // ====================================================
    case "heart":
      // Création d'un coeur via un chemin (path)
      shape = new fabric.Path(
        "M 10,30 A 22,22 0 0,1 50,8 A 22,22 0 0,1 90,30 Q 90,32 50,70 Q 10,32 10,30 Z",
        { fill, left, top }
      );
      break;

    // Ajoutez d'autres formes ici...

    default:
      // Affiche une erreur dans la console si le type de forme est inconnu
      console.error("Type de forme non reconnu :", type);
      return null;
  }

  // Ajoute la forme au canvas Fabric.js et rafraîchit l'affichage
  canvas.add(shape);
  canvas.renderAll();
  // Masque le popup des éléments après la création de la forme
  darkBgElements.classList.remove("active-selection-elements");
  surgirElements.classList.remove("active-selection-elements");
  return shape;
}

/**
 * Crée une ligne avec différents styles
 * @param {string} type - Le type de ligne à créer (ex: "solid", "dashed", "dotted", etc.)
 * @param {number} x1 - Position x du point de départ
 * @param {number} y1 - Position y du point de départ
 * @param {number} x2 - Position x du point d'arrivée
 * @param {number} y2 - Position y du point d'arrivée
 * @param {string} stroke - Couleur de la ligne
 * @returns {fabric.Object} - L'objet Fabric.js créé
 */
function createLine(
  type,
  x1 = 50,
  y1 = 50,
  x2 = 150,
  y2 = 50,
  stroke = "black"
) {
  let line; // Variable pour stocker la ligne créée
  const commonProps = {
    stroke,
    strokeWidth: 2,
    selectable: true,
    originX: "center",
    originY: "center",
  };

  switch (type) {
    // Ligne continue simple
    case "solid":
      // Création d'une ligne continue classique
      line = new fabric.Line([x1, y1, x2, y2], {
        ...commonProps,
      });
      break;

    // Ligne pointillée
    case "dashed":
      // Création d'une ligne en pointillés (10px de trait, 10px d'espace)
      line = new fabric.Line([x1, y1, x2, y2], {
        ...commonProps,
        strokeDashArray: [10, 10],
      });
      break;

    // Ligne en pointillés courts
    case "dotted":
      // Création d'une ligne en petits points
      line = new fabric.Line([x1, y1, x2, y2], {
        ...commonProps,
        strokeDashArray: [3, 3],
      });
      break;

    // Flèche simple
    case "arrow":
      // Calcul de l'angle de la ligne pour orienter la flèche correctement
      const dx = x2 - x1;
      const dy = y2 - y1;
      const angle = Math.atan2(dy, dx);

      // Création d'un groupe comprenant la ligne et la pointe de la flèche
      line = new fabric.Group([
        new fabric.Line([x1, y1, x2, y2], commonProps),
        // Création de la pointe de la flèche en forme de triangle
        new fabric.Polygon(
          [
            { x: -10, y: -5 },
            { x: 0, y: 0 },
            { x: -10, y: 5 },
          ],
          {
            ...commonProps,
            fill: stroke,
            left: x2,
            top: y2,
            angle: angle * (180 / Math.PI), // Conversion en degrés
          }
        ),
      ]);
      break;

    // Double flèche
    case "doubleArrow":
      // Calcul de l'angle pour orienter les deux flèches
      const angle1 = Math.atan2(y2 - y1, x2 - x1);
      line = new fabric.Group([
        new fabric.Line([x1, y1, x2, y2], commonProps),
        // Flèche de début (pointe à gauche)
        new fabric.Polygon(
          [
            { x: 10, y: -5 },
            { x: 0, y: 0 },
            { x: 10, y: 5 },
          ],
          {
            ...commonProps,
            fill: stroke,
            left: x1,
            top: y1,
            angle: angle1 * (180 / Math.PI) + 180,
          }
        ),
        // Flèche de fin (pointe à droite)
        new fabric.Polygon(
          [
            { x: -10, y: -5 },
            { x: 0, y: 0 },
            { x: -10, y: 5 },
          ],
          {
            ...commonProps,
            fill: stroke,
            left: x2,
            top: y2,
            angle: angle1 * (180 / Math.PI),
          }
        ),
      ]);
      break;

    default:
      // Affiche une erreur dans la console si le type de ligne est inconnu
      console.error("Type de ligne non reconnu :", type);
      return null;
  }

  // Ajoute la ligne au canvas et rafraîchit l'affichage
  canvas.add(line);
  canvas.renderAll();
  // Masque le popup des éléments après la création de la ligne
  darkBgElements.classList.remove("active-selection-elements");
  surgirElements.classList.remove("active-selection-elements");
  return line;
}

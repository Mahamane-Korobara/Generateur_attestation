// ==================================================
// Fichier : text.js
// Description : Gestion de l'ajout et de la manipulation
//               de texte sur le canvas via Fabric.js.
// ==================================================

// ============================
// 1. Sélection des éléments DOM
// ============================
const selectionTexte = document.getElementById("selection-texte"); // Bouton d'ouverture du popup
const darkBg = document.querySelector(".dark_bg"); // Fond sombre pour le popup mobile
const surgir = document.querySelector(".surgir"); // Popup pour mobile
const fermeBtn = document.querySelector(".fermeBtn"); // Bouton de fermeture (version mobile)
const surgirOrdi = document.querySelector(".surgir-ordi"); // Popup pour desktop

// ============================
// 2. Gestion des popups
// ============================

/**
 * Ouvre le popup en version mobile.
 * Affiche le fond sombre et le popup mobile.
 */
function ouverturePopupMobile() {
  darkBg.classList.add("active-selection");
  surgir.classList.add("active-selection");
}

/**
 * Ouvre le popup en version desktop.
 * Affiche le popup desktop et ajoute un margin à la zone du canvas.
 */
function ouverturePopupOrdinateur() {
  // console.log("Ouverture popup desktop"); // Vérification du déclenchement
  surgirOrdi.classList.add("active-selection-ordi");
  document.querySelector(".canvas-wrapper").classList.add("ajout-margin");
}

// ============================
// 3. Gestion des événements liés aux popups
// ============================

// Empêcher la fermeture du popup desktop si l'utilisateur clique à l'intérieur
surgirOrdi.addEventListener("click", function (event) {
  event.stopPropagation();
});

// Ouverture du popup lors du clic sur le bouton de sélection de texte
selectionTexte.addEventListener("click", (event) => {
  event.stopPropagation();
  if (window.matchMedia("(max-width: 768px)").matches) {
    // Fermer le popup QR code s'il est ouvert
    darkBgQr.classList.remove("active-selection-qr");
    surgirQr.classList.remove("active-selection-qr");
    conteneur.classList.remove("active");
    
    // Fermer le popup des formes s'il est ouvert
    darkBgElements.classList.remove("active-selection-elements");
    surgirElements.classList.remove("active-selection-elements");
    
    // Fermer la palette de couleurs si elle est ouverte
    choixCouleur.classList.remove("activePalleteCouleur");
    
    // Ouvrir le popup de texte
    ouverturePopupMobile();
  } else {
    // Fermer le popup QR code s'il est ouvert
    darkBgQr.classList.remove("active-selection-qr");
    surgirQr.classList.remove("active-selection-qr");
    conteneur.classList.remove("active");

    // Ferme d'abord le popup des formes en version desktop si ouvert
    surgirElementsOrdi.classList.remove("active-selection-elements-ordi");

    // Fermer la palette de couleurs si elle est ouverte
    choixCouleur.classList.remove("activePalleteCouleur");
    document.querySelector(".canvas-wrapper").classList.remove("ajout-margin");

    // Puis ouvre le popup de texte
    ouverturePopupOrdinateur();
  }
});

// Fermeture du popup mobile via le bouton de fermeture
fermeBtn.addEventListener("click", () => {
  darkBg.classList.remove("active-selection");
  surgir.classList.remove("active-selection");
});

// Fermeture du popup desktop via son bouton de fermeture
document
  .querySelector(".surgir-ordi .fermeBtn")
  .addEventListener("click", () => {
    surgirOrdi.classList.remove("active-selection-ordi");
    document.querySelector(".canvas-wrapper").classList.remove("ajout-margin");
  });

// Fermeture du popup mobile si l'utilisateur clique sur le fond sombre
darkBg.addEventListener("click", () => {
  darkBg.classList.remove("active-selection"); // Cache le fond sombre
  surgir.classList.remove("active-selection"); // Cache le popup mobile
});

// Fermeture du popup desktop si l'utilisateur clique sur le body
document.body.addEventListener("click", function () {
  surgirOrdi.classList.remove("active-selection-ordi");
  document.querySelector(".canvas-wrapper").classList.remove("ajout-margin");
});

// ============================
// 4. Fonction d'ajout de texte simple selon son type (h1, h2, p)
// ============================

/**
 * Calcule la taille de police appropriée en fonction de la taille de l'écran et du type de texte
 * @param {string} type - Le type de texte ("h1", "h2", "p", etc.)
 * @param {number} baseSize - La taille de base pour un écran desktop
 * @returns {number} La taille de police ajustée
 */
function calculateFontSize(type, baseSize) {
  const screenWidth = window.innerWidth;
  const canvasWidth = canvas.width;
  let scale;

  // Calcul du facteur d'échelle basé sur la largeur du canvas
  if (screenWidth < 480) {
    // Pour les très petits écrans mobiles
    switch (type) {
      case 'h1':
        return Math.min(28, canvasWidth * 0.06); // Maximum 28px sur mobile
      case 'h2':
        return Math.min(22, canvasWidth * 0.045); // Maximum 22px sur mobile
      case 'p':
        return Math.min(16, canvasWidth * 0.035); // Maximum 16px sur mobile
      default:
        scale = 0.4;
    }
  } else if (screenWidth < 768) {
    // Pour les mobiles
    switch (type) {
      case 'h1':
        return Math.min(32, canvasWidth * 0.07); // Maximum 32px sur tablette
      case 'h2':
        return Math.min(26, canvasWidth * 0.055); // Maximum 26px sur tablette
      case 'p':
        return Math.min(18, canvasWidth * 0.04); // Maximum 18px sur tablette
      default:
        scale = 0.5;
    }
  } else if (screenWidth < 1024) {
    // Pour les tablettes
    switch (type) {
      case 'h1':
        return Math.min(38, canvasWidth * 0.08); // Maximum 38px sur tablette
      case 'h2':
        return Math.min(30, canvasWidth * 0.065); // Maximum 30px sur tablette
      case 'p':
        return Math.min(20, canvasWidth * 0.045); // Maximum 20px sur tablette
      default:
        scale = 0.7;
    }
  } else {
    // Pour les grands écrans
    switch (type) {
      case 'h1':
        return Math.min(48, canvasWidth * 0.1); // Maximum 48px sur desktop
      case 'h2':
        return Math.min(36, canvasWidth * 0.075); // Maximum 36px sur desktop
      case 'p':
        return Math.min(24, canvasWidth * 0.05); // Maximum 24px sur desktop
      default:
        scale = 1;
    }
  }

  // Pour les autres types de texte (polices personnalisées)
  return baseSize * scale;
}

/**
 * Ajoute un texte sur le canvas selon le type choisi.
 * @param {string} type - Le type de texte à ajouter ("h1", "h2", "p").
 */
function addText(type) {
  let textContent = ""; // Contenu du texte à ajouter
  let baseSize = 16; // Taille de police de base (avant ajustement)
  let fontWeight = "normal"; // Poids de police par défaut

  // Définition des propriétés selon le type de texte
  switch (type) {
    case "h1": // Titre principal
      textContent = "Ajouter un titre";
      baseSize = 48;
      fontWeight = "bold";
      break;
    case "h2": // Sous-titre
      textContent = "Ajouter un sous-titre";
      baseSize = 32;
      fontWeight = "bold";
      break;
    case "p": // Paragraphe
      textContent = "Ajouter des lignes dans le corps du texte";
      baseSize = 20;
      fontWeight = "normal";
      break;
  }

  // Calcul de la taille responsive
  const fontSize = calculateFontSize(type, baseSize);

  // Création de l'objet texte avec Fabric.js
  const text = new fabric.IText(textContent, {
    left: canvas.width / 4, // Position horizontale
    top: canvas.height / 4, // Position verticale
    fontFamily: "Arial", // Police par défaut
    fontSize: fontSize, // Taille de police ajustée
    fontWeight: fontWeight // Poids de police défini
  });

  // Ajout et sélection du texte sur le canvas
  canvas.add(text);
  canvas.setActiveObject(text);

  // Affichage des contrôles de texte
  document.getElementById("textControls").classList.add("active");

  // Rafraîchissement du canvas
  canvas.renderAll();

  // Fermeture du popup mobile après ajout du texte
  darkBg.classList.remove("active-selection");
  surgir.classList.remove("active-selection");
}

// ============================
// 5. Fonction d'ajout de texte avec police spécifique
// ============================

/**
 * Ajoute un texte sur le canvas en appliquant une police spécifique.
 * @param {string} combinaison - Le nom de la police à appliquer.
 */
function addPoliceCombinaison(combinaison) {
  let textContent = ""; // Contenu du texte
  let fontFamily = "Arial"; // Police par défaut
  let baseSize = 20; // Taille de base pour desktop

  // Définition des propriétés selon la police choisie
  switch (combinaison) {
    case "Roboto":
      textContent = "Texte en Roboto";
      fontFamily = "'Roboto', sans-serif";
      break;
    case "Playfair Display":
      textContent = "Texte en Playfair Display";
      fontFamily = "'Playfair Display', serif";
      break;
    case "Courier Prime":
      textContent = "Texte en Courier Prime";
      fontFamily = "'Courier Prime', monospace";
      break;
    case "Lobster":
      textContent = "Texte en Lobster";
      fontFamily = "'Lobster', cursive";
      break;
    case "Montserrat":
      textContent = "Texte en Montserrat";
      fontFamily = "'Montserrat', sans-serif";
      break;
    case "Pacifico":
      textContent = "Texte en Pacifico";
      fontFamily = "'Pacifico', cursive";
      break;
    case "Bebas Neue":
      textContent = "Texte en Bebas Neue";
      fontFamily = "'Bebas Neue', sans-serif";
      break;
    case "Merriweather":
      textContent = "Texte en Merriweather";
      fontFamily = "'Merriweather', serif";
      break;
    case "Press Start 2P":
      textContent = "Texte en Press Start 2P";
      baseSize = 16; // Réduction de la taille pour cette police plus large
      fontFamily = "'Press Start 2P', monospace";
      break;
    case "Oswald":
      textContent = "Texte en Oswald";
      fontFamily = "'Oswald', sans-serif";
      break;
    case "Cinzel":
      textContent = "Texte en Cinzel";
      fontFamily = "'Cinzel', serif";
      break;
    case "Dancing Script":
      textContent = "Texte en Dancing Script";
      baseSize = 24; // Augmentation de la taille pour cette police script
      fontFamily = "'Dancing Script', cursive";
      break;
    case "Fira Code":
      textContent = "Texte en Fira Code";
      fontFamily = "'Fira Code', monospace";
      break;
    case "Raleway":
      textContent = "Texte en Raleway";
      fontFamily = "'Raleway', sans-serif";
      break;
    case "Abril Fatface":
      textContent = "Texte en Abril Fatface";
      baseSize = 22; // Ajustement pour cette police plus large
      fontFamily = "'Abril Fatface', serif";
      break;
    case "Indie Flower":
      textContent = "Texte en Indie Flower";
      baseSize = 22; // Ajustement pour cette police manuscrite
      fontFamily = "'Indie Flower', cursive";
      break;
    case "Chakra Petch":
      textContent = "Texte en Chakra Petch";
      fontFamily = "'Chakra Petch', sans-serif";
      break;
    case "Caveat":
      textContent = "Texte en Caveat";
      baseSize = 24; // Ajustement pour cette police manuscrite
      fontFamily = "'Caveat', cursive";
      break;
    case "Space Mono":
      textContent = "Texte en Space Mono";
      fontFamily = "'Space Mono', monospace";
      break;
    case "Great Vibes":
      textContent = "Texte en Great Vibes";
      baseSize = 26; // Ajustement pour cette police calligraphique
      fontFamily = "'Great Vibes', cursive";
      break;
    default:
      textContent = "Texte par défaut";
      fontFamily = "Arial";
      break;
  }

  // Calcul de la taille responsive
  const fontSize = calculateFontSize("police", baseSize);

  // Création de l'objet texte avec Fabric.js
  const text = new fabric.IText(textContent, {
    left: canvas.width / 4, // Position horizontale
    top: canvas.height / 4, // Position verticale
    fontSize: fontSize, // Taille de police ajustée
    fontFamily: fontFamily // Police choisie
  });

  // Ajout et sélection du texte sur le canvas
  canvas.add(text);
  canvas.setActiveObject(text);

  // Affichage des contrôles de texte
  document.getElementById("textControls").classList.add("active");

  // Rafraîchissement du canvas
  canvas.renderAll();

  // Fermeture du popup mobile après ajout du texte
  darkBg.classList.remove("active-selection");
  surgir.classList.remove("active-selection");
}

// ============================
// 6. Gestion de la responsivité lors du redimensionnement de la fenêtre
// ============================
window.addEventListener("resize", function () {
  // Mise à jour des textes existants lors du redimensionnement
  canvas.getObjects().forEach((obj) => {
    if (obj.type === "i-text" || obj.type === "text") {
      // Ajustez la taille en fonction du type de texte (si l'information est disponible)
      let baseSize = 20; // Taille par défaut

      // Détection approximative du type basée sur le style
      if (obj.get("fontWeight") === "bold") {
        if (obj.get("fontSize") > 30) {
          baseSize = 48; // Probablement un h1
        } else {
          baseSize = 32; // Probablement un h2
        }
      }

      // Calcul et application de la nouvelle taille
      const newSize = calculateFontSize("resize", baseSize);
      obj.set("fontSize", newSize);
    }
  });

  canvas.renderAll();
});

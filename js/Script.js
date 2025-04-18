// Initialisation des éléments
const textControls = document.getElementById("textControls"); // Récupère le panneau de contrôle de texte
const fontSize = document.getElementById("fontSize");
const fontFamily = document.getElementById("fontFamily");
const ouverturePalletteCouleur = document.getElementById(
  "ouverturePalletteCouleur"
);
const choixCouleur = document.querySelector(".choix-couleur");
const canvasPrincipal = document.getElementById("canvasPrincipal");
const barreTeinte = document.getElementById("barreTeinte");
const curseurPrincipal = document.getElementById("curseurPrincipal");
const curseurTeinte = document.getElementById("curseurTeinte");
const apercuCouleur = document.getElementById("apercuCouleur");
const valeurHex = document.getElementById("valeurHex");

function initCanvas() {
  // Obtenir la largeur et la hauteur de l'écran
  const containerWidth = window.innerWidth; // Largeur de l'écran
  const containerHeight = window.innerHeight; // Hauteur de l'écran

  // Définition des dimensions maximales du canvas avec un ratio A4 en paysage (297 x 210 mm)
  let canvasWidth = Math.min(containerWidth - 40, 842); // Largeur maximale du canvas (842px pour A4 paysage)
  let canvasHeight = canvasWidth * (210 / 297); // Hauteur proportionnelle pour garder le ratio A4 en paysage

  // Ajustement de la hauteur si elle dépasse l'espace disponible
  if (canvasHeight > containerHeight - 150) {
    // Si la hauteur est trop grande pour l'écran
    canvasHeight = containerHeight - 150; // On réduit la hauteur (en laissant de l'espace pour les boutons)
    canvasWidth = canvasHeight * (297 / 210); // On ajuste la largeur pour garder le ratio A4 en paysage
  }

  // Création du canvas avec Fabric.js
  window.canvas = new fabric.Canvas("canvas", {
    width: canvasWidth, // Largeur calculée
    height: canvasHeight, // Hauteur calculée
    backgroundColor: "white", // Fond blanc
    selection: true, // Permet de sélectionner les objets (rectangles, cercles, etc.)
    preserveObjectStacking: true, // Garde l'ordre des objets quand on les sélectionne
    centeredScaling: true, // Permet de redimensionner les objets à partir du centre
    enableRetinaScaling: true, // Améliore la qualité sur les écrans Retina (comme ceux des iPhones)
    stopContextMenu: true, // Désactive le menu contextuel au clic droit (pour éviter des actions non voulues)
  });

  // Configuration par défaut des objets dessinés sur le canvas
  fabric.Object.prototype.set({
    transparentCorners: false, // Coins visibles lors de la sélection (pas transparents)
    borderColor: "#2B5797", // Couleur des bordures des objets sélectionnés (bleu)
    cornerColor: "#2B5797", // Couleur des coins pour redimensionner (bleu)
    cornerSize: 12, // Taille des coins de redimensionnement
    padding: 5, // Espace autour des objets sélectionnés
    cornerStyle: "circle", // Coins arrondis pour le redimensionnement
    hasControls: true, // Active les contrôles pour redimensionner/faire pivoter
    hasBorders: true, // Affiche les bordures lors de la sélection
  });

  // Fonction de mise à jour des contrôles de texte
  function updateTextControls() {
    const activeObject = canvas.getActiveObject(); // Récupère l'objet actuellement sélectionné

    // Vérifie si un objet est sélectionné et si c'est un objet texte
    if (
      activeObject &&
      (activeObject.type === "i-text" || activeObject.type === "text")
    ) {
      textControls.classList.add("active"); // Affiche le panneau de contrôle
      fontFamily.value = activeObject.fontFamily; // Met à jour la police
      fontSize.value = activeObject.fontSize; // Met à jour la taille de police
    } else {
      textControls.classList.remove("active"); // Cache le panneau de contrôle
    }
  }

  // Ajoute des écouteurs d'événements pour mettre à jour les contrôles de texte
  canvas.on("selection:created", updateTextControls); // Quand un objet est sélectionné
  canvas.on("selection:updated", updateTextControls); // Quand la sélection change
  canvas.on("selection:cleared", updateTextControls); // Quand rien n'est sélectionné
  canvas.on("mouse:down", updateTextControls); // Au clic de souris
  canvas.on("touch:gesture", updateTextControls); // Au toucher (mobile)

  // Gestion de l'édition du texte
  // Quand on commence à éditer un texte
  canvas.on("text:editing:entered", function (e) {
    textControls.classList.add("active"); // Affiche les contrôles de texte

    // Petit délai pour éviter des problèmes d'affichage avec le clavier virtuel
    setTimeout(() => {
      const activeObject = canvas.getActiveObject();
      if (activeObject) {
        canvas.setZoom(canvas.getZoom()); // Maintient le zoom
        canvas.renderAll(); // Redessine le canvas
      }
    }, 300);
  });

  // Quand on finit d'éditer un texte
  canvas.on("text:editing:exited", function (e) {
    // Petit délai pour revenir en haut de la page
    setTimeout(() => {
      window.scrollTo(0, 0);
    }, 100);
  });

  return canvas; // Retourne le canvas initialisé
}

// Variables pour le sélecteur de couleur
let teinteCourante = 0;
let estEnTrainDeDessiner = false;
let contextePrincipal, contexteTeinte;
let couleurActuelle = "#ff0000";

function initialiserChoixCouleurCanvas() {
  // Dimensions du canvas principal
  canvasPrincipal.width = canvasPrincipal.offsetWidth;
  canvasPrincipal.height = canvasPrincipal.offsetHeight;
  contextePrincipal = canvasPrincipal.getContext("2d");

  // Dimensions de la barre de teinte
  barreTeinte.width = barreTeinte.offsetWidth;
  barreTeinte.height = barreTeinte.offsetHeight;
  contexteTeinte = barreTeinte.getContext("2d");

  dessinerBarreTeinte();
  dessinerCanvasPrincipal();
}

function dessinerBarreTeinte() {
  const gradient = contexteTeinte.createLinearGradient(
    0,
    0,
    0,
    barreTeinte.height
  );
  for (let i = 0; i <= 360; i++) {
    gradient.addColorStop(i / 360, `hsl(${i}, 100%, 50%)`);
  }
  contexteTeinte.fillStyle = gradient;
  contexteTeinte.fillRect(0, 0, barreTeinte.width, barreTeinte.height);
}

function dessinerCanvasPrincipal() {
  const gradientBlanc = contextePrincipal.createLinearGradient(
    0,
    0,
    canvasPrincipal.width,
    0
  );
  gradientBlanc.addColorStop(0, "#fff");
  gradientBlanc.addColorStop(1, `hsl(${teinteCourante}, 100%, 50%)`);
  contextePrincipal.fillStyle = gradientBlanc;
  contextePrincipal.fillRect(
    0,
    0,
    canvasPrincipal.width,
    canvasPrincipal.height
  );

  const gradientNoir = contextePrincipal.createLinearGradient(
    0,
    0,
    0,
    canvasPrincipal.height
  );
  gradientNoir.addColorStop(0, "rgba(0,0,0,0)");
  gradientNoir.addColorStop(1, "#000");
  contextePrincipal.fillStyle = gradientNoir;
  contextePrincipal.fillRect(
    0,
    0,
    canvasPrincipal.width,
    canvasPrincipal.height
  );
}

function appliquerCouleur(couleur) {
  const objetActif = canvas.getActiveObject();
  if (objetActif) {
    if (objetActif.type === "i-text" || objetActif.type === "text") {
      objetActif.set("fill", couleur);
    } else {
      objetActif.set("fill", couleur);
    }
    canvas.renderAll();
  } else {
    canvas.setBackgroundColor(couleur, canvas.renderAll.bind(canvas));
  }
}

function mettreAJourCouleur(x, y) {
  if (x < 0) x = 0;
  if (y < 0) y = 0;
  if (x > canvasPrincipal.width) x = canvasPrincipal.width;
  if (y > canvasPrincipal.height) y = canvasPrincipal.height;

  const pixel = contextePrincipal.getImageData(x, y, 1, 1).data;
  const [r, g, b] = pixel;
  const hex = `#${r.toString(16).padStart(2, "0")}${g
    .toString(16)
    .padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;

  couleurActuelle = hex;
  apercuCouleur.style.backgroundColor = hex;
  valeurHex.textContent = hex.toUpperCase();
  appliquerCouleur(hex);

  // Position du curseur relative au conteneur du canvas principal
  curseurPrincipal.style.left = `${x}px`;
  curseurPrincipal.style.top = `${y}px`;
}

// Gestionnaires d'événements tactiles pour le canvas principal
canvasPrincipal.addEventListener("touchstart", (e) => {
  e.preventDefault();
  estEnTrainDeDessiner = true;
  const touch = e.touches[0];
  const rect = canvasPrincipal.getBoundingClientRect();
  const x = touch.clientX - rect.left;
  const y = touch.clientY - rect.top;
  mettreAJourCouleur(x, y);
});

canvasPrincipal.addEventListener("touchmove", (e) => {
  e.preventDefault();
  if (!estEnTrainDeDessiner) return;
  const touch = e.touches[0];
  const rect = canvasPrincipal.getBoundingClientRect();
  const x = touch.clientX - rect.left;
  const y = touch.clientY - rect.top;
  mettreAJourCouleur(x, y);
});

barreTeinte.addEventListener("touchstart", (e) => {
  e.preventDefault();
  const touch = e.touches[0];
  const rect = barreTeinte.getBoundingClientRect();
  const y = Math.max(0, Math.min(barreTeinte.height, touch.clientY - rect.top));
  teinteCourante = (y / barreTeinte.height) * 360;

  // Position du curseur relative au conteneur de la barre de teinte
  curseurTeinte.style.left = "50%";
  curseurTeinte.style.top = `${y}px`;

  dessinerCanvasPrincipal();
});

barreTeinte.addEventListener("touchmove", (e) => {
  e.preventDefault();
  const touch = e.touches[0];
  const rect = barreTeinte.getBoundingClientRect();
  const y = Math.max(0, Math.min(barreTeinte.height, touch.clientY - rect.top));
  teinteCourante = (y / barreTeinte.height) * 360;

  curseurTeinte.style.left = "50%";
  curseurTeinte.style.top = `${y}px`;

  dessinerCanvasPrincipal();
});

document.addEventListener("touchend", () => {
  estEnTrainDeDessiner = false;
});

// Gestionnaires d'événements souris pour le canvas principal
canvasPrincipal.addEventListener("mousedown", (e) => {
  estEnTrainDeDessiner = true;
  const rect = canvasPrincipal.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  mettreAJourCouleur(x, y);
});

canvasPrincipal.addEventListener("mousemove", (e) => {
  if (!estEnTrainDeDessiner) return;
  const rect = canvasPrincipal.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  mettreAJourCouleur(x, y);
});

// Gestionnaires d'événements souris pour la barre de teinte
barreTeinte.addEventListener("mousedown", (e) => {
  const rect = barreTeinte.getBoundingClientRect();
  const y = Math.max(0, Math.min(barreTeinte.height, e.clientY - rect.top));
  teinteCourante = (y / barreTeinte.height) * 360;

  curseurTeinte.style.left = "50%";
  curseurTeinte.style.top = `${y}px`;

  dessinerCanvasPrincipal();
});

barreTeinte.addEventListener("mousemove", (e) => {
  if (!e.buttons) return; // Vérifie si un bouton de souris est enfoncé
  const rect = barreTeinte.getBoundingClientRect();
  const y = Math.max(0, Math.min(barreTeinte.height, e.clientY - rect.top));
  teinteCourante = (y / barreTeinte.height) * 360;

  curseurTeinte.style.left = "50%";
  curseurTeinte.style.top = `${y}px`;

  dessinerCanvasPrincipal();
});

// Ajouter mouseup à l'écouteur d'événements du document
document.addEventListener("mouseup", () => {
  estEnTrainDeDessiner = false;
});

// Initialisation du canvas
var canvas = initCanvas();

// Gestion de l'ouverture de la palette de couleurs
ouverturePalletteCouleur.addEventListener("click", (event) => {
  event.stopPropagation();

  // Fermer le popup QR code s'il est ouvert
  darkBgQr.classList.remove("active-selection-qr");
  surgirQr.classList.remove("active-selection-qr");
  conteneur.classList.remove("active");

  // Fermer le popup des formes s'il est ouvert
  darkBgElements.classList.remove("active-selection-elements");
  surgirElements.classList.remove("active-selection-elements");
  surgirElementsOrdi.classList.remove("active-selection-elements-ordi");

  // Fermer le popup de texte s'il est ouvert
  darkBg.classList.remove("active-selection");
  surgir.classList.remove("active-selection");
  surgirOrdi.classList.remove("active-selection-ordi");

  // Ouvrir la palette de couleur avec animation
  choixCouleur.classList.add("activePalleteCouleur");
  
  // Si on est sur desktop (>= 1024px), on déplace le canvas
  if (window.matchMedia("(min-width: 1024px)").matches) {
    document.querySelector(".canvas-wrapper").classList.add("ajout-margin");
  }
  
  // Initialiser les canvas après l'affichage
  setTimeout(() => {
    initialiserChoixCouleurCanvas();
  }, 50);
});

// Ferme la palette si le clic ne vient ni de la palette ni du bouton d'ouverture
document.addEventListener("click", (event) => {
  if (
    choixCouleur.contains(event.target) ||
    ouverturePalletteCouleur.contains(event.target) ||
    event.target.closest(".palletteReste")
  ) {
    return;
  }
  // Sinon, on retire la classe qui affiche la palette et on retire la marge du canvas
  choixCouleur.classList.remove("activePalleteCouleur");
  document.querySelector(".canvas-wrapper").classList.remove("ajout-margin");
});

// Fonction pour supprimer l'objet sélectionné
function deleteSelected() {
  const activeObject = canvas.getActiveObject(); // Objet actuellement sélectionné
  if (activeObject) {
    // Si un objet est sélectionné
    canvas.remove(activeObject); // Supprimer l'objet
    textControls.classList.remove("active"); // Cacher les contrôles de texte
    canvas.renderAll(); // Redessiner le canvas
  }
}

// Fonction pour copier l'objet sélectionné
function copyObject() {
  var activeObject = canvas.getActiveObject();
  if (activeObject) {
    activeObject.clone(function (cloned) {
      cloned.set({
        left: cloned.left + 20,
        top: cloned.top + 20,
      });
      canvas.add(cloned);
      canvas.renderAll();
    });
  }
}

// Fonctions de contrôle du texte
// Mettre à jour le style du texte (police, taille, etc.)
function updateTextStyle(property) {
  let activeObject = canvas.getActiveObject();
  if (
    activeObject &&
    (activeObject.type === "i-text" || activeObject.type === "text")
  ) {
    let value = document.getElementById(property).value; // Récupère la valeur du contrôle
    activeObject.set(property, value); // Applique la valeur à l'objet
    canvas.renderAll(); // Redessine le canvas
  }
}

// Basculer le texte en gras
function toggleBold() {
  let activeObject = canvas.getActiveObject();
  if (
    activeObject &&
    (activeObject.type === "i-text" || activeObject.type === "text")
  ) {
    // Si le texte est déjà en gras, le passe en normal, sinon le passe en gras
    activeObject.set(
      "fontWeight",
      activeObject.fontWeight === "bold" ? "normal" : "bold"
    );
    canvas.renderAll(); // Redessine le canvas
  }
}

// Basculer le texte en italique
function toggleItalic() {
  let activeObject = canvas.getActiveObject();
  if (
    activeObject &&
    (activeObject.type === "i-text" || activeObject.type === "text")
  ) {
    // Si le texte est déjà en italique, le passe en normal, sinon le passe en italique
    activeObject.set(
      "fontStyle",
      activeObject.fontStyle === "italic" ? "normal" : "italic"
    );
    canvas.renderAll(); // Redessine le canvas
  }
}

function exportFabricCanvasToPDF() {
  // Récupérer jsPDF depuis window.jspdf
  const { jsPDF } = window.jspdf;

  // Définir un multiplicateur pour augmenter la résolution (par exemple, 3)
  const multiplier = 5;

  // Récupérer l'image du canvas Fabric.js en haute résolution
  const imgData = canvas.toDataURL({
    format: "png",
    quality: 1.0,
    multiplier: multiplier,
  });

  // Créer un PDF en format paysage avec des dimensions identiques à celles du canvas
  const pdf = new jsPDF("landscape", "px", [canvas.width, canvas.height]);

  // Ajouter l'image au PDF en redimensionnant à la taille d'affichage du canvas
  pdf.addImage(imgData, "PNG", 0, 0, canvas.width, canvas.height);

  // Sauvegarder le PDF
  pdf.save("travaille_Generateur.pdf");
}

// Gestion du redimensionnement
// Variable pour gérer un délai avant de redimensionner
let resizeTimeout;
// Écoute l'événement de redimensionnement de la fenêtre
window.addEventListener("resize", function () {
  clearTimeout(resizeTimeout); // Annule le délai précédent

  // Attend 250ms avant de redimensionner pour éviter trop de calculs
  resizeTimeout = setTimeout(function () {
    var json = canvas.toJSON(); // Sauvegarde l'état actuel du canvas
    canvas.dispose(); // Supprime l'ancien canvas
    canvas = initCanvas(); // Réinitialise le canvas avec les nouvelles dimensions

    // Recharge les objets précédents
    canvas.loadFromJSON(json, function () {
      canvas.renderAll(); // Redessine le canvas
    });
  }, 250); // Délai pour éviter des mises à jour trop fréquentes
});

// qrcode.js - Fonctionnalités de génération de QR code et d'ajout au canvas

// Initialisation des éléments du formulaire
const conteneur = document.querySelector(".conteneur");
const typeContenu = document.getElementById("typeContenu");
const contenu = document.getElementById("contenu");
const couleurQR = document.getElementById("couleurQR");
const couleurFond = document.getElementById("couleurFond");
const boutonGenerer = document.getElementById("boutonGenerer");
const qrcodeGeneer = document.getElementById("qrcodeGeneer");
const darkBgQr = document.querySelector(".dark_bg-qr");
const surgirQr = document.querySelector(".surgir-qr");
const fermeBtnQr = document.querySelector(".fermeBtn-qr");

// Ouvrir le popup QR code
qrcodeGeneer.addEventListener("click", (e) => {
  e.stopPropagation();
  // Fermer la palette de couleurs si elle est ouverte
  choixCouleur.classList.remove("activePalleteCouleur");
  document.querySelector(".canvas-wrapper").classList.remove("ajout-margin");

  // Fermer le popup de texte s'il est ouvert
  darkBg.classList.remove("active-selection");
  surgir.classList.remove("active-selection");
  surgirOrdi.classList.remove("active-selection-ordi");

  // Fermer le popup des formes s'il est ouvert
  darkBgElements.classList.remove("active-selection-elements");
  surgirElements.classList.remove("active-selection-elements");
  surgirElementsOrdi.classList.remove("active-selection-elements-ordi");

  // Ouvrir le popup QR code avec le déplacement du canvas uniquement sur desktop
  darkBgQr.classList.add("active-selection-qr");
  surgirQr.classList.add("active-selection-qr");
  conteneur.classList.add("active");
  
  // Ajouter la marge uniquement sur desktop
  if (window.matchMedia("(min-width: 1024px)").matches) {
    document.querySelector(".canvas-wrapper").classList.add("ajout-margin");
  }
});

// Fermer le popup QR code avec le bouton de fermeture
fermeBtnQr.addEventListener("click", () => {
  darkBgQr.classList.remove("active-selection-qr");
  surgirQr.classList.remove("active-selection-qr");
  conteneur.classList.remove("active");
  document.querySelector(".canvas-wrapper").classList.remove("ajout-margin");
});

// Fermer le popup si clic sur le fond noir
darkBgQr.addEventListener("click", (e) => {
  if (e.target === darkBgQr) {
    darkBgQr.classList.remove("active-selection-qr");
    surgirQr.classList.remove("active-selection-qr");
    conteneur.classList.remove("active");
    document.querySelector(".canvas-wrapper").classList.remove("ajout-margin");
  }
});

// Préfixes pour les réseaux sociaux
const prefixes = {
  url: "",
  facebook: "https://facebook.com/",
  twitter: "https://twitter.com/",
  instagram: "https://instagram.com/",
  linkedin: "https://linkedin.com/in/",
  texte: "",
};

// Met à jour le placeholder du champ de contenu en fonction du type sélectionné
typeContenu.addEventListener("change", function () {
  let type = typeContenu.value;

  switch (type) {
    case "url":
      contenu.placeholder =
        "Entrez l'URL complète (ex: https://www.exemple.com)";
      break;
    case "facebook":
      contenu.placeholder = "Entrez votre nom d'utilisateur Facebook";
      break;
    case "twitter":
      contenu.placeholder = "Entrez votre nom d'utilisateur Twitter (sans @)";
      break;
    case "instagram":
      contenu.placeholder = "Entrez votre nom d'utilisateur Instagram";
      break;
    case "linkedin":
      contenu.placeholder = "Entrez votre nom d'utilisateur LinkedIn";
      break;
    case "texte":
      contenu.placeholder = "Entrez votre texte";
      break;
  }
});

// Fonction pour générer le QR code
function genererQRCode() {
  // Vérification que le contenu n'est pas vide
  if (!contenu.value.trim()) {
    alert("Veuillez entrer un contenu pour votre QR code");
    return;
  }

  // Création du contenu final avec préfixe si nécessaire
  const type = typeContenu.value;
  const prefix = prefixes[type];
  const contenuFinal =
    type !== "url" && type !== "texte" ? prefix + contenu.value : contenu.value;

  // Si c'est une URL et que le contenu ne commence pas par http:// ou https://
  if (type === "url" && !contenu.value.match(/^https?:\/\//)) {
    contenuFinal = "https://" + contenu.value;
  }

  // Création d'un élément div temporaire pour le QR code
  const qrCodeTemporaire = document.createElement("div");
  qrCodeTemporaire.id = "qrCodeTemporaire";
  qrCodeTemporaire.style.display = "none";
  document.body.appendChild(qrCodeTemporaire);

  // Génération du QR code avec la bibliothèque QRCode.js
  new QRCode(qrCodeTemporaire, {
    text: contenuFinal,
    width: 256,
    height: 256,
    colorDark: couleurQR.value,
    colorLight: couleurFond.value,
    correctLevel: QRCode.CorrectLevel.H,
  });

  // Délai pour permettre au QR Code de se générer
  setTimeout(() => {
    // Récupération de l'image générée
    const qrImage = qrCodeTemporaire.querySelector("img");

    if (qrImage) {
      // Ajout de l'image au canvas
      ajouterQRCodeAuCanvas(qrImage.src);

      // Nettoyage du div temporaire
      document.body.removeChild(qrCodeTemporaire);
    } else {
      alert("Erreur lors de la génération du QR code");
      document.body.removeChild(qrCodeTemporaire);
    }
  }, 200);
}

// Fonction pour ajouter le QR code au canvas Fabric.js
function ajouterQRCodeAuCanvas(imgSrc) {
  fabric.Image.fromURL(imgSrc, function (img) {
    // Dimensionnement initial du QR code (environ 25% de la largeur du canvas)
    const targetWidth = canvas.width * 0.25;
    const scale = targetWidth / img.width;

    // Application du redimensionnement
    img.set({
      left: canvas.width * 0.5 - (img.width * scale) / 2, // Centrage horizontal
      top: canvas.height * 0.5 - (img.height * scale) / 2, // Centrage vertical
      scaleX: scale,
      scaleY: scale,
      cornerSize: 12,
      cornerColor: "#2B5797",
      borderColor: "#2B5797",
      cornerStyle: "circle",
      transparentCorners: false,
      objectCaching: false, // Améliore la qualité du rendu lors du redimensionnement
      name: "qrcode", // Attribut pour identifier les QR codes
    });

    // Ajout de l'image au canvas
    canvas.add(img);

    // Sélection de l'image nouvellement ajoutée
    canvas.setActiveObject(img);

    // Rafraîchissement du canvas
    canvas.renderAll();

    // Fermer le popup QR code
    darkBgQr.classList.remove("active-selection-qr");
    surgirQr.classList.remove("active-selection-qr");
    conteneur.classList.remove("active");

    // Nettoyer les inputs
    contenu.value = "";
    typeContenu.selectedIndex = 0;
    couleurQR.value = "#000000";
    couleurFond.value = "#ffffff";

    // Message de succès
    console.log("QR code ajouté au canvas avec succès");
  });
}

// Écouteur d'événement pour le bouton de génération
boutonGenerer.addEventListener("click", genererQRCode);

// Exporte les fonctions pour les rendre disponibles dans le fichier principal
window.qrGenerator = {
  genererQRCode,
  ajouterQRCodeAuCanvas,
};

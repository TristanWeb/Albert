"use strict";

console.clear();

// Info taille figma pour calcul responsive
const figmaW = 1080;
const figmaH = 1080;


// import font
//titre
const policeTitre = new FontFace('KH Interference', 'url(font/KHInterferenceTRIAL-Bold.otf)');
policeTitre.load().then(function (font) {
  document.fonts.add(font);
});
//texte
const policeTexte = new FontFace('PP Fraktion', 'url(font/PPFraktionMono-Bold.otf)');
policeTexte.load().then(function (font) {
  document.fonts.add(font);
});



// STARTAPP, ici je charge les images et je fais un préchargements des items à aller chercher 
// dans les tableaux, pour éviter les find() dans la boucle animate
// boucle pour charger chaque img sources, lance draw() dès que les images sont chargées
//déclaration de toutes les variables pour pas qu'elles soient bloqué dans startApp
let plug1, plug2, plug3, init, btnScreen1, btnScreen2;
let lightScreen1, lightScreen2, initLight, lightPlug1, lightPlug2, lightPlug3, lightSlider1, lightSlider2, lightSlider3;
let sliderDeg1, sliderDeg2, sliderDeg3;
let eyeGauche, eyeDroite;
let waitingScreen1, waitingScreen2;

const startApp = () => {

  canvasSetup();

  myEyes.forEach(eye => {
    if (eye.id === 'gauche') {
      eyeGauche = eye;
    }
    else if (eye.id === 'droite') {
      eyeDroite = eye;
    }
  });

  myButtons.forEach(button => {
    if (button.id === "plug1") {
      plug1 = button;
    } else if (button.id === "plug2") {
      plug2 = button;
    } else if (button.id === "plug3") {
      plug3 = button;
    } else if (button.id === "init") {
      init = button;
    } else if (button.id === "screen1") {
      btnScreen1 = button;
    } else if (button.id === "screen2") {
      btnScreen2 = button;
    };
  });


  myLights.forEach(light => {
    if (light.id === 'lightScreen1') {
      lightScreen1 = light;
    } else if (light.id === 'lightScreen2') {
      lightScreen2 = light;
    } else if (light.id === 'lightInit') {
      initLight = light;
    } else if (light.id === 'lightPlug1') {
      lightPlug1 = light;
    } else if (light.id === 'lightPlug2') {
      lightPlug2 = light;
    } else if (light.id === 'lightPlug3') {
      lightPlug3 = light;
    } else if (light.id === 'lightSlider1') {
      lightSlider1 = light;
    } else if (light.id === 'lightSlider2') {
      lightSlider2 = light;
    } else if (light.id === 'lightSlider3') {
      lightSlider3 = light;
    };
  });


  myRotativeButton.forEach(buttonRotate => {
    if (buttonRotate.id === 'slider1') {
      sliderDeg1 = buttonRotate;
    } else if (buttonRotate.id === 'slider2') {
      sliderDeg2 = buttonRotate;
    } else if (buttonRotate.id === 'slider3') {
      sliderDeg3 = buttonRotate;
    };
  });
  //constructor(texte,minX,maxX,minY,maxY)
  waitingScreen1 = new WaitingScreen("BTM", 79, 400, 72, 406);
  waitingScreen2 = new WaitingScreen("BTM", 642, 983, 602, 1003);
  animate()
};

// -- TOOLBOX
// fonction Lerp translation 
const lerp = (debut, fin, vitesse) => {
  return debut + (fin - debut) * vitesse;
};
// Génère un nombre aléatoire en un maximum et un minimum
const rand = (max = 1, min = 0, round = false) => {
  const n = Math.random() * (max - min) + min;
  return round ? Math.round(n) : n;
};

const getRandomElement = (array) => {
  const randomIndex = Math.floor(Math.random() * array.length);
  return array[randomIndex];
};

// Retourne des radians en degrés
const radToDeg = (rad) => {
  return rad * (180 / Math.PI);
}

// Retourne des degrés en radians
const degToRad = (deg) => {
  return deg * (Math.PI / 180);
}
/*
  degToRad( 360 ); // retourne 6.28318531
  degToRad( 180 ); // retourne 3.14159265
  degToRad( 90 );  // retourne 1.57079633
  degToRad( 45 );  // retourne 0.78539816
*/
// -- SETTINGS
const wrapper = document.querySelector('.canvas__wrapper'),
  dpr = Math.min(window.devicePixelRatio, 2),
  canvas = document.createElement('canvas'),
  ctx = canvas.getContext('2d');


let wrapperWidth = figmaW,
  wrapperHeight = figmaH,
  w = Math.round(wrapperWidth),
  h = Math.round(wrapperHeight);

wrapper.append(canvas);

// -- EXTENSION(S)
const circle = (x, y, radius) => {
  return ctx.arc(x, y, radius, 0, 2 * Math.PI);
};

// -- CANVAS SETUP
const canvasSetup = () => {
  wrapperWidth = figmaW;
  wrapperHeight = figmaH;
  w = Math.round(wrapperWidth);
  h = Math.round(wrapperHeight);

  canvas.width = w * dpr;
  canvas.height = h * dpr;

  ctx.scale(dpr, dpr);
};

// -- Vos variables / fonctions 

// chargement des images

const imageSources = {
  // bg
  bg: "img/bg.png",
  //petit bouton rond 
  btnOff: "img/btn_off.svg",
  //petit bouton rond activé (revient direct en off après click)
  btnOn: "img/btn_on.svg",
  // bouton d'initialisation
  lBtnOff: "img/largeBtn_off.png",
  lBtnOn: "img/largeBtn_on.png",
  // Bouton activable (type ampli guitare (restent activé une fois baissé, possibilité de le désactiver en appuyant une seconde fois))
  checkOff: "img/checkOff.svg",
  checkOn: "img/checkOn.svg",
  //Light sans off/on = sans lumières
  lightS: "img/lightS.svg",
  lightM: "img/lightM.svg",
  lightL: "img/lightL.svg",
  // light off = rouge
  // light on = vert
  lightSOff: "img/lightS_OFF.svg",
  lightSOn: "img/lightS_On.svg",
  lightMOff: "img/lightM_Off.svg",
  lightMOn: "img/lightM_On.svg",
  lightLOff: "img/lightL_Off.svg",
  //slider
  slider: "img/faderSlider.svg",
  //btn tournant
  btnSlider: "img/sliderOff.png",
}

// assets pour draw
const assets = {};

// Comparaison d'images à charger et images chargées.
let imageLoaded = 0;

// récupération du nombres d'items dans l'objet imageSources sous forme de liste et récupère sa longueur
let totalImages = Object.keys(imageSources).length;


//créations de class pour les buttons
//This = reprendre l'info de quand l'item a été créer

class ButtonRotate {
  constructor(x, y, width, height, nomImage, buttonDeg, id) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.nomImage = nomImage;
    this.buttonDeg = buttonDeg;
    this.isDragging = false;
    this.id = id;
  }

  draw(ctx, assets, currentW, currentH) {
    let imageToDraw = assets[this.nomImage];

    // calculs pour responsive
    const scaleX = currentW / figmaW;
    const scaleY = currentH / figmaH;

    const responsiveX = this.x * scaleX;
    const responsiveY = this.y * scaleY;
    const responsiveWidth = this.width * scaleX;
    const responsiveHeight = this.height * scaleY;

    // centre du bouton pour calculer les degrés
    const centreX = responsiveX + (responsiveWidth / 2);
    const centreY = responsiveY + (responsiveHeight / 2);

    //sauvegarde du canva avant changement
    ctx.save()
    // on met le centre de rotation au centre du bouton
    ctx.translate(centreX, centreY);

    ctx.rotate(degToRad(this.buttonDeg));
    ctx.drawImage(imageToDraw, -responsiveWidth / 2, -responsiveHeight / 2, responsiveWidth, responsiveHeight);

    ctx.restore();
  }

  isClicked(sourisX, sourisY) {
    // vérifie si la souris est dans les coordonées
    let touchX = sourisX >= this.x && sourisX <= this.x + this.width;
    let touchY = sourisY >= this.y && sourisY <= this.y + this.height;

    // Si les 2 sont vrai ça retourne vrai => intéragit avec le bouton à la même place que le click
    if (touchX && touchY) {
      return true;
    } else {
      return false;
    }
  }
};

class WaitingScreen {
  constructor(texte, minX, maxX, minY, maxY) {
    this.texte = texte;
    this.minX = minX;
    this.maxX = maxX;
    this.minY = minY;
    this.maxY = maxY;

    // calcul du centre des écrans

    this.x = minX + (maxX - minX) / 2;
    this.y = minY + (maxY - minY) / 2;

    // texte qui bouge
    this.tailleTexte = 42;
    this.vitesseX = 1;
    this.vitesseY = 1;

  }
  update(ctx, scaleX) {
    this.x += this.vitesseX
    this.y += this.vitesseY

    ctx.font = Math.round(this.tailleTexte * scaleX) + "px 'KH Interference' ";
    let textBox = ctx.measureText(this.texte).width / scaleX;

    if (this.x <= this.minX || this.x + textBox >= this.maxX) {
      this.vitesseX *= -1;
    }
    if (this.y - this.tailleTexte <= this.minY || this.y + textBox >= this.maxY) {
      this.vitesseY *= -1;
    }
  }

  draw(ctx, currentW, currentH) {
    const scaleX = currentW / figmaW;
    const scaleY = currentH / figmaH;

    //css du texte

    ctx.fillStyle = "#ffffff"
    ctx.font = Math.round(this.tailleTexte * scaleX) + "px 'KH Interference' ";
    ctx.fillText(this.texte, this.x * scaleX, this.y * scaleY);
  }
}

class Button {
  constructor(x, y, width, height, nomImageOff, nomImageOn, etatInitial, id) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.nomImageOff = nomImageOff;
    this.nomImageOn = nomImageOn;
    this.state = etatInitial;
    this.id = id;
    this.sended = false;
  }



  draw(ctx, assets, currentW, currentH) {
    let imageToDraw;

    if (this.state === "on") {
      imageToDraw = assets[this.nomImageOn];
    } else {
      imageToDraw = assets[this.nomImageOff];
    }


    // calculs pour responsive
    const scaleX = currentW / figmaW;
    const scaleY = currentH / figmaH;

    const responsiveX = this.x * scaleX;
    const responsiveY = this.y * scaleY;
    const responsiveWidth = this.width * scaleX;
    const responsiveHeight = this.height * scaleY;

    // On dessine avec les valeurs recalculées
    ctx.drawImage(imageToDraw, responsiveX, responsiveY, responsiveWidth, responsiveHeight);
  }
  isClicked(sourisX, sourisY) {
    // vérifie si la souris est dans les coordonées
    let touchX = sourisX >= this.x && sourisX <= this.x + this.width;
    let touchY = sourisY >= this.y && sourisY <= this.y + this.height;

    // Si les 2 sont vrai ça retourne vrai => intéragit avec le bouton à la même place que le click
    if (touchX && touchY) {
      return true;
    } else {
      return false;
    }
  };
}

class EcranConsole {
  constructor(x, y, messageMax) {
    this.x = x;
    this.y = y;
    this.messageMax = messageMax;
    this.historique = [];
  }

  ajoutMessage(nouveauMessage, typeDeMessage = "p") {
    this.historique.unshift({
      texte: nouveauMessage,
      type: typeDeMessage,
      animIndex: -4,
      animLeave: 4,
      opacite: 0,
    });
  }

  vider() {
    this.historique = []
  }
  update() {
    for (let i = 0; i < this.historique.length; i++) {
      // mess = le message dans l'historique
      let mess = this.historique[i];
      mess.animIndex = lerp(mess.animIndex, i, 0.46);
      if (mess.opacite < 1) {
        mess.opacite += 0.1;
      } else if (mess.opacite === 1) {
        mess.opacite = 1;
      } if (this.historique.length > this.messageMax) {
        this.historique.pop();
      }
    }
  }
  draw(ctx, currentW, currentH) {
    const scaleX = currentW / figmaW;
    const scaleY = currentH / figmaH;

    const tailleTitre = Math.round(24 * scaleX);
    const tailleTexte = Math.round(20 * scaleX);
    const espaceConsole = 28 * scaleX;
    const largeurMax = 460 * scaleX;
    ctx.fillStyle = "white";

    for (let i = 0; i < this.historique.length; i++) {
      let ligneActu = this.historique[i];
      let posX = this.x * scaleX;
      let posY = this.y * scaleY - (ligneActu.animIndex * espaceConsole) + tailleTitre;
      if (ligneActu.type === "titre") {
        ctx.font = tailleTitre + "px  'KH Interference'";
      } else {
        ctx.font = tailleTexte + "px  'PP Fraktion'";
      }

      ctx.globalAlpha = ligneActu.opacite;
      ctx.fillText(ligneActu.texte, posX, posY, largeurMax);
    }
    ctx.globalAlpha = 1.0;
  }
};

// liste des messages

const messageConsole = new EcranConsole(90.25, 965, 12);
messageConsole.ajoutMessage("> Initialisation requise", "titre");
messageConsole.ajoutMessage("Alfred V3 à besoin d’un redémarrage.");
messageConsole.ajoutMessage("-------------------------------------");


class MixerButton {
  constructor(x, y, width, height, nomImage, id) {
    this.x = x;
    this.y = y;
    this.baseY = y;
    this.width = width;
    this.height = height;
    this.state = 'off';
    this.nomImage = nomImage;
    this.id = id;

    // parametres pour l'animation
    this.animTime = 0.5;
    this.amplitude = 150;
    this.vitesse = 0.1;
  }

  //gestion de l'animation
  update(plugState) {
    if (plugState === 'on') {

      this.animTime += this.vitesse;

      let variation = (1 - Math.cos(this.animTime)) / 2;

      // On l'applique au fader (Base - la hauteur max multipliée par la vague)
      this.y = this.baseY - (variation * this.amplitude);
    } else {
      // quand désactivé on revient à la position de base
      this.y = this.baseY;
      this.animTime = 0;
    }
  }

  draw(ctx, assets, currentW, currentH) {
    let imageToDraw = assets[this.nomImage];

    // calculs pour responsive
    const scaleX = currentW / figmaW;
    const scaleY = currentH / figmaH;

    const responsiveX = this.x * scaleX;
    const responsiveY = this.y * scaleY;
    const responsiveWidth = this.width * scaleX;
    const responsiveHeight = this.height * scaleY;

    // On dessine avec les valeurs recalculées
    ctx.drawImage(imageToDraw, responsiveX, responsiveY, responsiveWidth, responsiveHeight);
  }
};

let mixerY1 = 295;
let mixerY2 = 295;
let mixerY3 = 295;

const myMixer = [
  //constructor( x, y, width, height, nomImage,id) mixerButton myMixer
  new MixerButton(824, mixerY1, 40, 70, 'slider', 'mixer1'),
  new MixerButton(884, mixerY1, 40, 70, 'slider', 'mixer2'),
  new MixerButton(944, mixerY1, 40, 70, 'slider', 'mixer3'),
];

const myRotativeButton = [
  //  constructor(x,y,width,height,nomImage,isDragging,buttonDeg,id){
  new ButtonRotate(430.5, 84, 100.32, 98.87, 'btnSlider', 0, 'slider1'),
  new ButtonRotate(566, 84, 100.32, 98.87, 'btnSlider', 0, 'slider2'),
  new ButtonRotate(700.5, 84, 100.32, 98.87, 'btnSlider', 0, 'slider3'),
];



const myButtons = [

  // new button(x, y, largeur, hauteur, nomOff, nomOn, étatInitial)

  //petit bouton en bas à droite
  //1
  new Button(632, 972, 64, 64, 'btnOff', 'btnOn', 'off', 'screen1'),
  //2
  new Button(760, 972, 64, 64, 'btnOff', 'btnOn', 'off', 'screen2'),

  //gros bouton initialisation
  new Button(884, 935, 110, 110, 'lBtnOff', 'lBtnOn', 'off', 'init'),


  // plugSlider

  // plugButton 1
  new Button(823, 394.05, 43.79, 47.89, 'checkOff', 'checkOn', 'off', 'plug1'),
  // plugButton 2
  new Button(881, 394.05, 43.79, 47.89, 'checkOff', 'checkOn', 'off', 'plug2'),
  // plugButton 3
  new Button(940.21, 394.05, 43.79, 47.89, 'checkOff', 'checkOn', 'off', 'plug3'),



];

class Light {
  constructor(x, y, width, height, nomImageOff, nomImageOn, etatInitial, id) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    //noms image
    this.nomImageOff = nomImageOff;
    this.nomImageOn = nomImageOn;
    //état du btn
    this.state = etatInitial;
    this.id = id;
    this.sended = false;

  };

  draw(ctx, assets, currentW, currentH) {
    let imageToDraw;

    if (this.state === "on") {
      imageToDraw = assets[this.nomImageOn];
    } else {
      imageToDraw = assets[this.nomImageOff];
    };


    // calculs pour responsive
    const scaleX = currentW / figmaW;
    const scaleY = currentH / figmaH;

    const responsiveX = this.x * scaleX;
    const responsiveY = this.y * scaleY;
    const responsiveWidth = this.width * scaleX;
    const responsiveHeight = this.height * scaleY;

    // On dessine avec les valeurs recalculées
    ctx.drawImage(imageToDraw, responsiveX, responsiveY, responsiveWidth, responsiveHeight);
  }
};

const myLights = [

  // new Button(x, y, largeur, hauteur, nomOff, nomOn, étatInitial,id)

  // large light top horizon
  //1
  new Light(70, 16, 36, 36, 'lightLOff', 'lightL', 'on', 'lightL1'),
  //2
  new Light(117.25, 16, 36, 36, 'lightLOff', 'lightL', 'on', 'lightL2'),
  //3
  new Light(164.5, 16, 36, 36, 'lightLOff', 'lightL', 'on', 'lightL3'),

  // large light top vertical
  //1
  new Light(1018, 446, 36, 36, 'lightLOff', 'lightL', 'on', 'lightL4'),
  //2
  new Light(1018, 493.25, 36, 36, 'lightLOff', 'lightL', 'on', 'lightL5'),
  //3
  new Light(1018, 540.5, 36, 36, 'lightLOff', 'lightL', 'on', 'lightL6'),

  // Medium light bouton tournant
  //1
  new Light(415, 65, 40, 40, 'lightMOff', 'lightMOn', 'off', 'lightSlider1'),
  //2
  new Light(552, 65, 40, 40, 'lightMOff', 'lightMOn', 'off', 'lightSlider2'),
  //3
  new Light(687, 65, 40, 40, 'lightMOff', 'lightMOn', 'off', 'lightSlider3'),


  // light plug slider
  //1
  new Light(825, 434, 40, 40, 'lightMOff', 'lightMOn', 'off', 'lightPlug1'),
  //2
  new Light(883, 434, 40, 40, 'lightMOff', 'lightMOn', 'off', 'lightPlug2'),
  //3
  new Light(942, 434, 40, 40, 'lightMOff', 'lightMOn', 'off', 'lightPlug3'),


  // bouton bas droite
  //1
  new Light(682, 1028, 40, 40, 'lightSOff', 'lightSOn', 'off', 'lightScreen1'),
  //2
  new Light(810, 1028, 40, 40, 'lightSOff', 'lightSOn', 'off', 'lightScreen2'),
  //3
  new Light(983, 1028, 40, 40, 'lightSOff', 'lightSOn', 'off', 'lightInit'),

];



// justifier ICI
//création des yeux interactif
class Eye {
  constructor(x, y, width, height, id) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.id = id;
    this.timer = Math.random() * 100;

    // utilisation de positions relative au lieu d'utiliser 0, width/2, width on utilise 0,0.5,1 
    // x, y : 0 = début, 1 = fin du rectangle
    this.points = [
      { rx: 0, ry: 0 }, // Haut Gauche
      { rx: 1, ry: 0 }, // Haut Droite
      { rx: 1, ry: 0.5 }, // Milieu Droite
      { rx: 1, ry: 1 }, // Bas Droite
      { rx: 0, ry: 1 }, // Bas Gauche
      { rx: 0, ry: 0.5 } // Milieu Gauche
    ];

    // Tableau qui contiendra les positions calculées (pour le dessin)
    this.currentPoints = [];
  }

  update(f1, f2, f3, s1, s2, s3) {
    this.timer += 0.1;

    // utilisation de la fonction map => sort p.rx au lieu de points.rx 
    this.currentPoints = this.points.map((p, index) => {

      // Position de base de chaque point
      let px = p.rx * this.width;
      let py = p.ry * this.height;

      //gestion des faders et calcul des hauteurs
      let hauteurGauche = f1 + f2;
      let hauteurDroite = f3 + f2;

      // coté gauche
      if (p.rx === 0) {
        py += (p.ry - 0.5) * hauteurGauche * 0.55;
      }
      // coté droit
      else if (p.rx === 1) {
        py += (p.ry - 0.5) * hauteurDroite * 0.55;
      }


      //  sélection de l'intensité en fonction de la hauteur du point (ry)
      let intensiteSlider = 0;

      if (p.ry === 0) {
        intensiteSlider = s1 / rand(30, 12);
      } else if (p.ry === 0.5) {
        intensiteSlider = s2 / rand(30, 12);
      } else if (p.ry === 1) {
        intensiteSlider = s3 / rand(30, 12);
      }

      if (p.rx === 0) {
        px -= intensiteSlider; // rapproche les cotés
      } else {
        px += intensiteSlider; // écrates les cotés 
      }

      //création des glitchs (2% de chances)
      let moveX = Math.cos(this.timer + index) * intensiteSlider;

      //renvoie des coordonnées
      return {
        x: px + moveX,
        y: py + (Math.sin(this.timer * 0.5 + index) * (intensiteSlider / 4))
      };
    });
  }

  draw(ctx, currentW, currentH) {
    const scaleX = currentW / figmaW;
    const scaleY = currentH / figmaH;
    const rx = this.x * scaleX;
    const ry = this.y * scaleY;

    ctx.fillStyle = "white";
    ctx.strokeStyle = "#d4cdbc";
    ctx.lineWidth = 2; //largeur contour

    ctx.beginPath();
    this.currentPoints.forEach((p, i) => {
      // calcul du responsive
      let finalX = rx + (p.x * scaleX);
      let finalY = ry + (p.y * scaleY);

      if (i === 0) ctx.moveTo(finalX, finalY);
      else ctx.lineTo(finalX, finalY);
    });

    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  }
}


//positions des yeux dans le screen 1
var eyeGaucheScreen1X = 110;
var eyeGaucheScreen1Y = 170;
var eyeDroiteScreen1X = 260;
var eyeDroiteScreen1Y = 170;

//positions des yeux dans le screen 2
var eyeGaucheScreen2X = 660;
var eyeGaucheScreen2Y = 740;
var eyeDroiteScreen2X = 840;
var eyeDroiteScreen2Y = 740;


const myEyes = [
  // new eye(x, y, largeur, hauteur, id)
  new Eye(660, 830, 112, 80, 'gauche'),
  new Eye(840, 830, 112, 80, 'droite')
];


let isInitialized = false;


// -- DRAW
const animate = () => {

  // dessin du bg
  ctx.drawImage(assets.bg, 0, 0, w, h);

  // boucle dessin des boutons sur le bg
  for (let i = 0; i < myButtons.length; i++) {
    myButtons[i].draw(ctx, assets, w, h);
  };

  // boucle dessin des lumières sur le bg
  for (let i = 0; i < myLights.length; i++) {
    myLights[i].draw(ctx, assets, w, h);
  };

  // boucle bouton rotatif
  for (let i = 0; i < myRotativeButton.length; i++) {
    myRotativeButton[i].draw(ctx, assets, w, h);
  }

  //bug a régler !! Il faut suppr les boutons statique quand on initialise // OK
  if (isInitialized === false) {
    for (let i = 0; i < myMixer.length; i++) {
      myMixer[i].draw(ctx, assets, w, h);
    }
  }
  if (btnScreen1.state !== 'on') {
    waitingScreen1.update(ctx, w / figmaW);
    waitingScreen1.draw(ctx, w, h);
  }

  if (btnScreen2.state !== 'on') {
    waitingScreen2.update(ctx, w / figmaW);
    waitingScreen2.draw(ctx, w, h);
  }


  if (isInitialized === true) {


    if (btnScreen1.state === 'on' || btnScreen2.state === 'on') {

      // Yeux gestions  faders (hauteur)
      let f1 = Math.abs(myMixer[0].y - myMixer[0].baseY);
      let f2 = Math.abs(myMixer[1].y - myMixer[1].baseY);
      let f3 = Math.abs(myMixer[2].y - myMixer[2].baseY);
      // Yeux gestion slider (horizont)
      let s1 = Math.abs(myRotativeButton[0].buttonDeg);
      let s2 = Math.abs(myRotativeButton[1].buttonDeg);
      let s3 = Math.abs(myRotativeButton[2].buttonDeg);

      for (let i = 0; i < myEyes.length; i++) {
        let eye = myEyes[i];
        eye.update(f1, f2, f3, s1, s2, s3);
        eye.draw(ctx, w, h);
      }
    }
  }
  //slider 

  if (sliderDeg1.buttonDeg > 30) {
    lightSlider1.state = 'on';
    if (!lightSlider1.sended) {
      messageConsole.ajoutMessage("> Déformation haute active", "titre");
      messageConsole.ajoutMessage("Le haut des yeux réagit !");
      messageConsole.ajoutMessage("-------------------------------------");
      lightSlider1.sended = true;
    }
  } else {
    lightSlider1.state = 'off';
    lightSlider1.sended = false;
  }



  if (sliderDeg2.buttonDeg > 30) {

    lightSlider2.state = 'on';
    if (!lightSlider2.sended) {
      messageConsole.ajoutMessage("> Déformation milieu active", "titre");
      messageConsole.ajoutMessage("Le milieu des yeux réagit !");
      messageConsole.ajoutMessage("-------------------------------------");
      lightSlider2.sended = true;
    }
  } else {
    lightSlider2.state = 'off';
    lightSlider2.sended = false;

  }

  if (sliderDeg3.buttonDeg > 30) {

    lightSlider3.state = 'on';
    if (!lightSlider3.sended) {
      messageConsole.ajoutMessage("> Déformation basse active", "titre");
      messageConsole.ajoutMessage("Le bas des yeux réagit !");
      messageConsole.ajoutMessage("-------------------------------------");
      lightSlider3.sended = true;
    }
  } else {
    lightSlider3.state = 'off';
    lightSlider3.sended = false;
  }



  //Texte de la console
  messageConsole.update()
  messageConsole.draw(ctx, w, h);


  /*

*/



  //Animation Mixer
  if (isInitialized === true) {
    //Création des faders
    for (let i = 0; i < myMixer.length; i++) {
      let fader = myMixer[i];

      if (isInitialized === true) {
        if (fader.id === 'mixer1') {
          fader.update(plug1.state);
        }
        else if (fader.id === 'mixer2') {
          fader.update(plug2.state);
        }
        else if (fader.id === 'mixer3') {
          fader.update(plug3.state);
        }
      }

      fader.draw(ctx, assets, w, h);
    }

  };


  requestAnimationFrame(animate);


};

// Ecouteur d'event au click sur chaque bouton
canvas.addEventListener('click', function (event) {

  const rect = canvas.getBoundingClientRect();

  let sourisFigmaX = (event.offsetX / rect.width) * figmaW;
  let sourisFigmaY = (event.offsetY / rect.height) * figmaH;

  for (let i = 0; i < myButtons.length; i++) {

    let btnClicked = myButtons[i];

    if (btnClicked.isClicked(sourisFigmaX, sourisFigmaY) === true) {

      // impossible d'initialiser si déjà fait
      if (btnClicked.id === 'init' && isInitialized === true) {
        break
      } else {
        // Le bouton Initialisation
        if (btnClicked.id === 'init' && btnClicked.state !== 'on') {
          btnClicked.state = 'on';
          if (btnClicked.state === 'on') {
            isInitialized = true;
            initLight.state = 'on';
            messageConsole.ajoutMessage("> Initialisation OK", "titre");
            messageConsole.ajoutMessage("Vous pouvez intéragir avec Alfred");
            messageConsole.ajoutMessage("-------------------------------------");
          }
        }
      }

      //ecran1 

      if (btnClicked.id === 'screen1') {

        if (isInitialized === false || btnClicked.state === 'on') {

          break
        }
        btnClicked.state = 'on';
        //Message ecran 1
        messageConsole.ajoutMessage("> Activation de la caméra 1", "titre");
        messageConsole.ajoutMessage("Affichage écran 1");
        messageConsole.ajoutMessage("-------------------------------------");

        eyeGauche.x = eyeGaucheScreen1X;
        eyeGauche.y = eyeGaucheScreen1Y;
        eyeDroite.x = eyeDroiteScreen1X;
        eyeDroite.y = eyeDroiteScreen1Y;

        if (btnClicked.state === 'on') {
          lightScreen1.state = 'on';
          lightScreen2.state = 'off';
          btnScreen2.state = 'off';
        }
      }
      //ecran2

      if (btnClicked.id === 'screen2') {

        if (isInitialized === false || btnClicked.state === 'on') {
          break
        }
        btnClicked.state = 'on';

        //Message ecran 2
        messageConsole.ajoutMessage("> Activation de la caméra 2", "titre");
        messageConsole.ajoutMessage("Affichage écran 2");
        messageConsole.ajoutMessage("-------------------------------------");

        eyeGauche.x = eyeGaucheScreen2X;
        eyeGauche.y = eyeGaucheScreen2Y;
        eyeDroite.x = eyeDroiteScreen2X;
        eyeDroite.y = eyeDroiteScreen2Y;


        if (btnClicked.state === 'on') {
          lightScreen2.state = 'on';
          lightScreen1.state = 'off';
          btnScreen1.state = 'off';

        }
      }

      // récupération des items dans la liste btn + light de chaque plug => nomLight = lightPlug1 nomItem = plug1

      if (btnClicked.id === 'plug1') {

        if (isInitialized === false) {
          break
        }

        if (btnClicked.state === 'off') {
          btnClicked.state = 'on';
          lightPlug1.state = 'on';
          if (!plug1.sended) {
            messageConsole.ajoutMessage("> Augmentation de la hauteur gauche", "titre");
            messageConsole.ajoutMessage("Les yeux s'agrandissent à gauche !");
            messageConsole.ajoutMessage("-------------------------------------");
            plug1.sended = true;
          }

        } else {
          lightPlug1.state = 'off';
          btnClicked.state = 'off';
          plug1.sended = false;
        }

      }
      //2
      if (btnClicked.id === 'plug2') {

        if (isInitialized === false) {
          break
        }
        if (btnClicked.state === 'off') {
          btnClicked.state = 'on';
          lightPlug2.state = 'on';
          if (!plug2.sended) {
            messageConsole.ajoutMessage("> Augmentation de la hauteur", "titre");
            messageConsole.ajoutMessage("Les yeux s'agrandissent au milieu !");
            messageConsole.ajoutMessage("-------------------------------------");
            plug2.sended = true;
          }
        } else {
          lightPlug2.state = 'off';
          btnClicked.state = 'off';
          plug2.sended = false;
        }

      }

      //3
      if (btnClicked.id === 'plug3') {

        if (isInitialized === false) {
          break
        }

        if (btnClicked.state === 'off') {
          btnClicked.state = 'on';
          lightPlug3.state = 'on';
          if (!plug3.sended) {
            messageConsole.ajoutMessage("> Augmentation de la hauteur droite", "titre");
            messageConsole.ajoutMessage("Les yeux s'agrandissent à droite !");
            messageConsole.ajoutMessage("-------------------------------------");
            plug3.sended = true;
          }
        } else {
          lightPlug3.state = 'off';
          btnClicked.state = 'off';
          plug3.sended = false;
        }

      }
      break;
    }
  }
});


for (let item in imageSources) {
  let img = new Image();

  img.onload = () => {
    imageLoaded++;
    if (imageLoaded === totalImages) {
      startApp();
    }
  };

  // En cas d'image introuvable, on logue l'erreur et on incrémente quand même le compteur
  img.onerror = () => {
    console.error(`Image introuvable ou erreur de chargement : "${imageSources[item]}" (clé: ${item})`);
    imageLoaded++;
    if (imageLoaded === totalImages) {
      startApp();
    }
  };

  img.src = imageSources[item];
  assets[item] = img;
}

// -- RESIZE
// Redéfini la largeur et hauteur du canvas
// au redimmensionnement de la fenêtre. Ceci
// assure une densité de pixel optimale.
window.addEventListener('resize', () => {
  canvasSetup();
});



// Ecoute du clic de l'utilisateur
canvas.addEventListener('mousedown', function (event) {
  if (isInitialized === false) {
    return
  }

  //responsive
  const rect = canvas.getBoundingClientRect();
  let sourisFigmaX = (event.offsetX / rect.width) * figmaW;
  let sourisFigmaY = (event.offsetY / rect.height) * figmaH;

  // vérification si on click sur un boutonR
  for (let i = 0; i < myRotativeButton.length; i++) {
    let btn = myRotativeButton[i];

    // Si OK
    if (btn.isClicked(sourisFigmaX, sourisFigmaY) === true) {
      // drag activé
      btn.isDragging = true;
    }
  }
});

canvas.addEventListener('mousemove', function (event) {
  if (isInitialized === false) {
    return
  }
  //responsive
  const rect = canvas.getBoundingClientRect();
  let sourisFigmaX = (event.offsetX / rect.width) * figmaW;
  let sourisFigmaY = (event.offsetY / rect.height) * figmaH;
  for (let i = 0; i < myRotativeButton.length; i++) {
    let btn = myRotativeButton[i];


    if (btn.isDragging === true) {
      // pour trouver le centre
      let centreX = btn.x + (btn.width / 2);
      let centreY = btn.y + (btn.height / 2);

      // mouvement de la souris par rapport au centre du bouton
      let distanceX = sourisFigmaX - centreX;
      let distanceY = sourisFigmaY - centreY;

      // récupération de l'angle en radiant

      let angleRadians = Math.atan2(distanceY, distanceX);
      let userAngle = radToDeg(angleRadians);
      // attribution des degrés dans les valeurs de l'objet
      if (userAngle < 0) {
        userAngle = 0
      } else if (userAngle > 179) {
        userAngle = 179;
      }
      if (Math.abs(userAngle - btn.buttonDeg) > 100) {
        continue; // On stoppe la lecture ici et on passe à la frame suivante
      }
      btn.buttonDeg = userAngle
    }
  }
});


window.addEventListener('mouseup', function () {
  // désactivation des boutons une fois fini
  for (let i = 0; i < myRotativeButton.length; i++) {
    myRotativeButton[i].isDragging = false;
  }
});



// Tristan Malo 2526 INMI
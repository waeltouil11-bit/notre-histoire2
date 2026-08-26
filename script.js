const monPrenom = "Wael";
const nomNaelle = "Naelle";

const tangerCoords = [35.7595, -5.8340];
const targetCoords = [48.8566, 2.3522];

// Initialisation de la carte Leaflet
const map = L.map('map', { zoomControl: false }).setView([42.5, -2.0], 5);

L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
  maxZoom: 19,
  attribution: '© OpenStreetMap'
}).addTo(map);

setTimeout(() => {
  const tangerMarker = L.circleMarker(tangerCoords, { color: '#ff4d6d', fillColor: '#ff758f', fillOpacity: 0.9, radius: 9 }).addTo(map);
  const targetMarker = L.circleMarker(targetCoords, { color: '#ff4d6d', fillColor: '#ff758f', fillOpacity: 0.9, radius: 9 }).addTo(map);

  tangerMarker.bindTooltip(`📍 Tanger — ${monPrenom}`, { permanent: true, direction: 'top', className: 'custom-name-label' }).openTooltip();
  targetMarker.bindTooltip(`📍 France — ${nomNaelle}`, { permanent: true, direction: 'top', className: 'custom-name-label' }).openTooltip();

  // Polylines des deux tracés rouges
  const lineWael = L.polyline([], { color: '#ff4d6d', weight: 4.5, opacity: 0.95, lineCap: 'round', lineJoin: 'round' }).addTo(map);
  const lineNaelle = L.polyline([], { color: '#ff4d6d', weight: 4.5, opacity: 0.95, lineCap: 'round', lineJoin: 'round' }).addTo(map);

  // Centre du cœur sur la carte
  const centerLat = 42.5;
  const centerLng = -2.0;

  // Calcul exact des coordonnées du cœur (Équation paramétrique)
  const stepsHeart = 50;
  const heartPointsLeft = [];
  const heartPointsRight = [];

  for (let i = 0; i <= stepsHeart; i++) {
    const t = (i / stepsHeart) * Math.PI; // De 0 à PI

    // Calcul forme du cœur
    const x = 16 * Math.pow(Math.sin(t), 3);
    const y = 13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t);

    // Échelle et position sur la carte
    const scaleLat = 0.22;
    const scaleLng = 0.32;

    // Côté gauche (Wael)
    heartPointsLeft.push([centerLat + (y / 16) * scaleLat + 0.5, centerLng - (x / 16) * scaleLng]);

    // Côté droit (Naelle)
    heartPointsRight.push([centerLat + (y / 16) * scaleLat + 0.5, centerLng + (x / 16) * scaleLng]);
  }

  // Étape 1 : Ligne d'approche depuis les villes vers le bas du cœur
  const approachSteps = 30;
  const startHeartBaseLeft = heartPointsLeft[heartPointsLeft.length - 1]; // Pointe bas
  const startHeartBaseRight = heartPointsRight[heartPointsRight.length - 1]; // Pointe bas

  const fullPathWael = [];
  const fullPathNaelle = [];

  // Trajet Wael : Tanger -> Pointe bas -> Remontée boucle gauche
  for (let i = 0; i <= approachSteps; i++) {
    const progress = i / approachSteps;
    const lat = tangerCoords[0] + (startHeartBaseLeft[0] - tangerCoords[0]) * progress;
    const lng = tangerCoords[1] + (startHeartBaseLeft[1] - tangerCoords[1]) * progress;
    fullPathWael.push([lat, lng]);
  }
  for (let i = heartPointsLeft.length - 1; i >= 0; i--) {
    fullPathWael.push(heartPointsLeft[i]);
  }

  // Trajet Naelle : France -> Pointe bas -> Remontée boucle droite
  for (let i = 0; i <= approachSteps; i++) {
    const progress = i / approachSteps;
    const lat = targetCoords[0] + (startHeartBaseRight[0] - targetCoords[0]) * progress;
    const lng = targetCoords[1] + (startHeartBaseRight[1] - targetCoords[1]) * progress;
    fullPathNaelle.push([lat, lng]);
  }
  for (let i = heartPointsRight.length - 1; i >= 0; i--) {
    fullPathNaelle.push(heartPointsRight[i]);
  }

  let step = 0;
  const totalSteps = fullPathWael.length;

  // Animation synchrone parfaite
  const animInterval = setInterval(() => {
    if (step < totalSteps) {
      lineWael.addLatLng(fullPathWael[step]);
      lineNaelle.addLatLng(fullPathNaelle[step]);
      step++;
    } else {
      clearInterval(animInterval);
      map.flyTo([centerLat, centerLng], 5, { duration: 2 });

      setTimeout(() => document.getElementById('quote-1').classList.add('visible'), 800);
      setTimeout(() => document.getElementById('quote-2').classList.add('visible'), 2400);
      setTimeout(() => document.getElementById('poem').classList.add('visible'), 4000);
      setTimeout(() => document.getElementById('next-btn').classList.remove('hidden'), 5500);
    }
  }, 30);

}, 1000);

function goToNextScreen(screenId) {
  document.querySelectorAll('.screen').forEach(screen => screen.classList.remove('active'));
  document.getElementById(screenId).classList.add('active');
}

// Message d'erreur réglé sur 10 secondes (10000ms)
function triggerLockError() {
  const hackOverlay = document.getElementById('hack-overlay');
  
  if (hackOverlay) {
    hackOverlay.classList.remove('hidden');

    setTimeout(() => {
      hackOverlay.classList.add('hidden');
      launchPlaneAnimation();
    }, 10000);
  }
}

function launchPlaneAnimation() {
  const planeWrapper = document.getElementById('plane-wrapper');
  const smoke = document.getElementById('smoke-overlay');

  planeWrapper.style.display = 'flex';
  
  let pos = -400;
  const planeInterval = setInterval(() => {
    pos += 15;
    planeWrapper.style.left = pos + 'px';

    if (pos > window.innerWidth / 4) {
      smoke.classList.add('active');
    }

    if (pos > window.innerWidth + 200) {
      clearInterval(planeInterval);
      planeWrapper.style.display = 'none';
      
      setTimeout(() => {
        goToNextScreen('screen-final');
        smoke.classList.remove('active');
      }, 400);
    }
  }, 20);
}

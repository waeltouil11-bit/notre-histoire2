const monPrenom = "Wael";
const nomNaelle = "Naelle";

// Coordonnées de départ et d'arrivée
const tangerCoords = [35.7595, -5.8340];
const targetCoords = [48.8566, 2.3522];

// Initialisation de la carte (Fond sombre / Dark mode comme dans la vidéo)
const map = L.map('map', { zoomControl: false }).setView([42.3, -1.7], 5);

L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
  maxZoom: 19,
  attribution: '© OpenStreetMap © CARTO'
}).addTo(map);

// Marqueurs des villes
const tangerMarker = L.circleMarker(tangerCoords, {
  color: '#ff6b35',
  fillColor: '#ff6b35',
  fillOpacity: 1,
  radius: 7
}).addTo(map);

const targetMarker = L.circleMarker(targetCoords, {
  color: '#00b4d8',
  fillColor: '#00b4d8',
  fillOpacity: 1,
  radius: 7
}).addTo(map);

tangerMarker.bindTooltip(`📍 Tanger — ${monPrenom}`, { permanent: true, direction: 'top', className: 'custom-name-label' }).openTooltip();
targetMarker.bindTooltip(`📍 France — ${nomNaelle}`, { permanent: true, direction: 'top', className: 'custom-name-label' }).openTooltip();

// Génération de points intermédiaires pour simuler l’exploration des deux vagues (algorithme bidirectionnel)
function generateGridPoints(center, count, radius) {
  const points = [];
  for (let i = 0; i < count; i++) {
    const angle = Math.random() * Math.PI * 2;
    const r = Math.sqrt(Math.random()) * radius;
    const lat = center[0] + r * Math.sin(angle) * 0.7;
    const lng = center[1] + r * Math.cos(angle) * 1.2;
    points.push([lat, lng]);
  }
  return points;
}

// Lancement de l'animation style Dijkstra Bidirectionnel
setTimeout(() => {
  let step = 0;
  const maxSteps = 40;
  
  const searchInterval = setInterval(() => {
    step++;
    const currentRadius = step * 0.18;

    // Vague d'exploration Orange (Tanger)
    const orangeNewPoints = generateGridPoints(tangerCoords, 6, currentRadius);
    orangeNewPoints.forEach(pt => {
      L.circleMarker(pt, {
        color: '#ff6b35',
        fillColor: '#ff9f1c',
        fillOpacity: 0.7,
        radius: 3.5,
        stroke: false
      }).addTo(map);
    });

    // Vague d'exploration Bleue (France)
    const blueNewPoints = generateGridPoints(targetCoords, 6, currentRadius);
    blueNewPoints.forEach(pt => {
      L.circleMarker(pt, {
        color: '#00b4d8',
        fillColor: '#90e0ef',
        fillOpacity: 0.7,
        radius: 3.5,
        stroke: false
      }).addTo(map);
    });

    // Quand les deux vagues se rencontrent au milieu
    if (step >= maxSteps) {
      clearInterval(searchInterval);
      drawFinalPath();
    }
  }, 80);

}, 1000);

// Tracé du chemin final le plus court reliant les deux côtés
function drawFinalPath() {
  const polyline = L.polyline([], {
    color: '#00f5d4',
    weight: 5,
    opacity: 1,
    lineCap: 'round'
  }).addTo(map);

  let progress = 0;
  const pathInterval = setInterval(() => {
    progress += 0.04;

    const currentLat = tangerCoords[0] + (targetCoords[0] - tangerCoords[0]) * progress;
    const currentLng = tangerCoords[1] + (targetCoords[1] - tangerCoords[1]) * progress;
    polyline.addLatLng([currentLat, currentLng]);

    if (progress >= 1) {
      clearInterval(pathInterval);
      
      // Animation du cœur et affichage des messages
      drawHeartShape();
    }
  }, 30);
}

function drawHeartShape() {
  const midLat = (tangerCoords[0] + targetCoords[0]) / 2;
  const midLng = (tangerCoords[1] + targetCoords[1]) / 2;

  const leftHeartLine = L.polyline([], { color: '#ff1493', weight: 4, opacity: 0.95 }).addTo(map);
  const rightHeartLine = L.polyline([], { color: '#ff1493', weight: 4, opacity: 0.95 }).addTo(map);

  let step = 0;
  const totalSteps = 80;
  const scaleLat = 1.6;
  const scaleLng = 2.2;

  const heartInterval = setInterval(() => {
    step++;
    const t = (step / totalSteps) * Math.PI;

    const xLeft = -16 * Math.pow(Math.sin(t), 3);
    const yLeft = 13 * Math.cos(t) - 5 * Math.cos(2*t) - 2 * Math.cos(3*t) - Math.cos(4*t);
    leftHeartLine.addLatLng([midLat + (yLeft / 16) * scaleLat, midLng + (xLeft / 16) * scaleLng]);

    const xRight = 16 * Math.pow(Math.sin(t), 3);
    const yRight = 13 * Math.cos(t) - 5 * Math.cos(2*t) - 2 * Math.cos(3*t) - Math.cos(4*t);
    rightHeartLine.addLatLng([midLat + (yRight / 16) * scaleLat, midLng + (xRight / 16) * scaleLng]);

    if (step >= totalSteps) {
      clearInterval(heartInterval);
      map.flyTo([midLat - 0.5, midLng], 6, { duration: 2.5 });

      setTimeout(() => document.getElementById('quote-1').classList.add('visible'), 1200);
      setTimeout(() => document.getElementById('quote-2').classList.add('visible'), 3200);
      setTimeout(() => document.getElementById('poem').classList.add('visible'), 5200);
      setTimeout(() => document.getElementById('next-btn').classList.remove('hidden'), 7200);
    }
  }, 25);
}

function goToNextScreen(screenId) {
  document.querySelectorAll('.screen').forEach(screen => screen.classList.remove('active'));
  document.getElementById(screenId).classList.add('active');
}

function triggerLockError() {
  const errorMsg = document.getElementById('error-message');
  errorMsg.classList.remove('hidden');

  setTimeout(() => {
    launchPlaneAnimation();
  }, 2500);
}

function launchPlaneAnimation() {
  const planeWrapper = document.getElementById('plane-wrapper');
  const smoke = document.getElementById('smoke-overlay');

  planeWrapper.style.display = 'flex';
  
  let pos = -400;
  const planeInterval = setInterval(() => {
    pos += 14;
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
      }, 500);
    }
  }, 20);
}

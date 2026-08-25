const monPrenom = "Wael";
const nomNaelle = "Naelle";

const tangerCoords = [35.7595, -5.8340];
const targetCoords = [48.8566, 2.3522];

// Initialisation de la carte Leaflet
const map = L.map('map', { zoomControl: false }).setView([42, -1], 5);

L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
  maxZoom: 19,
  attribution: '© OpenStreetMap'
}).addTo(map);

// Coordonnées du point de rencontre au centre
const midLat = (tangerCoords[0] + targetCoords[0]) / 2;
const midLng = (tangerCoords[1] + targetCoords[1]) / 2;
const midCoords = [midLat, midLng];

setTimeout(() => {
  const tangerMarker = L.circleMarker(tangerCoords, { color: '#ff4d6d', fillColor: '#ff758f', fillOpacity: 0.9, radius: 9 }).addTo(map);
  const targetMarker = L.circleMarker(targetCoords, { color: '#ff4d6d', fillColor: '#ff758f', fillOpacity: 0.9, radius: 9 }).addTo(map);

  tangerMarker.bindTooltip(`📍 Tanger — ${monPrenom}`, { permanent: true, direction: 'top', className: 'custom-name-label' }).openTooltip();
  targetMarker.bindTooltip(`📍 France — ${nomNaelle}`, { permanent: true, direction: 'top', className: 'custom-name-label' }).openTooltip();

  // Lignes qui partent des deux villes vers le centre
  const polyline1 = L.polyline([], { color: '#ff4d6d', weight: 4, opacity: 0.9, lineCap: 'round' }).addTo(map);
  const polyline2 = L.polyline([], { color: '#ff4d6d', weight: 4, opacity: 0.9, lineCap: 'round' }).addTo(map);

  let progress = 0;
  const lineInterval = setInterval(() => {
    progress += 0.02;
    
    // Avancée synchrone de Wael et Naelle vers le centre
    const lat1 = tangerCoords[0] + (midCoords[0] - tangerCoords[0]) * progress;
    const lng1 = tangerCoords[1] + (midCoords[1] - tangerCoords[1]) * progress;
    polyline1.addLatLng([lat1, lng1]);

    const lat2 = targetCoords[0] + (midCoords[0] - targetCoords[0]) * progress;
    const lng2 = targetCoords[1] + (midCoords[1] - targetCoords[1]) * progress;
    polyline2.addLatLng([lat2, lng2]);

    if (progress >= 1) {
      clearInterval(lineInterval);
      drawHeartShape(); // Formation du cœur au point de rencontre
    }
  }, 30);

}, 1000);

// Fonction qui trace la forme du cœur synchrone depuis le centre
function drawHeartShape() {
  const leftHeartLine = L.polyline([], { color: '#c9184a', weight: 4.5, opacity: 0.95 }).addTo(map);
  const rightHeartLine = L.polyline([], { color: '#c9184a', weight: 4.5, opacity: 0.95 }).addTo(map);

  let step = 0;
  const totalSteps = 80;
  const scaleLat = 1.6;
  const scaleLng = 2.2;

  const heartInterval = setInterval(() => {
    step++;
    const t = (step / totalSteps) * Math.PI;

    // Côté gauche du cœur
    const xLeft = -16 * Math.pow(Math.sin(t), 3);
    const yLeft = 13 * Math.cos(t) - 5 * Math.cos(2*t) - 2 * Math.cos(3*t) - Math.cos(4*t);
    leftHeartLine.addLatLng([midLat + (yLeft / 16) * scaleLat, midLng + (xLeft / 16) * scaleLng]);

    // Côté droit du cœur
    const xRight = 16 * Math.pow(Math.sin(t), 3);
    const yRight = 13 * Math.cos(t) - 5 * Math.cos(2*t) - 2 * Math.cos(3*t) - Math.cos(4*t);
    rightHeartLine.addLatLng([midLat + (yRight / 16) * scaleLat, midLng + (xRight / 16) * scaleLng]);

    if (step >= totalSteps) {
      clearInterval(heartInterval);
      map.flyTo([midLat - 0.5, midLng], 6, { duration: 2 });

      setTimeout(() => document.getElementById('quote-1').classList.add('visible'), 800);
      setTimeout(() => document.getElementById('quote-2').classList.add('visible'), 2400);
      setTimeout(() => document.getElementById('poem').classList.add('visible'), 4000);
      setTimeout(() => document.getElementById('next-btn').classList.remove('hidden'), 5500);
    }
  }, 30);
}

function goToNextScreen(screenId) {
  document.querySelectorAll('.screen').forEach(screen => screen.classList.remove('active'));
  document.getElementById(screenId).classList.add('active');
}

// Déclenchement du hack (Durée réglée sur 10 secondes = 10000ms)
function triggerLockError() {
  const hackOverlay = document.getElementById('hack-overlay');
  
  if (hackOverlay) {
    hackOverlay.classList.remove('hidden');

    setTimeout(() => {
      hackOverlay.classList.add('hidden');
      launchPlaneAnimation();
    }, 10000); // 10 secondes d'affichage
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

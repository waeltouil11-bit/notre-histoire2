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

// Coordonnées du centre (jonction de la pointe du bas du cœur)
const midLat = 40.5;
const midLng = -1.7;

setTimeout(() => {
  const tangerMarker = L.circleMarker(tangerCoords, { color: '#ff4d6d', fillColor: '#ff758f', fillOpacity: 0.9, radius: 9 }).addTo(map);
  const targetMarker = L.circleMarker(targetCoords, { color: '#ff4d6d', fillColor: '#ff758f', fillOpacity: 0.9, radius: 9 }).addTo(map);

  tangerMarker.bindTooltip(`📍 Tanger — ${monPrenom}`, { permanent: true, direction: 'top', className: 'custom-name-label' }).openTooltip();
  targetMarker.bindTooltip(`📍 France — ${nomNaelle}`, { permanent: true, direction: 'top', className: 'custom-name-label' }).openTooltip();

  // Ligne de Wael (part de Tanger vers la gauche du cœur)
  const lineWael = L.polyline([], { color: '#ff4d6d', weight: 4.5, opacity: 0.95, lineCap: 'round' }).addTo(map);
  // Ligne de Naelle (part de France vers la droite du cœur)
  const lineNaelle = L.polyline([], { color: '#ff4d6d', weight: 4.5, opacity: 0.95, lineCap: 'round' }).addTo(map);

  let progress = 0;
  const totalSteps = 100;

  const heartInterval = setInterval(() => {
    progress++;
    const t = (progress / totalSteps) * Math.PI;

    // Calcul courbe gauche (Wael)
    const xLeft = -14 * Math.pow(Math.sin(t), 3);
    const yLeft = 11 * Math.cos(t) - 4 * Math.cos(2*t) - 2 * Math.cos(3*t) - Math.cos(4*t);
    
    // Calcul courbe droite (Naelle)
    const xRight = 14 * Math.pow(Math.sin(t), 3);
    const yRight = 11 * Math.cos(t) - 4 * Math.cos(2*t) - 2 * Math.cos(3*t) - Math.cos(4*t);

    // Ajustement des trajectoires depuis Tanger et France
    const latW = tangerCoords[0] + (midLat + yLeft * 0.45 - tangerCoords[0]) * (progress / totalSteps);
    const lngW = tangerCoords[1] + (midLng + xLeft * 0.45 - tangerCoords[1]) * (progress / totalSteps);
    lineWael.addLatLng([latW, lngW]);

    const latN = targetCoords[0] + (midLat + yRight * 0.45 - targetCoords[0]) * (progress / totalSteps);
    const lngN = targetCoords[1] + (midLng + xRight * 0.45 - targetCoords[1]) * (progress / totalSteps);
    lineNaelle.addLatLng([latN, lngN]);

    if (progress >= totalSteps) {
      clearInterval(heartInterval);
      map.flyTo([42, -1], 5, { duration: 2 });

      setTimeout(() => document.getElementById('quote-1').classList.add('visible'), 800);
      setTimeout(() => document.getElementById('quote-2').classList.add('visible'), 2400);
      setTimeout(() => document.getElementById('poem').classList.add('visible'), 4000);
      setTimeout(() => document.getElementById('next-btn').classList.remove('hidden'), 5500);
    }
  }, 35);

}, 1000);

function goToNextScreen(screenId) {
  document.querySelectorAll('.screen').forEach(screen => screen.classList.remove('active'));
  document.getElementById(screenId).classList.add('active');
}

// Fonction du piratage (exactement 10 secondes = 10000ms)
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

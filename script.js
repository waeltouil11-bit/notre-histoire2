const monPrenom = "Wael";
const nomNaelle = "Naelle";

const tangerCoords = [35.7595, -5.8340];
const targetCoords = [48.8566, 2.3522];

// Initialisation de la carte Leaflet
const map = L.map('map', { zoomControl: false }).setView([42.5, -2.5], 5);

L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
  maxZoom: 19,
  attribution: '© OpenStreetMap'
}).addTo(map);

setTimeout(() => {
  const tangerMarker = L.circleMarker(tangerCoords, { color: '#ff4d6d', fillColor: '#ff758f', fillOpacity: 0.9, radius: 9 }).addTo(map);
  const targetMarker = L.circleMarker(targetCoords, { color: '#ff4d6d', fillColor: '#ff758f', fillOpacity: 0.9, radius: 9 }).addTo(map);

  tangerMarker.bindTooltip(`📍 Tanger — ${monPrenom}`, { permanent: true, direction: 'top', className: 'custom-name-label' }).openTooltip();
  targetMarker.bindTooltip(`📍 France — ${nomNaelle}`, { permanent: true, direction: 'top', className: 'custom-name-label' }).openTooltip();

  // Polylines pour l'animation synchrone
  const lineWael = L.polyline([], { color: '#ff4d6d', weight: 4.5, opacity: 0.95, lineCap: 'round', lineJoin: 'round' }).addTo(map);
  const lineNaelle = L.polyline([], { color: '#ff4d6d', weight: 4.5, opacity: 0.95, lineCap: 'round', lineJoin: 'round' }).addTo(map);

  // Génération des demi-cercles inclinés vers la gauche
  const samples = 60;
  const pathWael = [];
  const pathNaelle = [];

  // Paramètres du cœur incliné vers la gauche
  const basePoint = [39.5, -2.0];  // Pointe inférieure (croisement)
  const innerCrease = [44.0, -3.5]; // Creux supérieur du cœur

  // 1. Trajectoire de Wael : Tanger -> Ligne vers pointe bas -> Demi-cercle gauchi -> Creux
  for (let i = 0; i <= samples; i++) {
    const t = i / samples;
    if (t <= 0.35) {
      // Approche de Tanger vers la pointe du bas
      const subT = t / 0.35;
      const lat = tangerCoords[0] + (basePoint[0] - tangerCoords[0]) * subT;
      const lng = tangerCoords[1] + (basePoint[1] - tangerCoords[1]) * subT;
      pathWael.push([lat, lng]);
    } else {
      // Arc de demi-cercle pour la bosse gauche (inclinée)
      const subT = (t - 0.35) / 0.65;
      const angle = Math.PI * subT;
      
      const radius = 2.4;
      const centerLat = 42.0;
      const centerLng = -4.8;
      
      // Rotation pour l'inclinaison vers la gauche (-25 degrés)
      const tilt = -0.45; 
      const rawLat = -Math.sin(angle) * radius;
      const rawLng = -Math.cos(angle) * radius;

      const lat = centerLat + rawLat * Math.cos(tilt) - rawLng * Math.sin(tilt);
      const lng = centerLng + rawLat * Math.sin(tilt) + rawLng * Math.cos(tilt);
      
      pathWael.push([lat, lng]);
    }
  }

  // 2. Trajectoire de Naelle : France -> Ligne vers pointe bas -> Demi-cercle droit -> Creux
  for (let i = 0; i <= samples; i++) {
    const t = i / samples;
    if (t <= 0.35) {
      // Approche de la France vers la pointe du bas
      const subT = t / 0.35;
      const lat = targetCoords[0] + (basePoint[0] - targetCoords[0]) * subT;
      const lng = targetCoords[1] + (basePoint[1] - targetCoords[1]) * subT;
      pathNaelle.push([lat, lng]);
    } else {
      // Arc de demi-cercle pour la bosse droite (inclinée)
      const subT = (t - 0.35) / 0.65;
      const angle = Math.PI * subT;
      
      const radius = 2.4;
      const centerLat = 43.2;
      const centerLng = -1.2;

      // Rotation pour l'inclinaison vers la gauche
      const tilt = -0.45;
      const rawLat = -Math.sin(angle) * radius;
      const rawLng = Math.cos(angle) * radius;

      const lat = centerLat + rawLat * Math.cos(tilt) - rawLng * Math.sin(tilt);
      const lng = centerLng + rawLat * Math.sin(tilt) + rawLng * Math.cos(tilt);

      pathNaelle.push([lat, lng]);
    }
  }

  // Forcer les deux derniers points à se sceller exactement sur le creux du cœur
  pathWael[pathWael.length - 1] = innerCrease;
  pathNaelle[pathNaelle.length - 1] = innerCrease;

  let step = 0;
  const maxSteps = pathWael.length;

  // Animation synchrone exacte
  const animInterval = setInterval(() => {
    if (step < maxSteps) {
      lineWael.addLatLng(pathWael[step]);
      lineNaelle.addLatLng(pathNaelle[step]);
      step++;
    } else {
      clearInterval(animInterval);
      map.flyTo([42.5, -2.5], 5, { duration: 2 });

      setTimeout(() => document.getElementById('quote-1').classList.add('visible'), 800);
      setTimeout(() => document.getElementById('quote-2').classList.add('visible'), 2400);
      setTimeout(() => document.getElementById('poem').classList.add('visible'), 4000);
      setTimeout(() => document.getElementById('next-btn').classList.remove('hidden'), 5500);
    }
  }, 25);

}, 1000);

function goToNextScreen(screenId) {
  document.querySelectorAll('.screen').forEach(screen => screen.classList.remove('active'));
  document.getElementById(screenId).classList.add('active');
}

// Piratage (10 secondes)
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

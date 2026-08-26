const monPrenom = "Wael";
const nomNaelle = "Naelle";

const tangerCoords = [35.7595, -5.8340];
const targetCoords = [48.8566, 2.3522];

// Initialisation de la carte Leaflet
const map = L.map('map', { zoomControl: false }).setView([42.5, -1.8], 5);

L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
  maxZoom: 19,
  attribution: '© OpenStreetMap'
}).addTo(map);

setTimeout(() => {
  const tangerMarker = L.circleMarker(tangerCoords, { color: '#ff4d6d', fillColor: '#ff758f', fillOpacity: 0.9, radius: 9 }).addTo(map);
  const targetMarker = L.circleMarker(targetCoords, { color: '#ff4d6d', fillColor: '#ff758f', fillOpacity: 0.9, radius: 9 }).addTo(map);

  tangerMarker.bindTooltip(`📍 Tanger — ${monPrenom}`, { permanent: true, direction: 'top', className: 'custom-name-label' }).openTooltip();
  targetMarker.bindTooltip(`📍 France — ${nomNaelle}`, { permanent: true, direction: 'top', className: 'custom-name-label' }).openTooltip();

  // Deux lignes ROUGES partant de chaque côté
  const lineWael = L.polyline([], { color: '#ff4d6d', weight: 4.5, opacity: 0.95, lineCap: 'round', lineJoin: 'round' }).addTo(map);
  const lineNaelle = L.polyline([], { color: '#ff4d6d', weight: 4.5, opacity: 0.95, lineCap: 'round', lineJoin: 'round' }).addTo(map);

  // 1. Ligne Rouge Wael (Tanger -> Montée -> Bosse Gauche -> Creux du Cœur)
  const waypointsWael = [
    tangerCoords,
    [39.5, -4.5],       // Montée depuis Tanger
    [41.0, -6.5],       // Pointe gauche du cœur
    [45.0, -6.0],       // Bosse haute-gauche
    [43.0, -4.0]        // Creux central du cœur (Jonction)
  ];

  // 2. Ligne Rouge Naelle (France -> Descente -> Bosse Droite & Croisement -> Creux du Cœur)
  const waypointsNaelle = [
    targetCoords,
    [44.0, 0.0],        // Descente depuis la France
    [40.5, -2.5],       // Croisement en bas
    [45.5, -2.5],       // Bosse haute-droite
    [43.0, -4.0]        // Creux central du cœur (Jonction)
  ];

  // Interpolation de courbe fluide
  function getInterpolatedPoints(points, samples) {
    const result = [];
    for (let i = 0; i < points.length - 1; i++) {
      const p0 = points[Math.max(0, i - 1)];
      const p1 = points[i];
      const p2 = points[i + 1];
      const p3 = points[Math.min(points.length - 1, i + 2)];

      for (let t = 0; t < 1; t += 1 / samples) {
        const t2 = t * t;
        const t3 = t2 * t;

        const lat = 0.5 * ((2 * p1[0]) + (-p0[0] + p2[0]) * t + (2 * p0[0] - 5 * p1[0] + 4 * p2[0] - p3[0]) * t2 + (-p0[0] + 3 * p1[0] - 3 * p2[0] + p3[0]) * t3);
        const lng = 0.5 * ((2 * p1[1]) + (-p0[1] + p2[1]) * t + (2 * p0[1] - 5 * p1[1] + 4 * p2[1] - p3[1]) * t2 + (-p0[1] + 3 * p1[1] - 3 * p2[1] + p3[1]) * t3);

        result.push([lat, lng]);
      }
    }
    result.push(points[points.length - 1]);
    return result;
  }

  const fullPathWael = getInterpolatedPoints(waypointsWael, 40);
  const fullPathNaelle = getInterpolatedPoints(waypointsNaelle, 40);

  let step = 0;
  const maxSteps = Math.max(fullPathWael.length, fullPathNaelle.length);

  // Animation synchrone des deux lignes rouges
  const animInterval = setInterval(() => {
    if (step < fullPathWael.length) {
      lineWael.addLatLng(fullPathWael[step]);
    }
    if (step < fullPathNaelle.length) {
      lineNaelle.addLatLng(fullPathNaelle[step]);
    }

    step++;

    if (step >= maxSteps) {
      clearInterval(animInterval);
      map.flyTo([42.5, -1.8], 5, { duration: 2 });

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

// Piratage de 10 secondes
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

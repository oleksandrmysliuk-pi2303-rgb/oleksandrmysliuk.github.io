// ==============================
// Глобальні змінні
// ==============================

// Координати коледжу (для розрахунку відстані)
const ourCoords = {
  latitude: 48.94321,
  longitude: 24.73380
};

let watchId = null;     // ідентифікатор відслідковування
let map = null;         // карта Leaflet
let destMarker = null;  // маркер пункту призначення

// Налаштування отримання координат
const options = {
  enableHighAccuracy: true,
  timeout: 10000,
  maximumAge: 0
};

// ==============================
// Ініціалізація
// ==============================

document.addEventListener('DOMContentLoaded', getMyLocation);

function getMyLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(displayLocation, displayError, options);

    const watchButton = document.getElementById('watch');
    watchButton.addEventListener('click', watchLocation);

    const clearWatchButton = document.getElementById('clearWatch');
    clearWatchButton.addEventListener('click', clearWatch);

    document.getElementById('goToDestination')
      .addEventListener('click', goToDestination);
  } else {
    alert('Oops, no geolocation support');
  }
}

// ==============================
// Успішне отримання координат
// ==============================

function displayLocation(position) {
  const latitude = position.coords.latitude;
  const longitude = position.coords.longitude;

  const div = document.getElementById('location');
  div.innerHTML = `You are at Latitude: ${latitude}, Longitude: ${longitude}`;
  div.innerHTML += ` (with ${position.coords.accuracy} meters accuracy)`;

  const km = computeDistance(position.coords, ourCoords);
  const distance = document.getElementById('distance');
  distance.innerHTML = `You are ${km} km from the College`;

  // Індивідуальне завдання: карта і маркер
  showOnMap(position);
}

// ==============================
// Обробка помилок
// ==============================

function displayError(error) {
  const errorTypes = {
    0: 'Unknown error',
    1: 'Permission denied by user',
    2: 'Position is not available',
    3: 'Request timed out'
  };

  let errorMessage = errorTypes[error.code];
  if (error.code === 0 || error.code === 2) {
    errorMessage = errorMessage + ' ' + error.message;
  }

  const div = document.getElementById('location');
  div.innerHTML = errorMessage;
}

// ==============================
// Відстань між точками (формула гаверсинуса / сферичний закон косинусів)
// ==============================

function computeDistance(startCoords, destCoords) {
  const startLatRads = degreesToRadians(startCoords.latitude);
  const startLongRads = degreesToRadians(startCoords.longitude);
  const destLatRads = degreesToRadians(destCoords.latitude);
  const destLongRads = degreesToRadians(destCoords.longitude);

  const Radius = 6371; // радіус Землі в км

  // Math.min/max — захист від NaN при збігу точок (похибка округлення)
  const cosValue =
    Math.sin(startLatRads) * Math.sin(destLatRads) +
    Math.cos(startLatRads) * Math.cos(destLatRads) *
    Math.cos(startLongRads - destLongRads);

  const distance = Math.acos(Math.max(-1, Math.min(1, cosValue))) * Radius;

  return distance;
}

function degreesToRadians(degrees) {
  const radians = (degrees * Math.PI) / 180;
  return radians;
}

// ==============================
// Відслідковування в реальному часі
// ==============================

function watchLocation() {
  if (watchId === null) {
    watchId = navigator.geolocation.watchPosition(displayLocation, displayError, options);
  }
}

function clearWatch() {
  if (watchId) {
    navigator.geolocation.clearWatch(watchId);
    watchId = null;
  }
}

// ==============================
// ІНДИВІДУАЛЬНЕ ЗАВДАННЯ: карта Leaflet
// ==============================

function showOnMap(position) {
  const latlng = [position.coords.latitude, position.coords.longitude];

  // Перший виклик: створюємо карту з центруванням на власних координатах
  if (map === null) {
    map = L.map('map').setView(latlng, 16);

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);
  } else {
    map.panTo(latlng);
  }

  // Кожне нове визначення місця -> новий маркер з координатами та часом
  const time = new Date(position.timestamp).toLocaleTimeString();
  const popupText =
    `<b>Моє місце розташування</b><br>` +
    `Широта: ${position.coords.latitude}<br>` +
    `Довгота: ${position.coords.longitude}<br>` +
    `Точність: ${position.coords.accuracy} м<br>` +
    `Час визначення: ${time}`;

  L.marker(latlng)
    .addTo(map)
    .bindPopup(popupText)
    .openPopup();
}

// Введення координат пункту призначення + прокрутка карти до нього
function goToDestination() {
  const message = document.getElementById('destination-message');
  const lat = parseFloat(document.getElementById('dest-lat').value.replace(',', '.'));
  const lng = parseFloat(document.getElementById('dest-lng').value.replace(',', '.'));

  if (isNaN(lat) || isNaN(lng) || lat < -90 || lat > 90 || lng < -180 || lng > 180) {
    message.textContent = 'Введіть коректні координати (широта −90…90, довгота −180…180)';
    return;
  }
  if (map === null) {
    message.textContent = 'Карта ще не готова: дочекайтесь визначення вашого місця розташування';
    return;
  }
  message.textContent = '';

  // Маркер пункту призначення (попередній замінюється)
  if (destMarker) {
    map.removeLayer(destMarker);
  }
  destMarker = L.marker([lat, lng])
    .addTo(map)
    .bindPopup(`<b>Пункт призначення</b><br>Широта: ${lat}<br>Довгота: ${lng}`)
    .openPopup();

  // Плавне перемістити карту до пункту призначення
  map.flyTo([lat, lng], 14);
}
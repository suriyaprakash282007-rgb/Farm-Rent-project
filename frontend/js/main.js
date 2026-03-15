// ===== API Configuration =====
const API_BASE_URL = 'http://localhost:3000/api';

// ===== Token Management =====
function getToken() {
  return localStorage.getItem('farmrent_token');
}

function setToken(token) {
  localStorage.setItem('farmrent_token', token);
}

function removeToken() {
  localStorage.removeItem('farmrent_token');
  localStorage.removeItem('farmrent_user');
}

function getUser() {
  try {
    const raw = localStorage.getItem('farmrent_user');
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function setUser(user) {
  localStorage.setItem('farmrent_user', JSON.stringify(user));
}

function getAuthHeaders() {
  const token = getToken();
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  return headers;
}

function isLoggedIn() {
  return !!getToken();
}

// ===== API Call Helper =====
async function apiCall(endpoint, method = 'GET', body = null) {
  const options = {
    method,
    headers: getAuthHeaders(),
  };
  if (body && method !== 'GET') {
    options.body = JSON.stringify(body);
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, options);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || `Request failed with status ${response.status}`);
  }
  return data;
}

// ===== Navbar =====
function updateNavbar() {
  const loggedIn = isLoggedIn();
  const user = getUser();

  const loginLink = document.getElementById('nav-login');
  const profileLink = document.getElementById('nav-profile');
  const logoutLink = document.getElementById('nav-logout');
  const addEquipLink = document.getElementById('nav-add');

  if (loginLink) loginLink.style.display = loggedIn ? 'none' : 'inline-flex';
  if (profileLink) {
    profileLink.style.display = loggedIn ? 'inline-flex' : 'none';
    if (loggedIn && user) profileLink.textContent = `👤 ${user.name.split(' ')[0]}`;
  }
  if (logoutLink) logoutLink.style.display = loggedIn ? 'inline-flex' : 'none';
  if (addEquipLink) addEquipLink.style.display = loggedIn ? 'inline-flex' : 'none';
}

function logout() {
  removeToken();
  window.location.href = 'index.html';
}

// ===== UI Helpers =====
function showAlert(elementId, message, type = 'error') {
  const el = document.getElementById(elementId);
  if (!el) return;
  el.className = `alert alert-${type} show`;
  el.textContent = message;
  el.style.display = 'block';
  if (type === 'success') {
    setTimeout(() => { el.style.display = 'none'; }, 4000);
  }
}

function hideAlert(elementId) {
  const el = document.getElementById(elementId);
  if (el) el.style.display = 'none';
}

function renderStars(rating) {
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5 ? 1 : 0;
  const empty = 5 - full - half;
  return '★'.repeat(full) + (half ? '½' : '') + '☆'.repeat(empty);
}

function formatDate(dateStr) {
  if (!dateStr) return 'N/A';
  return new Date(dateStr).toLocaleDateString('en-IN', {
    day: 'numeric', month: 'short', year: 'numeric',
  });
}

function getTypeBadge(type) {
  const labels = {
    tractor: 'Tractor', harvester: 'Harvester', seeder: 'Seeder',
    pump: 'Pump', sprayer: 'Sprayer', other: 'Other',
  };
  return `<span class="badge badge-${type || 'other'}">${labels[type] || 'Other'}</span>`;
}

function getTypeEmoji(type) {
  const emojis = {
    tractor: '🚜', harvester: '🌾', seeder: '🌱',
    pump: '💧', sprayer: '🪣', other: '🔧',
  };
  return emojis[type] || '🔧';
}

// ===== Mobile menu toggle =====
function initMobileMenu() {
  const toggle = document.getElementById('nav-toggle');
  const nav = document.getElementById('navbar-nav');
  if (toggle && nav) {
    toggle.addEventListener('click', () => nav.classList.toggle('open'));
  }
}

// ===== Demo Data (fallback when API is unavailable) =====
const DEMO_EQUIPMENT = [
  {
    _id: 'demo-1',
    name: 'Mahindra 575 DI Tractor',
    type: 'tractor',
    description: 'Well-maintained 47HP tractor, suitable for ploughing and transport. Full day rental available.',
    photo_url: '',
    price_per_day: 1200,
    village: 'Amravati',
    district: 'Amravati',
    contact_phone: '9876543210',
    whatsapp: '9876543210',
    average_rating: 4.5,
    total_reviews: 12,
    owner: { name: 'Raju Patil' },
    available_dates: [],
    created_at: new Date().toISOString(),
  },
  {
    _id: 'demo-2',
    name: 'New Holland TC5.30 Harvester',
    type: 'harvester',
    description: 'Combine harvester for wheat and paddy. Highly efficient with trained operator included.',
    photo_url: '',
    price_per_day: 3500,
    village: 'Wardha',
    district: 'Wardha',
    contact_phone: '9823456789',
    whatsapp: '9823456789',
    average_rating: 4.8,
    total_reviews: 7,
    owner: { name: 'Suresh Deshmukh' },
    available_dates: [],
    created_at: new Date().toISOString(),
  },
  {
    _id: 'demo-3',
    name: 'Electric Water Pump 5HP',
    type: 'pump',
    description: 'Heavy duty 5HP electric water pump. Ideal for irrigation. 100m cable included.',
    photo_url: '',
    price_per_day: 350,
    village: 'Nagpur',
    district: 'Nagpur',
    contact_phone: '9765432109',
    whatsapp: '9765432109',
    average_rating: 4.2,
    total_reviews: 19,
    owner: { name: 'Priya Shinde' },
    available_dates: [],
    created_at: new Date().toISOString(),
  },
  {
    _id: 'demo-4',
    name: 'Power Tiller Seeder',
    type: 'seeder',
    description: 'Multi-crop seeder attachment. Works with most power tillers. Reduces seeding time by 60%.',
    photo_url: '',
    price_per_day: 600,
    village: 'Yavatmal',
    district: 'Yavatmal',
    contact_phone: '9645321087',
    whatsapp: '9645321087',
    average_rating: 3.9,
    total_reviews: 5,
    owner: { name: 'Anil Khatke' },
    available_dates: [],
    created_at: new Date().toISOString(),
  },
  {
    _id: 'demo-5',
    name: 'Boom Sprayer 500L',
    type: 'sprayer',
    description: 'Tractor-mounted boom sprayer. 500 litre tank with 12m boom. Perfect for large fields.',
    photo_url: '',
    price_per_day: 900,
    village: 'Akola',
    district: 'Akola',
    contact_phone: '9534210876',
    whatsapp: '9534210876',
    average_rating: 4.6,
    total_reviews: 9,
    owner: { name: 'Kavita Gawai' },
    available_dates: [],
    created_at: new Date().toISOString(),
  },
  {
    _id: 'demo-6',
    name: 'Rotavator 7ft',
    type: 'other',
    description: '7-foot rotavator for field preparation. Saves time and fuel. Available with transport.',
    photo_url: '',
    price_per_day: 800,
    village: 'Buldhana',
    district: 'Buldhana',
    contact_phone: '9423109876',
    whatsapp: '9423109876',
    average_rating: 4.1,
    total_reviews: 14,
    owner: { name: 'Vijay Borse' },
    available_dates: [],
    created_at: new Date().toISOString(),
  },
];

// ===== Init =====
document.addEventListener('DOMContentLoaded', () => {
  updateNavbar();
  initMobileMenu();
});

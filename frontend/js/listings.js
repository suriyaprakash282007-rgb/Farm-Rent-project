// listings.js — Equipment listings page logic

let allItems = [];
let filteredItems = [];

// ===== On Page Load =====
document.addEventListener('DOMContentLoaded', () => {
  loadEquipment();
  initFilters();
  initSearch();
});

// ===== Fetch Equipment =====
async function loadEquipment() {
  showLoading(true);
  const params = getFilterParams();
  try {
    const queryStr = new URLSearchParams(params).toString();
    allItems = await apiCall(`/equipment${queryStr ? '?' + queryStr : ''}`);
  } catch (err) {
    console.warn('API unavailable, using demo data:', err.message);
    allItems = DEMO_EQUIPMENT.filter(item => {
      if (params.district && !item.district.toLowerCase().includes(params.district.toLowerCase())) return false;
      if (params.type && item.type !== params.type) return false;
      return true;
    });
  }
  filteredItems = [...allItems];
  applyClientSearch();
  showLoading(false);
}

function getFilterParams() {
  const params = {};
  const districtEl = document.getElementById('filter-district');
  const typeEl = document.getElementById('filter-type');
  if (districtEl && districtEl.value.trim()) params.district = districtEl.value.trim();
  if (typeEl && typeEl.value) params.type = typeEl.value;
  return params;
}

// ===== Render Cards =====
function renderEquipmentCards(items) {
  const grid = document.getElementById('listings-grid');
  if (!grid) return;

  if (!items || items.length === 0) {
    grid.innerHTML = `
      <div class="empty-state" style="grid-column:1/-1">
        <div class="empty-state-icon">🔍</div>
        <h3>No equipment found</h3>
        <p>Try changing your filters or <a href="add-equipment.html">list your own equipment</a>.</p>
      </div>`;
    return;
  }

  grid.innerHTML = items.map(item => {
    const emoji = getTypeEmoji(item.type);
    const photoHtml = item.photo_url
      ? `<img src="${escapeHtml(item.photo_url)}" alt="${escapeHtml(item.name)}" onerror="this.parentElement.innerHTML='${emoji}'">`
      : emoji;

    const stars = item.average_rating > 0
      ? `<span style="color:#f59e0b">${'★'.repeat(Math.floor(item.average_rating))}${'☆'.repeat(5 - Math.floor(item.average_rating))}</span> <span>(${item.total_reviews})</span>`
      : `<span style="color:#ccc">No reviews yet</span>`;

    const ownerName = item.owner && item.owner.name ? item.owner.name : 'Unknown';

    return `
      <div class="card">
        <div class="card-img">${photoHtml}</div>
        <div class="card-body">
          ${getTypeBadge(item.type)}
          <div class="card-title">${escapeHtml(item.name)}</div>
          <div class="card-location">
            <span>📍 ${escapeHtml(item.village)}, ${escapeHtml(item.district)}</span>
          </div>
          <div class="card-location">
            <span>👨‍🌾 ${escapeHtml(ownerName)}</span>
          </div>
          <div class="card-price">₹${item.price_per_day.toLocaleString('en-IN')} <span>/ day</span></div>
        </div>
        <div class="card-footer">
          <div class="card-rating">${stars}</div>
          <a href="booking.html?id=${item._id}" class="btn btn-primary btn-sm">Book Now</a>
        </div>
      </div>`;
  }).join('');
}

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// ===== Filters =====
function initFilters() {
  const districtEl = document.getElementById('filter-district');
  const typeEl = document.getElementById('filter-type');

  if (districtEl) districtEl.addEventListener('change', () => loadEquipment());
  if (typeEl) typeEl.addEventListener('change', () => loadEquipment());

  // Pre-fill from URL params
  const urlParams = new URLSearchParams(window.location.search);
  const search = urlParams.get('search');
  if (search) {
    const searchEl = document.getElementById('search-input');
    if (searchEl) searchEl.value = search;
  }
}

// ===== Client-side search =====
function initSearch() {
  const searchEl = document.getElementById('search-input');
  if (searchEl) {
    searchEl.addEventListener('input', applyClientSearch);
  }
}

function applyClientSearch() {
  const searchEl = document.getElementById('search-input');
  const query = searchEl ? searchEl.value.trim().toLowerCase() : '';

  if (!query) {
    filteredItems = [...allItems];
  } else {
    filteredItems = allItems.filter(item =>
      item.name.toLowerCase().includes(query) ||
      item.description?.toLowerCase().includes(query) ||
      item.village?.toLowerCase().includes(query) ||
      item.district?.toLowerCase().includes(query)
    );
  }
  renderEquipmentCards(filteredItems);
}

// ===== Loading state =====
function showLoading(show) {
  const grid = document.getElementById('listings-grid');
  if (!grid) return;
  if (show) {
    grid.innerHTML = `<div class="loading-state" style="grid-column:1/-1"><div class="spinner"></div><p>Loading equipment...</p></div>`;
  }
}

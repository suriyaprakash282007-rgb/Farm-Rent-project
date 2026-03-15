// booking.js — Booking page logic

let equipmentData = null;
let calendar = null;

document.addEventListener('DOMContentLoaded', async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const equipmentId = urlParams.get('id');

  if (!equipmentId) {
    showBookingError('No equipment selected. <a href="listings.html">Browse listings</a>.');
    return;
  }

  await loadEquipmentDetails(equipmentId);
  initBookingForm(equipmentId);
});

// ===== Load Equipment Details =====
async function loadEquipmentDetails(id) {
  try {
    equipmentData = await apiCall(`/equipment/${id}`);
  } catch (err) {
    // Try demo data
    equipmentData = DEMO_EQUIPMENT.find(e => e._id === id) || null;
    if (!equipmentData) {
      showBookingError('Equipment not found. <a href="listings.html">Back to listings</a>.');
      return;
    }
  }
  renderEquipmentDetails(equipmentData);
  initCalendar(equipmentData);
}

function renderEquipmentDetails(item) {
  const emoji = getTypeEmoji(item.type);
  const photoEl = document.getElementById('detail-photo');
  if (photoEl) {
    if (item.photo_url) {
      photoEl.innerHTML = `<img src="${item.photo_url}" alt="${item.name}" onerror="this.parentElement.innerHTML='${emoji}'">`;
    } else {
      photoEl.textContent = emoji;
    }
  }

  setText('detail-name', item.name);
  const badgeEl = document.getElementById('detail-badge');
  if (badgeEl) badgeEl.innerHTML = getTypeBadge(item.type);
  setText('detail-location', `📍 ${item.village}, ${item.district}`);
  setText('detail-price', `₹${item.price_per_day.toLocaleString('en-IN')}`);

  const ownerName = item.owner && item.owner.name ? item.owner.name : 'Unknown';
  setText('detail-owner', `👨‍🌾 ${ownerName}`);
  setText('detail-phone', `📞 ${item.contact_phone}`);

  if (item.whatsapp) {
    const waEl = document.getElementById('detail-whatsapp');
    if (waEl) {
      waEl.innerHTML = `<a href="https://wa.me/91${item.whatsapp}" target="_blank" style="color:var(--primary)">💬 WhatsApp: ${item.whatsapp}</a>`;
    }
  }

  if (item.description) setText('detail-desc', item.description);

  const ratingEl = document.getElementById('detail-rating');
  if (ratingEl) {
    if (item.average_rating > 0) {
      ratingEl.innerHTML = `<span style="color:#f59e0b">${renderStarsHtml(item.average_rating)}</span> <span style="color:var(--text-light);font-size:0.85rem">(${item.total_reviews} reviews)</span>`;
    } else {
      ratingEl.textContent = 'No reviews yet';
    }
  }
}

function setText(id, val) {
  const el = document.getElementById(id);
  if (el) el.textContent = val;
}

function renderStarsHtml(rating) {
  const full = Math.floor(rating);
  const empty = 5 - full;
  return '★'.repeat(full) + '☆'.repeat(empty);
}

// ===== Calendar =====
function initCalendar(item) {
  const container = document.getElementById('availability-calendar');
  if (!container) return;

  const bookedDates = [];

  calendar = new CalendarWidget(container, {
    availableDates: item.available_dates || [],
    bookedDates,
    mode: 'select',
    onChange: ({ startDate, endDate }) => {
      updateDateDisplay(startDate, endDate, item.price_per_day);
    },
  });
}

function updateDateDisplay(startDate, endDate, pricePerDay) {
  const startEl = document.getElementById('selected-start');
  const endEl = document.getElementById('selected-end');
  const totalEl = document.getElementById('total-price');
  const daysEl = document.getElementById('total-days');

  if (startEl) startEl.textContent = startDate ? formatDate(startDate) : '—';
  if (endEl) endEl.textContent = endDate ? formatDate(endDate) : '—';

  if (startDate && endDate) {
    const days = Math.round((endDate - startDate) / (1000 * 60 * 60 * 24));
    const total = days * pricePerDay;
    if (daysEl) daysEl.textContent = `${days} day${days !== 1 ? 's' : ''}`;
    if (totalEl) totalEl.textContent = `₹${total.toLocaleString('en-IN')}`;
  } else {
    if (daysEl) daysEl.textContent = '—';
    if (totalEl) totalEl.textContent = '₹0';
  }
}

// ===== Booking Form =====
function initBookingForm(equipmentId) {
  if (!isLoggedIn()) {
    const formEl = document.getElementById('booking-form-section');
    if (formEl) {
      formEl.innerHTML = `
        <div class="alert alert-info show" style="display:block">
          🔒 Please <a href="login.html" style="font-weight:700;color:var(--primary)">log in</a> to book this equipment.
        </div>`;
    }
    return;
  }

  const form = document.getElementById('booking-form');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    hideAlert('booking-alert');

    if (!calendar) {
      showAlert('booking-alert', 'Calendar not initialized.', 'error');
      return;
    }

    const { startDate, endDate } = calendar.getSelectedDates();
    if (!startDate || !endDate) {
      showAlert('booking-alert', 'Please select a start and end date on the calendar.', 'error');
      return;
    }
    if (startDate >= endDate) {
      showAlert('booking-alert', 'End date must be after start date.', 'error');
      return;
    }

    const message = document.getElementById('booking-message').value.trim();
    const submitBtn = form.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Submitting...';

    try {
      await apiCall('/bookings', 'POST', {
        equipment_id: equipmentId,
        start_date: startDate.toISOString(),
        end_date: endDate.toISOString(),
        message,
      });
      showAlert('booking-alert', '✅ Booking request sent successfully! The owner will contact you.', 'success');
      form.reset();
      calendar.clearSelection();
      updateDateDisplay(null, null, equipmentData?.price_per_day || 0);
      setTimeout(() => { window.location.href = 'profile.html'; }, 2500);
    } catch (err) {
      showAlert('booking-alert', err.message, 'error');
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Send Booking Request';
    }
  });
}

function showBookingError(msg) {
  const container = document.querySelector('.booking-layout') || document.body;
  container.innerHTML = `<div class="alert alert-error show" style="display:block;margin:2rem">${msg}</div>`;
}

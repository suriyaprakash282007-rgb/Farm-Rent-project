// calendar.js — CalendarWidget class (no external dependencies)

class CalendarWidget {
  constructor(container, options = {}) {
    this.container = typeof container === 'string' ? document.querySelector(container) : container;
    this.availableDates = (options.availableDates || []).map(d => this._toDateKey(new Date(d)));
    this.bookedDates = (options.bookedDates || []).map(d => this._toDateKey(new Date(d)));
    this.mode = options.mode || 'view'; // 'view' | 'select'
    this.onChange = options.onChange || null;

    const now = new Date();
    this.currentYear = now.getFullYear();
    this.currentMonth = now.getMonth();

    this.selectedStart = null;
    this.selectedEnd = null;
    this._selecting = false; // true = awaiting end date

    this.render();
  }

  // ===== Public API =====
  getSelectedDates() {
    return {
      startDate: this.selectedStart ? new Date(this.selectedStart) : null,
      endDate: this.selectedEnd ? new Date(this.selectedEnd) : null,
    };
  }

  setAvailableDates(dates) {
    this.availableDates = dates.map(d => this._toDateKey(new Date(d)));
    this.render();
  }

  clearSelection() {
    this.selectedStart = null;
    this.selectedEnd = null;
    this._selecting = false;
    this.render();
  }

  // ===== Render =====
  render() {
    if (!this.container) return;
    this.container.innerHTML = '';
    this.container.classList.add('calendar-widget');

    const monthNames = ['January','February','March','April','May','June',
                        'July','August','September','October','November','December'];
    const dayNames = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];

    // Header
    const header = document.createElement('div');
    header.className = 'calendar-header';
    header.innerHTML = `
      <button class="cal-nav-btn" id="cal-prev">&#8249;</button>
      <h3>${monthNames[this.currentMonth]} ${this.currentYear}</h3>
      <button class="cal-nav-btn" id="cal-next">&#8250;</button>`;
    this.container.appendChild(header);

    // Grid
    const grid = document.createElement('div');
    grid.className = 'calendar-grid';

    // Day headers
    dayNames.forEach(d => {
      const cell = document.createElement('div');
      cell.className = 'cal-day-header';
      cell.textContent = d;
      grid.appendChild(cell);
    });

    const firstDay = new Date(this.currentYear, this.currentMonth, 1).getDay();
    const daysInMonth = new Date(this.currentYear, this.currentMonth + 1, 0).getDate();
    const today = this._toDateKey(new Date());

    // Empty cells before first day
    for (let i = 0; i < firstDay; i++) {
      const cell = document.createElement('div');
      cell.className = 'cal-day empty';
      grid.appendChild(cell);
    }

    // Day cells
    for (let d = 1; d <= daysInMonth; d++) {
      const dateKey = this._toDateKey(new Date(this.currentYear, this.currentMonth, d));
      const cell = document.createElement('div');
      cell.className = 'cal-day';
      cell.textContent = d;
      cell.dataset.date = dateKey;

      const isPast = dateKey < today;
      const isAvailable = this.availableDates.includes(dateKey);
      const isBooked = this.bookedDates.includes(dateKey);
      const isToday = dateKey === today;
      const isSelectedStart = dateKey === this.selectedStart;
      const isSelectedEnd = dateKey === this.selectedEnd;
      const isInRange = this._isInRange(dateKey);

      if (isToday) cell.classList.add('today');

      if (isSelectedStart || isSelectedEnd) {
        cell.classList.add('selected');
      } else if (isInRange) {
        cell.classList.add('in-range');
      } else if (isBooked) {
        cell.classList.add('booked');
      } else if (isPast) {
        cell.classList.add('past');
      } else if (isAvailable) {
        cell.classList.add('available');
      }

      if (this.mode === 'select' && !isPast && !isBooked) {
        cell.style.cursor = 'pointer';
        cell.addEventListener('click', () => this._handleDayClick(dateKey));
      }

      grid.appendChild(cell);
    }

    this.container.appendChild(grid);

    // Legend
    if (this.mode === 'select') {
      const legend = document.createElement('div');
      legend.className = 'cal-legend';
      legend.innerHTML = `
        <div class="cal-legend-item"><div class="cal-legend-dot" style="background:#d1fae5;border:1px solid #a7f3d0"></div> Available</div>
        <div class="cal-legend-item"><div class="cal-legend-dot" style="background:#fee2e2;border:1px solid #fecaca"></div> Booked</div>
        <div class="cal-legend-item"><div class="cal-legend-dot" style="background:#2563eb"></div> Selected</div>
        <div class="cal-legend-item"><div class="cal-legend-dot" style="background:#bfdbfe"></div> Range</div>`;
      this.container.appendChild(legend);
    } else {
      const legend = document.createElement('div');
      legend.className = 'cal-legend';
      legend.innerHTML = `
        <div class="cal-legend-item"><div class="cal-legend-dot" style="background:#d1fae5;border:1px solid #a7f3d0"></div> Available</div>
        <div class="cal-legend-item"><div class="cal-legend-dot" style="background:#fee2e2;border:1px solid #fecaca"></div> Booked / Unavailable</div>`;
      this.container.appendChild(legend);
    }

    // Navigation events
    this.container.querySelector('#cal-prev').addEventListener('click', () => {
      this.currentMonth--;
      if (this.currentMonth < 0) { this.currentMonth = 11; this.currentYear--; }
      this.render();
    });
    this.container.querySelector('#cal-next').addEventListener('click', () => {
      this.currentMonth++;
      if (this.currentMonth > 11) { this.currentMonth = 0; this.currentYear++; }
      this.render();
    });
  }

  // ===== Private Helpers =====
  _toDateKey(date) {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  }

  _isInRange(dateKey) {
    if (!this.selectedStart || !this.selectedEnd) return false;
    return dateKey > this.selectedStart && dateKey < this.selectedEnd;
  }

  _handleDayClick(dateKey) {
    if (!this._selecting) {
      // First click = start date
      this.selectedStart = dateKey;
      this.selectedEnd = null;
      this._selecting = true;
    } else {
      // Second click = end date
      if (dateKey <= this.selectedStart) {
        // If clicked before or same as start, restart selection
        this.selectedStart = dateKey;
        this.selectedEnd = null;
      } else {
        this.selectedEnd = dateKey;
        this._selecting = false;
        if (this.onChange) {
          this.onChange({
            startDate: new Date(this.selectedStart),
            endDate: new Date(this.selectedEnd),
          });
        }
      }
    }
    this.render();
  }
}

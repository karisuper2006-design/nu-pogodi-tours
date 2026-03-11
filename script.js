// ===== Navbar scroll effect =====
const navbar = document.getElementById('navbar');

window.addEventListener('scroll', () => {
  if (window.scrollY > 60) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
});

// ===== Scroll fade-in animations =====
const fadeElements = document.querySelectorAll('.fade-in');

const fadeObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, index) => {
    if (entry.isIntersecting) {
      setTimeout(() => {
        entry.target.classList.add('visible');
      }, index * 100);
      fadeObserver.unobserve(entry.target);
    }
  });
}, {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
});

fadeElements.forEach(el => fadeObserver.observe(el));

// ===== Smooth scroll for anchor links =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  });
});

// ===== Contact modal: close on overlay click or Escape =====
const contactModal = document.getElementById('contactModal');
if (contactModal) {
  contactModal.addEventListener('click', function (e) {
    if (e.target === contactModal) {
      contactModal.classList.remove('active');
    }
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      contactModal.classList.remove('active');
    }
  });
}

// ===== Dynamic tour dates loading =====
function loadTourDates() {
  // Detect which tour page we're on
  const tour1Container = document.getElementById('tour1-dates');
  const tour2Container = document.getElementById('tour2-dates');

  if (!tour1Container && !tour2Container) return;

  // Use global TOURS_DATA from tours_data.js (works with file:// protocol)
  if (typeof TOURS_DATA === 'undefined') {
    [tour1Container, tour2Container].forEach(c => {
      if (c) {
        c.innerHTML = `
          <div class="date-item" style="justify-content:center; color: var(--text-muted);">
            Не удалось загрузить даты
          </div>`;
      }
    });
    return;
  }

  if (tour1Container && TOURS_DATA.tour1) {
    renderDates(tour1Container, TOURS_DATA.tour1);
  }
  if (tour2Container && TOURS_DATA.tour2) {
    renderDates(tour2Container, TOURS_DATA.tour2);
  }
}

// ===== Dynamic Data Loading with Cache Buster =====
function initDynamicLoading() {
  const script = document.createElement('script');
  // Add timestamp to bypass GitHub Pages 10-min cache
  script.src = 'tours_data.js?t=' + new Date().getTime();
  script.onload = loadTourDates;
  script.onerror = loadTourDates; // Will show "failed to load" if error
  document.head.appendChild(script);
}

function renderDates(container, dates) {
  if (dates.length === 0) {
    container.innerHTML = `
      <div class="date-item" style="justify-content:center; color: var(--text-muted);">
        Нет доступных дат
      </div>`;
    return;
  }

  container.innerHTML = dates.map(item => {
    let icon, statusClass, statusText;

    if (item.spots <= 0) {
      icon = '🔴';
      statusClass = 'sold-out';
      statusText = 'Мест нет';
    } else if (item.spots <= 3) {
      icon = '🟡';
      statusClass = 'few-left';
      statusText = 'Осталось мало';
    } else {
      icon = '🟢';
      statusClass = 'available';
      statusText = 'Есть места';
    }

    return `
      <div class="date-item">
        <div class="date-info">
          <span class="date-icon">${icon}</span>
          <span class="date-text">${item.date}</span>
        </div>
        <span class="date-status ${statusClass}">${statusText}</span>
      </div>`;
  }).join('');
}

// Initialize data loading
initDynamicLoading();

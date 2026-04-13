(function () {
  const path = window.location.pathname;
  // Improved subdir detection: checks if the current path is inside any known subdirectory
  const subdirs = ['courses']; 
  const isSubdir = subdirs.some(dir => path.includes('/' + dir + '/'));
  const base = isSubdir ? '../' : '';

  let loadedCount = 0;
  const TOTAL = 2;

  function onAllLoaded() {
    setupHamburger();
    setupNavHighlight();
    setupTheme();
    setupScrollAnimations();
  }

  function loadFragment(url, targetId, callback) {
    fetch(url)
      .then(r => {
        if (!r.ok) throw new Error('Failed: ' + url);
        return r.text();
      })
      .then(html => {
        const processed = html.replace(/\{\{BASE\}\}/g, base);
        const el = document.getElementById(targetId);
        if (el) el.outerHTML = processed;
        loadedCount++;
        if (loadedCount === TOTAL) onAllLoaded();
        if (callback) callback();
      })
      .catch(err => console.warn(err));
  }

  // Load header & footer
  loadFragment(base + 'includes/header.html', 'site-header');
  loadFragment(base + 'includes/footer.html', 'site-footer');

  // --- Setup Functions ---

  function setupHamburger() {
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    if (hamburger && navLinks) {
      hamburger.addEventListener('click', () => {
        const isActive = navLinks.classList.toggle('active');
        hamburger.setAttribute('aria-expanded', isActive);
        hamburger.innerHTML = isActive ? '✕' : '☰'; // Toggle between burger and X
      });
    }
  }

  function setupNavHighlight() {
    const fileName = path.split('/').pop() || 'index.html';
    const isInCourseDir = path.includes('/courses/');

    document.querySelectorAll('.nav-links a[data-page]').forEach(link => {
      link.classList.remove('active');
      const page = link.getAttribute('data-page');
      
      // Highlight "Courses" if we are in any course detail page
      const isCourseMatch = page === 'courses.html' && isInCourseDir;
      const isExactMatch = page === fileName || (fileName === '' && page === 'index.html');

      if (isExactMatch || isCourseMatch) {
        link.classList.add('active');
      }
    });
  }

  function setupTheme() {
    const savedTheme = localStorage.getItem('cit-theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const theme = savedTheme || (prefersDark ? 'dark' : 'light');
    document.documentElement.setAttribute('data-theme', theme);

    const btn = document.getElementById('theme-toggle');
    if (btn) {
      btn.textContent = theme === 'dark' ? '☀️' : '🌓';
      btn.addEventListener('click', () => {
        const current = document.documentElement.getAttribute('data-theme');
        const next = current === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', next);
        localStorage.setItem('cit-theme', next);
        btn.textContent = next === 'dark' ? '☀️' : '🌓';
      });
    }
  }

  function setupScrollAnimations() {
    // Only run if there are elements to animate
    const animElements = document.querySelectorAll('.animate-fade-up');
    if (animElements.length === 0) return;

    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    animElements.forEach(el => observer.observe(el));
  }
})();


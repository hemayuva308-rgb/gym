/* ══════════════════════════════════════════
   FORGEFIT — Main JavaScript
   Handles: API calls, DOM rendering, UI logic
══════════════════════════════════════════ */

const API = '/api';
let pricingMode = 'monthly';

// ══════════════════════════════════════════
// INIT
// ══════════════════════════════════════════
document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initMobileMenu();
  loadStats();
  loadPrograms();
  loadTrainers();
  loadPricing();
  loadTestimonials();
  initContactForm();
  initNewsletter();
  initMembershipButtons();
  initScrollReveal();
  initFilterTabs();
  initPricingToggle();
});

// ══════════════════════════════════════════
// NAVBAR
// ══════════════════════════════════════════
function initNavbar() {
  const nav = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 40);
  });
}

function initMobileMenu() {
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');
  const mobileClose = document.getElementById('mobileClose');
  if (!hamburger || !mobileMenu) return;

  hamburger.addEventListener('click', () => mobileMenu.classList.add('open'));
  mobileClose.addEventListener('click', () => mobileMenu.classList.remove('open'));
  mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => mobileMenu.classList.remove('open'));
  });
}

// ══════════════════════════════════════════
// LOAD STATS
// ══════════════════════════════════════════
async function loadStats() {
  try {
    const res = await fetch(`${API}/stats`);
    const { data } = await res.json();
    animateCounter('statMembers', data.members, '+');
    animateCounter('statRetention', data.retention, '%');
    animateCounter('statPrograms', data.programs, '+');
    animateCounter('statTrainers', data.trainers);
  } catch (e) {
    console.error('Failed to load stats:', e);
  }
}

function animateCounter(id, target, suffix = '') {
  const el = document.getElementById(id);
  if (!el) return;
  let start = 0;
  const duration = 2000;
  const step = (target / duration) * 16;
  const timer = setInterval(() => {
    start = Math.min(start + step, target);
    el.textContent = Math.floor(start).toLocaleString() + suffix;
    if (start >= target) clearInterval(timer);
  }, 16);
}

// ══════════════════════════════════════════
// LOAD PROGRAMS
// ══════════════════════════════════════════
let allPrograms = [];

async function loadPrograms(category = 'all') {
  const grid = document.getElementById('programsGrid');
  if (!grid) return;

  grid.innerHTML = '<div style="grid-column:1/-1;text-align:center;color:var(--text-muted);padding:40px"><div class="spinner" style="margin:0 auto 12px"></div><br>Loading programs...</div>';

  try {
    const url = category === 'all' ? `${API}/programs` : `${API}/programs?category=${category}`;
    const res = await fetch(url);
    const { data } = await res.json();
    if (category === 'all') allPrograms = data;

    grid.innerHTML = data.map(p => `
      <div class="program-card reveal" data-category="${p.category}">
        <span class="program-icon">${p.icon}</span>
        <div class="program-name">${p.name}</div>
        <p class="program-desc">${p.description}</p>
        <div class="program-meta">
          <span class="program-tag">⏱ ${p.duration}</span>
          <span class="program-tag">📊 ${p.level}</span>
          <span class="program-tag">📅 ${p.sessions}</span>
        </div>
        <div class="program-cta">Explore Program →</div>
      </div>
    `).join('');

    triggerReveal();
  } catch (e) {
    grid.innerHTML = '<div style="grid-column:1/-1;text-align:center;color:var(--text-muted);padding:40px">Failed to load programs. Please refresh.</div>';
  }
}

function initFilterTabs() {
  document.querySelectorAll('.filter-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.filter-tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      loadPrograms(tab.dataset.filter);
    });
  });
}

// ══════════════════════════════════════════
// LOAD TRAINERS
// ══════════════════════════════════════════
async function loadTrainers() {
  const grid = document.getElementById('trainersGrid');
  if (!grid) return;

  try {
    const res = await fetch(`${API}/trainers`);
    const { data } = await res.json();

    grid.innerHTML = data.map(t => `
      <div class="trainer-card reveal">
        <div class="trainer-photo">
          <div class="trainer-photo-placeholder" style="background:linear-gradient(135deg, ${t.color} 0%, #0d0d0d 100%)">
            <div class="trainer-initials">${t.initials}</div>
          </div>
          <div class="trainer-photo-overlay"></div>
          <div class="trainer-hover-overlay">
            <button class="btn btn-primary" onclick="bookTrainer('${t.name}')">Book Session</button>
            <div style="display:flex;gap:8px">
              ${t.certifications.map(c => `<span style="font-size:10px;padding:3px 10px;border-radius:999px;background:rgba(245,244,240,0.1);color:var(--text-secondary)">${c}</span>`).join('')}
            </div>
          </div>
          <div class="trainer-info">
            <div class="trainer-name">${t.name}</div>
            <div class="trainer-spec">${t.specialty}</div>
          </div>
        </div>
        <div class="trainer-footer">
          <span class="trainer-badge">${t.badge}</span>
          <span class="trainer-exp">${t.experience}</span>
        </div>
      </div>
    `).join('');

    triggerReveal();
  } catch (e) {
    console.error('Failed to load trainers:', e);
  }
}

function bookTrainer(name) {
  document.getElementById('goal').value = `Personal training with ${name}`;
  document.getElementById('contact').scrollIntoView({ behavior: 'smooth' });
  showToast(`Booking request for ${name} — fill in your details below!`, 'success');
}

// ══════════════════════════════════════════
// LOAD PRICING
// ══════════════════════════════════════════
let pricingData = [];

async function loadPricing() {
  const grid = document.getElementById('pricingGrid');
  if (!grid) return;

  try {
    const res = await fetch(`${API}/pricing`);
    const { data } = await res.json();
    pricingData = data;
    renderPricing();
  } catch (e) {
    console.error('Failed to load pricing:', e);
  }
}

function renderPricing() {
  const grid = document.getElementById('pricingGrid');
  if (!grid || !pricingData.length) return;

  grid.innerHTML = pricingData.map(plan => `
    <div class="price-card ${plan.featured ? 'featured' : ''} reveal">
      ${plan.featured ? '<div class="popular-badge">Most Popular</div>' : ''}
      <div class="price-name">${plan.name}</div>
      <div class="price-amount">
        <span class="price-currency">$</span>
        <span class="price-number">${plan.price[pricingMode]}</span>
      </div>
      <span class="price-period">per month${pricingMode === 'annual' ? ', billed annually' : ''}</span>
      <div class="price-features">
        ${plan.features.map(f => `
          <div class="price-feature ${f.included ? '' : 'excluded'}">
            <span class="${f.included ? 'check' : 'cross'}">${f.included ? '✓' : '✗'}</span>
            ${f.text}
          </div>
        `).join('')}
      </div>
      <button class="btn ${plan.featured ? 'btn-primary' : 'btn-outline'} btn-full membership-btn"
        data-plan="${plan.name}" data-billing="${pricingMode}">
        ${plan.cta}
      </button>
    </div>
  `).join('');

  initMembershipButtons();
  triggerReveal();
}

function initPricingToggle() {
  document.querySelectorAll('.toggle-option').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.toggle-option').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      pricingMode = btn.dataset.billing;
      renderPricing();
    });
  });
}

// ══════════════════════════════════════════
// MEMBERSHIP SIGN UP
// ══════════════════════════════════════════
function initMembershipButtons() {
  document.querySelectorAll('.membership-btn').forEach(btn => {
    btn.addEventListener('click', async () => {
      const plan = btn.dataset.plan;
      const billing = btn.dataset.billing;
      const name = prompt(`Join ${plan} Plan — Enter your full name:`);
      if (!name) return;
      const email = prompt(`Enter your email address:`);
      if (!email) return;

      btn.disabled = true;
      btn.innerHTML = '<span class="spinner"></span> Processing...';

      try {
        const res = await fetch(`${API}/membership`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, email, plan, billing })
        });
        const data = await res.json();
        showToast(data.message, data.success ? 'success' : 'error');
      } catch (e) {
        showToast('Something went wrong. Please try again.', 'error');
      } finally {
        btn.disabled = false;
        btn.innerHTML = pricingData.find(p => p.name === plan)?.cta || 'Get Started';
      }
    });
  });
}

// ══════════════════════════════════════════
// LOAD TESTIMONIALS
// ══════════════════════════════════════════
async function loadTestimonials() {
  const grid = document.getElementById('testimonialsGrid');
  if (!grid) return;

  try {
    const res = await fetch(`${API}/testimonials`);
    const { data } = await res.json();

    grid.innerHTML = data.map((t, i) => `
      <div class="testi-card ${i === 1 ? 'featured' : ''} reveal">
        <div class="testi-stars">
          ${'<span>★</span>'.repeat(t.rating)}
        </div>
        <p class="testi-quote">"${t.quote}"</p>
        <div class="testi-result">${t.result}</div>
        <div class="testi-author-row">
          <div class="testi-avatar" style="background:${i===0?'#3d1015':i===1?'#0f2218':'#151533'}">
            ${t.name.split(' ').map(n=>n[0]).join('')}
          </div>
          <div>
            <div class="testi-name">${t.name}</div>
            <div class="testi-meta">${t.duration}</div>
          </div>
        </div>
      </div>
    `).join('');

    triggerReveal();
  } catch (e) {
    console.error('Failed to load testimonials:', e);
  }
}

// ══════════════════════════════════════════
// CONTACT FORM
// ══════════════════════════════════════════
function initContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = form.querySelector('[type="submit"]');
    const msgEl = document.getElementById('formMsg');

    const body = {
      firstName: form.firstName.value.trim(),
      lastName: form.lastName.value.trim(),
      email: form.email.value.trim(),
      goal: form.goal.value,
      message: form.message.value.trim()
    };

    btn.disabled = true;
    btn.innerHTML = '<span class="spinner"></span> Sending...';
    msgEl.className = 'form-msg';

    try {
      const res = await fetch(`${API}/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      const data = await res.json();

      msgEl.textContent = data.message;
      msgEl.className = `form-msg ${data.success ? 'success' : 'error'} show`;

      if (data.success) {
        form.reset();
        showToast('Message sent! We\'ll be in touch within 24 hours. 💪', 'success');
      }
    } catch (e) {
      msgEl.textContent = 'Network error. Please try again.';
      msgEl.className = 'form-msg error show';
    } finally {
      btn.disabled = false;
      btn.innerHTML = 'Send Message — Free Consultation';
    }
  });
}

// ══════════════════════════════════════════
// NEWSLETTER
// ══════════════════════════════════════════
function initNewsletter() {
  const form = document.getElementById('newsletterForm');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = form.querySelector('input').value.trim();
    const btn = form.querySelector('button');

    btn.textContent = '...';
    btn.disabled = true;

    try {
      const res = await fetch(`${API}/newsletter`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      const data = await res.json();
      showToast(data.message, data.success ? 'success' : 'error');
      if (data.success) form.reset();
    } catch (e) {
      showToast('Failed to subscribe. Try again.', 'error');
    } finally {
      btn.textContent = 'Subscribe';
      btn.disabled = false;
    }
  });
}

// ══════════════════════════════════════════
// TOAST NOTIFICATION
// ══════════════════════════════════════════
function showToast(message, type = 'success') {
  let toast = document.getElementById('toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toast';
    toast.className = 'toast';
    document.body.appendChild(toast);
  }
  toast.textContent = (type === 'success' ? '✓ ' : '✗ ') + message;
  toast.className = `toast ${type} show`;
  setTimeout(() => { toast.classList.remove('show'); }, 4000);
}

// ══════════════════════════════════════════
// SCROLL REVEAL
// ══════════════════════════════════════════
function initScrollReveal() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => entry.target.classList.add('visible'), i * 80);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}

function triggerReveal() {
  setTimeout(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          setTimeout(() => entry.target.classList.add('visible'), i * 100);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.05 });
    document.querySelectorAll('.reveal:not(.visible)').forEach(el => observer.observe(el));
  }, 50);
}

// ══════════════════════════════════════════
// SMOOTH SCROLL
// ══════════════════════════════════════════
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

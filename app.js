/* ============================================================
   АБУБАКР — Рулевые рейки
   Application logic (Vanilla JS, no dependencies)
   ============================================================ */

(() => {
  'use strict';

  /* ---------- Constants ---------- */
  const PHONE = '+79322224246';           // TODO: заменить на реальный номер
  const WHATSAPP_NUMBER = '+79322224246';  // TODO: заменить на реальный номер
  const YANDEX_MAPS_URL = 'https://yandex.ru/maps/?ll=47.385119%2C42.964060&mode=whatshere&whatshere%5Bpoint%5D=47.385132%2C42.964084&whatshere%5Bzoom%5D=20.534271&z=20';
  const DGIS_URL = 'https://2gis.ru/makhachkala/geo/15903971839421033/47.385128%2C42.964022';

  const WHATSAPP_DEFAULT_TEXT =
`Ас саляму Алейкум.
Я пишу вам с сайта для реставрации рулевой рейки.
Марка авто:
Проблема:`;

  /* ---------- Utility ---------- */
  const $  = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

  function waLink(text) {
    return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
  }
  function telLink() {
    return `tel:${PHONE}`;
  }

  /* ============================================================
     HEADER — scroll shadow
     ============================================================ */
  const header = $('#header');
  window.addEventListener('scroll', () => {
    header.classList.toggle('is-scrolled', window.scrollY > 8);
  }, { passive: true });

  /* ============================================================
     BOTTOM NAV — active state on scroll
     ============================================================ */
  const bnavItems = $$('.bnav-item');
  const sectionIds = bnavItems.map(i => i.dataset.target);
  const sections = sectionIds.map(id => document.getElementById(id)).filter(Boolean);

  function updateBottomNav() {
    let current = sectionIds[0];
    const scrollPos = window.scrollY + window.innerHeight * 0.35;
    sections.forEach(sec => {
      if (sec.offsetTop <= scrollPos) current = sec.id;
    });
    bnavItems.forEach(item => item.classList.toggle('is-active', item.dataset.target === current));
  }
  window.addEventListener('scroll', updateBottomNav, { passive: true });
  updateBottomNav();

  /* ============================================================
     SCROLL REVEAL (Intersection Observer)
     ============================================================ */
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

  function observeReveals(root = document) {
    $$('.reveal', root).forEach((el, i) => {
      el.style.transitionDelay = `${Math.min(i % 4, 3) * 70}ms`;
      revealObserver.observe(el);
    });
  }
  observeReveals();

  /* ============================================================
     RIPPLE EFFECT on buttons
     ============================================================ */
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('.btn');
    if (!btn) return;
    const rect = btn.getBoundingClientRect();
    const ripple = document.createElement('span');
    const size = Math.max(rect.width, rect.height);
    ripple.className = 'ripple';
    ripple.style.width = ripple.style.height = `${size}px`;
    ripple.style.left = `${e.clientX - rect.left - size / 2}px`;
    ripple.style.top = `${e.clientY - rect.top - size / 2}px`;
    btn.appendChild(ripple);
    setTimeout(() => ripple.remove(), 650);
  });

  /* ============================================================
     TOAST
     ============================================================ */
  const toastEl = $('#toast');
  let toastTimer;
  function showToast(msg) {
    clearTimeout(toastTimer);
    toastEl.textContent = msg;
    toastEl.classList.add('is-visible');
    toastTimer = setTimeout(() => toastEl.classList.remove('is-visible'), 2600);
  }

  /* ============================================================
     MODAL SYSTEM (universal)
     ============================================================ */
  const overlay = $('#modalOverlay');
  const modalTitle = $('#modalTitle');
  const modalBody = $('#modalBody');
  const modalActions = $('#modalActions');
  let lastFocused = null;

  const MODAL_CONTENT = {
    'consult': {
      title: 'Напишите нам',
      body: `<p>Опишите марку автомобиля и проблему — мы ответим в WhatsApp в течение 30 минут и подскажем ориентировочную стоимость и сроки ремонта.</p>`,
      actions: () => [
        { label: 'Написать в WhatsApp', cls: 'btn-gold', href: waLink(WHATSAPP_DEFAULT_TEXT) },
        { label: 'Позвонить', cls: 'btn-ghost', href: telLink() },
      ]
    },
    'trust-years': {
      title: '15 лет опыта',
      body: `<p>Более <strong>15 лет</strong> занимаемся ремонтом и восстановлением рулевых реек различных автомобилей. За это время накоплен опыт работы с механическими и гидравлическими рейками практически всех массовых марок, представленных в Махачкале.</p>`,
    },
    'trust-warranty': {
      title: 'Гарантия 6 месяцев',
      body: `<p>На все виды ремонта рулевой рейки предоставляется <strong>гарантия 6 месяцев</strong>. Если в течение гарантийного срока проявится дефект, связанный с выполненным ремонтом, устраняем его бесплатно.</p>`,
    },
    'trust-appointment': {
      title: 'Работа по записи',
      body: `<p>Приём автомобилей осуществляется <strong>по предварительной записи</strong> — это позволяет уделить каждой рейке максимум внимания и не заставлять клиентов ждать в очереди. Запишитесь через WhatsApp или по телефону.</p>`,
      actions: () => [
        { label: 'Записаться в WhatsApp', cls: 'btn-gold', href: waLink(WHATSAPP_DEFAULT_TEXT) },
      ]
    },
    'trust-location': {
      title: 'Махачкала',
      body: `<p>Принимаем автомобили в <strong>Ленинкенте</strong>. Точный адрес мастерской вы можете найти по кнопкам ниже.</p>`,
      actions: () => [
        { label: 'Яндекс Карты', cls: 'btn-ghost', href: YANDEX_MAPS_URL },
        { label: '2ГИС', cls: 'btn-ghost', href: DGIS_URL },
      ]
    },
    'price-mech': {
      title: 'Механическая рейка — 6 000 ₽',
      body: `<p>Ремонт механических рулевых реек без гидроусилителя: разбор, полная промывка всех деталей, замена сухариков (усиление), смазка рулевой рейки, сборка. Устраняем стук на кочках и ваши нервы).</p>
             <p><strong>Срок ремонта:</strong> от 3х до 5 часов.<br><strong>Гарантия:</strong> 6 месяцев.</p>`,
    },
    'price-hydro': {
      title: 'Гидравлическая рейка — 13 000 ₽',
      body: `<p>Полное восстановление гидравлических реек: разбор, полная промывка всех деталей, замена сальников и манжет, замена сухариков (усиление), смазка, сборка. Устраняем течь, стук, и ваши нервы).</p>
             <p><strong>Срок ремонта:</strong> в течении дня.<br><strong>Гарантия:</strong> 6 месяцев.</p>`,
    },
    'price-mount': {
      title: 'Снятие / установка — от 6 000 до 10 000 ₽',
      body: `<p>Аккуратный демонтаж и монтаж рулевой рейки на автомобиле, включая проверку пыльников, тяг и наконечников. После установки рекомендуем сделать развал-схождение.</p>
             <p><strong>Срок:</strong> от 1.5 до 2х часов.</p>`,
    },
  };

  function openModal(key) {
    const data = MODAL_CONTENT[key];
    if (!data) return;
    lastFocused = document.activeElement;
    modalTitle.textContent = data.title;
    modalBody.innerHTML = data.body;
    modalActions.innerHTML = '';

    const actions = typeof data.actions === 'function' ? data.actions() : [];
    actions.forEach(a => {
      const link = document.createElement('a');
      link.className = `btn ${a.cls || 'btn-ghost'}`;
      link.textContent = a.label;
      if (a.scrollTo) {
        link.href = a.scrollTo;
        link.addEventListener('click', (e) => {
          e.preventDefault();
          closeModal();
          setTimeout(() => document.querySelector(a.scrollTo)?.scrollIntoView({ behavior: 'smooth' }), 200);
        });
      } else {
        link.href = a.href || '#';
        link.target = '_blank';
        link.rel = 'noopener';
      }
      modalActions.appendChild(link);
    });

    overlay.classList.add('is-open');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    overlay.classList.remove('is-open');
    document.body.style.overflow = '';
    if (lastFocused) lastFocused.focus({ preventScroll: true });
  }

  document.addEventListener('click', (e) => {
    const trigger = e.target.closest('[data-modal]');
    if (trigger) {
      e.preventDefault();
      openModal(trigger.dataset.modal);
    }
  });
  $('#modalClose').addEventListener('click', closeModal);
  overlay.addEventListener('click', (e) => { if (e.target === overlay) closeModal(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeModal(); });

  /* ============================================================
     STATIC LINKS (WhatsApp / phone / maps)
     ============================================================ */
  const heroWa = $('#heroWhatsapp');
  if (heroWa) heroWa.href = waLink(WHATSAPP_DEFAULT_TEXT);

  const yandexBtn = $('#yandexMapsBtn');
  if (yandexBtn) yandexBtn.href = YANDEX_MAPS_URL;
  const dgisBtn = $('#dgisBtn');
  if (dgisBtn) dgisBtn.href = DGIS_URL;

  /* ============================================================
     CARS CATALOG DATA + RENDER
     ============================================================ */
  const BRANDS = [
    { name: 'Toyota',     models: ['Corolla', 'Camry', 'RAV4', 'Land Cruiser'] },
    { name: 'Nissan',     models: ['Almera', 'Qashqai', 'X-Trail', 'Teana'] },
    { name: 'Mazda',      models: ['Mazda 3', 'Mazda 6', 'CX-5'] },
    { name: 'Renault',    models: ['Logan', 'Duster', 'Sandero'] },
    { name: 'Kia',        models: ['Rio', 'Sportage', 'Ceed', 'Sorento'] },
    { name: 'Hyundai',    models: ['Solaris', 'Creta', 'Tucson', 'Elantra'] },
    { name: 'Volkswagen', models: ['Polo', 'Jetta', 'Tiguan', 'Passat'] },
    { name: 'Skoda',      models: ['Rapid', 'Octavia', 'Kodiaq'] },
    { name: 'Lada',       models: ['Granta', 'Vesta', 'Niva', 'Priora'] },
  ];

  function brandIcon() {
    // Generic automotive line icon reused for every brand card
    return `<svg class="brand-mark-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
      <path d="M4 16V11l2-5h12l2 5v5" stroke-linecap="round" stroke-linejoin="round"/>
      <rect x="2" y="16" width="20" height="4" rx="1"/>
      <circle cx="7" cy="20" r="1.4" fill="currentColor" stroke="none"/>
      <circle cx="17" cy="20" r="1.4" fill="currentColor" stroke="none"/>
    </svg>`;
  }

  const brandGrid = $('#brandGrid');
  BRANDS.forEach((brand, idx) => {
    const card = document.createElement('button');
    card.className = 'brand-card reveal';
    card.dataset.brand = brand.name;
    card.innerHTML = `${brandIcon()}<div class="brand-name">${brand.name}</div>`;
    card.addEventListener('click', () => openBrandModels(brand));
    brandGrid.appendChild(card);
  });
  observeReveals(brandGrid);

  function openBrandModels(brand) {
    lastFocused = document.activeElement;
    modalTitle.textContent = brand.name;
    modalBody.innerHTML = `
      <p>Модели, с которыми мы регулярно работаем:</p>
      <ul style="margin-top:14px; display:flex; flex-direction:column; gap:10px;">
        ${brand.models.map(m => `<li style="padding:12px 16px;background:var(--bg);border-radius:12px;font-weight:600;">${m}</li>`).join('')}
      </ul>`;
    modalActions.innerHTML = '';
    const link = document.createElement('a');
    link.className = '';
    modalActions.appendChild(link);
    overlay.classList.add('is-open');
    document.body.style.overflow = 'hidden';
  }

  /* ============================================================
     REVIEWS DATA + RENDER
     ============================================================ */
  const REVIEWS = [
    { name: 'Магомедов.',  car: 'Hyundai Solaris', text: 'Рейка гудела и подтекала — заменили сальники, всё сухо и тихо уже полгода. Сделали быстро, в срок.' },
    { name: 'Инкогнито.',    car: 'Lada Vesta', text: 'Был сильный люфт руля. Разобрали, показали износ, поменяли втулки. Руль стал как новый.' },
    { name: 'Мурад.',   car: 'Toyota Camry', text: 'Обратился по гарантии через 4 месяца — приняли без вопросов и оперативно всё поправили.' },
    { name: 'УМ.',   car: 'Lada Vesta', text: 'Мастер своего дела, все сделал качественно и быстро).' },
  ];

  const reviewGrid = $('#reviewGrid');
  REVIEWS.forEach(r => {
    const initials = r.name.split(' ').map(w => w[0]).join('').toUpperCase();
    const div = document.createElement('div');
    div.className = 'card review-card reveal';
    div.innerHTML = `
      <div class="review-stars">
        ${'★'.repeat(5).split('').map(() => `<svg viewBox="0 0 20 20" fill="#C9A227"><path d="M10 1l2.6 5.9 6.4.6-4.8 4.3 1.4 6.2L10 14.9l-5.6 3.1 1.4-6.2L1 7.5l6.4-.6z"/></svg>`).join('')}
      </div>
      <p class="review-text">${r.text}</p>
      <div class="review-foot">
        <div class="review-avatar">${initials}</div>
        <div>
          <div class="review-name">${r.name}</div>
          <div class="review-car">${r.car}</div>
        </div>
      </div>`;
    reviewGrid.appendChild(div);
  });
  observeReveals(reviewGrid);

  /* ============================================================
     FOOTER YEAR
     ============================================================ */
  $('#year').textContent = new Date().getFullYear();

  /* ============================================================
     PWA — service worker registration
     ============================================================ */
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('service-worker.js').catch(() => {
        /* fails silently if offline/sandboxed — non-critical */
      });
    });
  }

})();

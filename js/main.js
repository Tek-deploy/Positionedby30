/* Positioned by 30 — shared site script (home, coaching and prayers pages). */

/*
 * Action destinations. When a link is filled in, the matching buttons open it
 * in a new tab. While a link is empty, the buttons show the "Coming soon" dialog.
 */
const P30_LINKS = {
  apply: '',   // Coaching Mastermind application form
  sponsor: '', // Parent sponsorship form
  prayers: 'https://3cb8eebc.sibforms.com/serve/MUIFAE2jM5fmZiIMbhc7zsF5X0QnzBs_SFa9UtLQ5ibEwR4m_mr6Kultp1-YvYe30do0m47EwsazVbHnuX9MOc672wZUXZubuqTMhXzZL3t_JHY9_sLL4_Pmp0Fow1nmsynpmep50nFzRcg27utIuNR1iXCSd4rPVjakyvzybkII3N-B-AA7jI1Lqvf0Z6JEyjgQdS-VNukWCRXSuw=='
};

const CONTACT_EMAIL = 'work.ibppractitioners@gmail.com';

/* Copy shown in the Coming Soon dialog for each action. */
const COMING_SOON = {
  apply: {
    eyebrow: 'The Alignment Coaching Mastermind',
    title: 'Applications open <em>soon.</em>',
    copy: 'We are preparing the next 6-week cohort. Each intake is capped at around 15 participants to preserve the depth of counseling and personal review.',
    copy2: 'While you wait, join young adults across the world at the monthly Global Alignment Prayers.',
    subject: 'Coaching Mastermind: notify me when applications open'
  },
  prayers: {
    eyebrow: 'The P30 Global Alignment Prayers',
    title: 'Registration opens <em>soon.</em>',
    copy: 'Registration for the Global Alignment Prayers will open shortly.',
    copy2: '',
    subject: 'Global Alignment Prayers: notify me when registration opens'
  },
  sponsor: {
    eyebrow: 'Parent sponsorship',
    title: 'Sponsorship opens <em>soon.</em>',
    copy: 'Sponsorship for The Alignment Fellowship opens with the next cohort. Places are capped at around 15 participants per intake.',
    copy2: 'Write to us and we will let you know as soon as sponsorship opens.',
    subject: 'Parent sponsorship: notify me when it opens'
  }
};

/* ---------- Coming Soon dialog ---------- */
const soonDialog = document.getElementById('coming-soon');
let lastTrigger = null;

function openComingSoon(type, trigger) {
  const content = COMING_SOON[type] || COMING_SOON.apply;
  soonDialog.querySelector('[data-soon="eyebrow"]').textContent = content.eyebrow;
  soonDialog.querySelector('[data-soon="title"]').innerHTML = content.title;
  soonDialog.querySelector('[data-soon="copy"]').textContent = content.copy;

  const copy2 = soonDialog.querySelector('[data-soon="copy2"]');
  copy2.textContent = content.copy2;
  copy2.hidden = !content.copy2;

  // Only suggest the prayers when they are not what the visitor just tried to reach.
  const prayersLink = soonDialog.querySelector('[data-soon="prayers"]');
  prayersLink.hidden = type === 'prayers' || type === 'sponsor';

  soonDialog.querySelector('[data-soon="notify"]').href =
    'mailto:' + CONTACT_EMAIL + '?subject=' + encodeURIComponent(content.subject);

  lastTrigger = trigger;
  soonDialog.showModal();
  document.body.style.overflow = 'hidden';
}

if (soonDialog) {
  soonDialog.querySelectorAll('[data-close-dialog]').forEach(btn =>
    btn.addEventListener('click', () => soonDialog.close())
  );
  // Close when clicking the backdrop.
  soonDialog.addEventListener('click', event => {
    if (event.target !== soonDialog) return;
    const r = soonDialog.getBoundingClientRect();
    if (event.clientX < r.left || event.clientX > r.right || event.clientY < r.top || event.clientY > r.bottom) {
      soonDialog.close();
    }
  });
  soonDialog.addEventListener('close', () => {
    document.body.style.overflow = '';
    if (lastTrigger) lastTrigger.focus();
  });
}

document.querySelectorAll('[data-action]').forEach(trigger =>
  trigger.addEventListener('click', event => {
    const type = trigger.dataset.action;
    const destination = P30_LINKS[type];
    event.preventDefault();
    if (destination) {
      window.open(destination, '_blank', 'noopener,noreferrer');
      return;
    }
    if (soonDialog) openComingSoon(type, trigger);
  })
);

/* ---------- Mobile menu ---------- */
const menuToggle = document.querySelector('.menu-toggle');
const nav = document.getElementById('main-nav');

function closeMenu() {
  nav.classList.remove('open');
  menuToggle.setAttribute('aria-expanded', 'false');
  menuToggle.textContent = 'Menu +';
}

if (menuToggle && nav) {
  menuToggle.addEventListener('click', () => {
    const isOpen = menuToggle.getAttribute('aria-expanded') !== 'true';
    nav.classList.toggle('open', isOpen);
    menuToggle.setAttribute('aria-expanded', String(isOpen));
    menuToggle.textContent = isOpen ? 'Close −' : 'Menu +';
  });
  nav.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && nav.classList.contains('open')) {
      closeMenu();
      menuToggle.focus();
    }
  });
}

/* ---------- "A Special Word to Parents" panel (home page) ---------- */
const parents = document.getElementById('parents');
if (parents) {
  const openParents = () => { parents.open = true; };
  document.querySelectorAll('[data-open-parents]').forEach(link => link.addEventListener('click', openParents));
  if (location.hash === '#parents') openParents();
  window.addEventListener('hashchange', () => { if (location.hash === '#parents') openParents(); });
}

/* ---------- Clean links to home-page sections (/whyp30, /lettertoparents) ----------
 * netlify.toml serves index.html at these paths; this scrolls to the matching section.
 * When previewing locally (no Netlify), the links fall back to index.html#section.
 */
const SECTION_ROUTES = { '/whyp30': 'why', '/lettertoparents': 'parents', '/letter-to-parents': 'parents' };
const isLocalPreview = location.protocol === 'file:' || ['localhost', '127.0.0.1', ''].includes(location.hostname);

function goToSection(id, smooth) {
  const target = document.getElementById(id);
  if (!target) return;
  const scroll = () => target.scrollIntoView({ behavior: smooth ? 'smooth' : 'instant', block: 'start' });
  if (target.tagName === 'DETAILS' && !target.open) {
    // Opening the panel changes the page height; scroll once the browser has laid it out,
    // otherwise its scroll anchoring cancels the scroll.
    target.open = true;
    requestAnimationFrame(() => requestAnimationFrame(scroll));
  } else {
    scroll();
  }
}

const currentRoute = location.pathname.replace(/\/+$/, '');
if (SECTION_ROUTES[currentRoute]) {
  if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
  window.addEventListener('load', () => goToSection(SECTION_ROUTES[currentRoute], false));
}

document.querySelectorAll('a[href^="/"]').forEach(link => {
  const path = link.getAttribute('href');
  const id = SECTION_ROUTES[path];
  if (!id) return;
  const onHomePage = Boolean(document.getElementById(id));
  if (onHomePage) {
    // Already on the home page: scroll there and show the clean address.
    link.addEventListener('click', event => {
      event.preventDefault();
      if (!isLocalPreview) history.pushState(null, '', path);
      goToSection(id, true);
    });
  } else if (isLocalPreview) {
    link.setAttribute('href', 'index.html#' + id);
  }
});

window.addEventListener('popstate', () => {
  const id = SECTION_ROUTES[location.pathname.replace(/\/+$/, '')];
  if (id) goToSection(id, false);
});

/* ---------- Career track tabs (coaching page) ---------- */
const tabs = [...document.querySelectorAll('.track-tab')];

function selectTrack(tab) {
  tabs.forEach(item => {
    const selected = item === tab;
    item.setAttribute('aria-selected', String(selected));
    item.tabIndex = selected ? 0 : -1;
    document.getElementById(item.getAttribute('aria-controls')).hidden = !selected;
  });
}

tabs.forEach((tab, index) => {
  tab.addEventListener('click', () => selectTrack(tab));
  tab.addEventListener('keydown', event => {
    let next;
    if (event.key === 'ArrowRight') next = (index + 1) % tabs.length;
    else if (event.key === 'ArrowLeft') next = (index + tabs.length - 1) % tabs.length;
    else if (event.key === 'Home') next = 0;
    else if (event.key === 'End') next = tabs.length - 1;
    else return;
    event.preventDefault();
    selectTrack(tabs[next]);
    tabs[next].focus();
  });
});

/* ---------- Reading progress bar ---------- */
const readingProgress = document.getElementById('reading-progress');
let progressPending = false;

function updateReadingProgress() {
  if (readingProgress) {
    const range = document.documentElement.scrollHeight - window.innerHeight;
    const ratio = range > 0 ? Math.min(1, Math.max(0, window.scrollY / range)) : 0;
    readingProgress.style.transform = 'scaleX(' + ratio + ')';
  }
  progressPending = false;
}

window.addEventListener('scroll', () => {
  if (!progressPending) {
    progressPending = true;
    requestAnimationFrame(updateReadingProgress);
  }
}, { passive: true });
window.addEventListener('resize', updateReadingProgress);
updateReadingProgress();

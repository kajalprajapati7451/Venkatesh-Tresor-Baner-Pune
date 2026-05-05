/* ══════════════════════════════════════════
   VENKATESH TRESOR — script.js
══════════════════════════════════════════ */

/* ── Captcha ── */
let heroCaptchaAnswer = 0;
let contactCaptchaAnswer = 0;

const OPERATORS = ['+', '-', '×'];

function generateCaptcha(inputId, labelId) {
  const a = Math.floor(Math.random() * 9) + 1;
  const b = Math.floor(Math.random() * 9) + 1;
  const op = OPERATORS[Math.floor(Math.random() * OPERATORS.length)];
  let answer;
  if (op === '+') answer = a + b;
  else if (op === '-') answer = a - b;
  else answer = a * b;
  document.getElementById(labelId).textContent = `Verify: What is ${a} ${op} ${b}?`;
  document.getElementById(inputId).value = '';
  return answer;
}

/* ── Validation helpers ── */
function isValidName(val) {
  return val.trim().length >= 2;
}

function isValidPhone(val) {
  const digits = val.replace(/[\s\-\+]/g, '');
  return /^[6-9]\d{9}$/.test(digits.slice(-10));
}

/* ── Toast ── */
function showToast(msg) {
  const toast = document.getElementById('toast');
  const msgEl = document.getElementById('toastMsg');
  if (msgEl) msgEl.textContent = msg || 'Thank you! Our advisor will call you shortly.';
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 4500);
}

/* ── Field error helpers ── */
function setError(inputId, errId, msg) {
  const el = document.getElementById(inputId);
  const err = document.getElementById(errId);
  if (el) el.classList.add('error');
  if (err) err.textContent = msg;
}

function clearErrors(ids) {
  ids.forEach(({ inputId, errId }) => {
    const el = document.getElementById(inputId);
    const err = document.getElementById(errId);
    if (el) el.classList.remove('error');
    if (err) err.textContent = '';
  });
}

/* ── Navbar scroll ── */
window.addEventListener('scroll', () => {
  const nav = document.getElementById('navbar');
  if (nav) nav.classList.toggle('scrolled', window.scrollY > 50);
});

/* ── Hamburger menu ── */
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');

if (hamburger && navLinks) {
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    navLinks.classList.toggle('open');
  });

  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      navLinks.classList.remove('open');
    });
  });
}

/* ── Hero background parallax load ── */
const heroBg = document.querySelector('.hero-bg');
if (heroBg) {
  setTimeout(() => heroBg.classList.add('loaded'), 80);
}

/* ── Scroll animations (IntersectionObserver) ── */
const animObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      animObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('[data-animate]').forEach(el => animObserver.observe(el));

/* ══════════════════════════════
   HERO FORM
══════════════════════════════ */
const heroForm = document.getElementById('heroForm');

if (heroForm) {
  heroCaptchaAnswer = generateCaptcha('captchaAnswer', 'captchaQuestion');

  heroForm.addEventListener('submit', function (e) {
    e.preventDefault();

    const name = document.getElementById('heroName').value;
    const phone = document.getElementById('heroPhone').value;
    const captchaInput = parseInt(document.getElementById('captchaAnswer').value, 10);

    clearErrors([
      { inputId: 'heroName',      errId: 'heroNameErr' },
      { inputId: 'heroPhone',     errId: 'heroPhoneErr' },
      { inputId: 'captchaAnswer', errId: 'captchaErr' },
    ]);

    let valid = true;

    if (!isValidName(name)) {
      setError('heroName', 'heroNameErr', 'Please enter your full name (min 2 characters).');
      valid = false;
    }

    if (!isValidPhone(phone)) {
      setError('heroPhone', 'heroPhoneErr', 'Enter a valid 10-digit Indian mobile number.');
      valid = false;
    }

    if (isNaN(captchaInput) || captchaInput !== heroCaptchaAnswer) {
      setError('captchaAnswer', 'captchaErr', 'Incorrect answer. Please try again.');
      heroCaptchaAnswer = generateCaptcha('captchaAnswer', 'captchaQuestion');
      valid = false;
    }

    if (!valid) return;

    showToast('Thank you! Our advisor will call you shortly.');
    heroForm.reset();
    heroCaptchaAnswer = generateCaptcha('captchaAnswer', 'captchaQuestion');
  });
}

/* ══════════════════════════════
   CONTACT FORM
══════════════════════════════ */
const contactForm = document.getElementById('contactForm');

if (contactForm) {
  contactCaptchaAnswer = generateCaptcha('captchaAnswer2', 'captchaQuestion2');

  contactForm.addEventListener('submit', function (e) {
    e.preventDefault();

    const name = document.getElementById('cName').value;
    const phone = document.getElementById('cPhone').value;
    const captchaInput = parseInt(document.getElementById('captchaAnswer2').value, 10);
    const consent = document.getElementById('consent').checked;

    clearErrors([
      { inputId: 'cName',          errId: 'cNameErr' },
      { inputId: 'cPhone',         errId: 'cPhoneErr' },
      { inputId: 'captchaAnswer2', errId: 'captchaErr2' },
      { inputId: 'consent',        errId: 'consentErr' },
    ]);

    let valid = true;

    if (!isValidName(name)) {
      setError('cName', 'cNameErr', 'Please enter your full name (min 2 characters).');
      valid = false;
    }

    if (!isValidPhone(phone)) {
      setError('cPhone', 'cPhoneErr', 'Enter a valid 10-digit Indian mobile number.');
      valid = false;
    }

    if (isNaN(captchaInput) || captchaInput !== contactCaptchaAnswer) {
      setError('captchaAnswer2', 'captchaErr2', 'Incorrect answer. Please try again.');
      contactCaptchaAnswer = generateCaptcha('captchaAnswer2', 'captchaQuestion2');
      valid = false;
    }

    if (!consent) {
      document.getElementById('consentErr').textContent = 'Please accept the Privacy Policy to continue.';
      valid = false;
    }

    if (!valid) return;

    showToast('Enquiry submitted! We\'ll connect within 30 minutes.');
    contactForm.reset();
    contactCaptchaAnswer = generateCaptcha('captchaAnswer2', 'captchaQuestion2');
  });
}

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

/* ══════════════════════════════
   FAQ ACCORDION INTERACTIVITY
══════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {
  const faqItems = document.querySelectorAll('.faq-item');
  
  faqItems.forEach(item => {
    const trigger = item.querySelector('.faq-trigger');
    const panel = item.querySelector('.faq-panel');
    
    if (trigger && panel) {
      trigger.addEventListener('click', () => {
        const isActive = item.classList.contains('active');
        
        // Close all other FAQs to keep it tidy
        faqItems.forEach(otherItem => {
          if (otherItem !== item) {
            otherItem.classList.remove('active');
            const otherPanel = otherItem.querySelector('.faq-panel');
            if (otherPanel) {
              otherPanel.style.maxHeight = null;
            }
          }
        });
        
        // Toggle current FAQ panel
        if (isActive) {
          item.classList.remove('active');
          panel.style.maxHeight = null;
        } else {
          item.classList.add('active');
          panel.style.maxHeight = panel.scrollHeight + 'px';
        }
      });
    }
  });
});

/* ══════════════════════════════
   GALLERY & LIGHTBOX FUNCTIONALITY
══════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-item');

  // Filter gallery items
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Toggle active state on buttons
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      galleryItems.forEach(item => {
        const itemCategory = item.getAttribute('data-category');
        if (filterValue === 'all' || itemCategory === filterValue) {
          item.style.display = 'block';
          // Trigger smooth fade in
          setTimeout(() => {
            item.style.opacity = '1';
            item.style.transform = 'scale(1)';
          }, 20);
        } else {
          item.style.opacity = '0';
          item.style.transform = 'scale(0.95)';
          // Hide after transition
          setTimeout(() => {
            item.style.display = 'none';
          }, 300);
        }
      });
    });
  });

  // Lightbox Modal code
  const lightboxModal = document.getElementById('lightboxModal');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxCaption = document.getElementById('lightboxCaption');
  const lightboxClose = document.getElementById('lightboxClose');
  const lightboxPrev = document.getElementById('lightboxPrev');
  const lightboxNext = document.getElementById('lightboxNext');
  
  if (!lightboxModal) return;

  let currentImages = [];
  let currentIndex = 0;

  function openLightbox(index, visibleItems) {
    currentImages = Array.from(visibleItems).map(item => {
      const img = item.querySelector('img');
      const titleEl = item.querySelector('.gallery-item-info h4');
      const categoryEl = item.querySelector('.gallery-item-info p');
      return {
        src: img.getAttribute('src'),
        alt: img.getAttribute('alt') || '',
        title: titleEl ? titleEl.textContent : '',
        category: categoryEl ? categoryEl.textContent : ''
      };
    });
    currentIndex = index;
    updateLightbox();
    lightboxModal.classList.add('open');
    lightboxModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function updateLightbox() {
    if (currentImages.length === 0) return;
    const imgData = currentImages[currentIndex];
    
    // Smooth transition between images
    lightboxImg.style.opacity = '0';
    lightboxImg.style.transform = 'scale(0.97)';
    
    setTimeout(() => {
      lightboxImg.src = imgData.src;
      lightboxImg.alt = imgData.alt;
      lightboxCaption.innerHTML = `<h4>${imgData.title}</h4><p>${imgData.category}</p>`;
      
      // Fade back in
      setTimeout(() => {
        lightboxImg.style.opacity = '1';
        lightboxImg.style.transform = 'scale(1)';
      }, 50);
    }, 150);
  }

  function closeLightbox() {
    lightboxModal.classList.remove('open');
    lightboxModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  // Bind click handlers to gallery items
  galleryItems.forEach(item => {
    const wrap = item.querySelector('.gallery-img-wrap');
    if (wrap) {
      wrap.addEventListener('click', () => {
        // Collect only the visible gallery items
        const visibleItems = Array.from(galleryItems).filter(el => {
          return window.getComputedStyle(el).display !== 'none';
        });
        const visibleIndex = visibleItems.indexOf(item);
        if (visibleIndex !== -1) {
          openLightbox(visibleIndex, visibleItems);
        }
      });
    }
  });

  if (lightboxClose) {
    lightboxClose.addEventListener('click', closeLightbox);
  }

  if (lightboxPrev) {
    lightboxPrev.addEventListener('click', (e) => {
      e.stopPropagation();
      if (currentImages.length > 0) {
        currentIndex = (currentIndex - 1 + currentImages.length) % currentImages.length;
        updateLightbox();
      }
    });
  }

  if (lightboxNext) {
    lightboxNext.addEventListener('click', (e) => {
      e.stopPropagation();
      if (currentImages.length > 0) {
        currentIndex = (currentIndex + 1) % currentImages.length;
        updateLightbox();
      }
    });
  }

  // Close lightbox on clicking outside container
  lightboxModal.addEventListener('click', (e) => {
    if (e.target === lightboxModal) {
      closeLightbox();
    }
  });

  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (!lightboxModal.classList.contains('open')) return;
    if (e.key === 'Escape') {
      closeLightbox();
    } else if (e.key === 'ArrowLeft') {
      if (lightboxPrev) lightboxPrev.click();
    } else if (e.key === 'ArrowRight') {
      if (lightboxNext) lightboxNext.click();
    }
  });
});

/* ══════════════════════════════
   AMENITIES SLIDER FUNCTIONALITY
 ══════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {
  const track = document.getElementById('amenityTrack');
  const prevBtn = document.getElementById('amenityPrev');
  const nextBtn = document.getElementById('amenityNext');
  const dotsContainer = document.getElementById('amenityDots');
  
  if (!track || !prevBtn || !nextBtn || !dotsContainer) return;

  const cards = Array.from(track.querySelectorAll('.amenity-slide-card'));
  let slideIndex = 0;
  
  // Calculate total steps based on screen size
  function getVisibleCardsCount() {
    const width = window.innerWidth;
    if (width > 992) return 3; // Desktop
    if (width > 768) return 2; // Tablet
    return 1; // Mobile (handled by CSS scroll-snap)
  }

  function getMaxIndex() {
    const visibleCards = getVisibleCardsCount();
    return Math.max(0, cards.length - visibleCards);
  }

  // Create dots based on max index + 1
  function createDots() {
    dotsContainer.innerHTML = '';
    const visibleCards = getVisibleCardsCount();
    
    // For mobile, we have cards.length dots because of single-card snap scrolling
    const dotsCount = window.innerWidth <= 768 ? cards.length : cards.length - visibleCards + 1;
    
    for (let i = 0; i < dotsCount; i++) {
      const dot = document.createElement('div');
      dot.classList.add('slider-dot');
      if (i === 0) dot.classList.add('active');
      dot.addEventListener('click', () => {
        if (window.innerWidth <= 768) {
          // In mobile, scroll viewport directly
          const viewport = document.getElementById('amenityViewport');
          if (viewport) {
            const cardWidth = cards[0].getBoundingClientRect().width + 16; // 16px gap
            viewport.scrollTo({
              left: i * cardWidth,
              behavior: 'smooth'
            });
          }
        } else {
          slideIndex = i;
          updateSlider();
        }
      });
      dotsContainer.appendChild(dot);
    }
  }

  function updateSlider() {
    const maxIdx = getMaxIndex();
    if (slideIndex > maxIdx) slideIndex = maxIdx;
    if (slideIndex < 0) slideIndex = 0;

    // Slide distance
    const cardWidth = cards[0].getBoundingClientRect().width;
    const gap = 24; // 24px gap in css
    const translateDist = slideIndex * (cardWidth + gap);
    
    track.style.transform = `translateX(-${translateDist}px)`;
    
    // Update navigation button states
    prevBtn.classList.toggle('disabled', slideIndex === 0);
    nextBtn.classList.toggle('disabled', slideIndex === maxIdx);
    
    // Update dots
    const dots = dotsContainer.querySelectorAll('.slider-dot');
    dots.forEach((dot, idx) => {
      dot.classList.toggle('active', idx === slideIndex);
    });
  }

  // Navigation clicks
  prevBtn.addEventListener('click', () => {
    if (slideIndex > 0) {
      slideIndex--;
      updateSlider();
    }
  });

  nextBtn.addEventListener('click', () => {
    if (slideIndex < getMaxIndex()) {
      slideIndex++;
      updateSlider();
    }
  });

  // Track scroll on mobile viewports for dots syncing
  const viewport = document.getElementById('amenityViewport');
  if (viewport) {
    let scrollTimeout;
    viewport.addEventListener('scroll', () => {
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        if (window.innerWidth <= 768) {
          const cardWidth = cards[0].getBoundingClientRect().width + 16;
          const currentScroll = viewport.scrollLeft;
          const activeDotIdx = Math.round(currentScroll / cardWidth);
          
          const dots = dotsContainer.querySelectorAll('.slider-dot');
          dots.forEach((dot, idx) => {
            dot.classList.toggle('active', idx === activeDotIdx);
          });
        }
      }, 100);
    });
  }

  // Handle window resize
  window.addEventListener('resize', () => {
    createDots();
    if (window.innerWidth > 768) {
      slideIndex = Math.min(slideIndex, getMaxIndex());
      updateSlider();
    } else {
      track.style.transform = 'none';
    }
  });

  // Init
  createDots();
  updateSlider();
});

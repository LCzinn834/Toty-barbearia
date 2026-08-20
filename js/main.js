/**
 * TOTY BARBEARIA - SCRIPTS PRINCIPAIS
 * Mobile-First, Touch Swipes, Lightbox, LGPD e Interações
 */

document.addEventListener('DOMContentLoaded', () => {
  initHeader();
  initMobileNav();
  initScrollSpy();
  initTestimonialCarousel();
  initLightbox();
  initFAQ();
  initCopyAddress();
  initCookieBanner();
  initScrollReveal();
  setCurrentYear();
});

/* --------------------------------------------------------------------------
   1. Header Scroll Behavior
   -------------------------------------------------------------------------- */
function initHeader() {
  const header = document.querySelector('.header');
  if (!header) return;

  const handleScroll = () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();
}

/* --------------------------------------------------------------------------
   2. Mobile Navigation Drawer
   -------------------------------------------------------------------------- */
function initMobileNav() {
  const toggleBtn = document.querySelector('.menu-toggle');
  const mobileNav = document.querySelector('.mobile-nav');
  const mobileLinks = document.querySelectorAll('.mobile-nav-link');

  if (!toggleBtn || !mobileNav) return;

  const toggleNav = () => {
    const isOpen = mobileNav.classList.contains('open');
    toggleBtn.classList.toggle('active', !isOpen);
    mobileNav.classList.toggle('open', !isOpen);
    document.body.style.overflow = isOpen ? '' : 'hidden';
  };

  toggleBtn.addEventListener('click', toggleNav);

  mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
      toggleBtn.classList.remove('active');
      mobileNav.classList.remove('open');
      document.body.style.overflow = '';
    });
  });
}

/* --------------------------------------------------------------------------
   3. ScrollSpy (Active Nav Links)
   -------------------------------------------------------------------------- */
function initScrollSpy() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link, .mobile-nav-link');

  if (!sections.length || !navLinks.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          } else if (link.getAttribute('href')?.startsWith('#')) {
            link.classList.remove('active');
          }
        });
      }
    });
  }, {
    rootMargin: '-20% 0px -60% 0px',
    threshold: 0.1
  });

  sections.forEach(sec => observer.observe(sec));
}

/* --------------------------------------------------------------------------
   4. Testimonial Carousel (Touch Swipe + Navigation)
   -------------------------------------------------------------------------- */
function initTestimonialCarousel() {
  const track = document.querySelector('.carousel-track');
  const slides = document.querySelectorAll('.testimonial-card');
  const prevBtn = document.querySelector('.carousel-btn.prev');
  const nextBtn = document.querySelector('.carousel-btn.next');
  const dots = document.querySelectorAll('.carousel-dot');

  if (!track || !slides.length) return;

  let currentIndex = 0;
  const totalSlides = slides.length;
  let startX = 0;
  let currentX = 0;
  let isDragging = false;

  const updateCarousel = (index) => {
    currentIndex = (index + totalSlides) % totalSlides;
    track.style.transform = `translateX(-${currentIndex * 100}%)`;

    dots.forEach((dot, idx) => {
      dot.classList.toggle('active', idx === currentIndex);
    });
  };

  if (prevBtn) {
    prevBtn.addEventListener('click', () => updateCarousel(currentIndex - 1));
  }
  if (nextBtn) {
    nextBtn.addEventListener('click', () => updateCarousel(currentIndex + 1));
  }

  dots.forEach(dot => {
    dot.addEventListener('click', (e) => {
      const idx = parseInt(e.target.dataset.index, 10);
      updateCarousel(idx);
    });
  });

  // Touch Support
  track.addEventListener('touchstart', (e) => {
    startX = e.touches[0].clientX;
    isDragging = true;
  }, { passive: true });

  track.addEventListener('touchmove', (e) => {
    if (!isDragging) return;
    currentX = e.touches[0].clientX;
  }, { passive: true });

  track.addEventListener('touchend', () => {
    if (!isDragging) return;
    const diff = startX - currentX;
    if (Math.abs(diff) > 40) {
      if (diff > 0) {
        updateCarousel(currentIndex + 1);
      } else {
        updateCarousel(currentIndex - 1);
      }
    }
    isDragging = false;
  });

  // Mouse Drag Support
  track.addEventListener('mousedown', (e) => {
    startX = e.clientX;
    isDragging = true;
  });

  window.addEventListener('mouseup', (e) => {
    if (!isDragging) return;
    const diff = startX - e.clientX;
    if (Math.abs(diff) > 50) {
      if (diff > 0) updateCarousel(currentIndex + 1);
      else updateCarousel(currentIndex - 1);
    }
    isDragging = false;
  });
}

/* --------------------------------------------------------------------------
   5. Lightbox Modal
   -------------------------------------------------------------------------- */
function initLightbox() {
  const modal = document.getElementById('lightbox-modal');
  const modalImg = document.getElementById('lightbox-img');
  const closeBtn = document.querySelector('.modal-close-btn');
  const triggers = document.querySelectorAll('[data-lightbox]');

  if (!modal || !modalImg) return;

  const openLightbox = (src, alt) => {
    modalImg.src = src;
    modalImg.alt = alt || 'Depoimento Toty Barbearia';
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  };

  triggers.forEach(trigger => {
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      const src = trigger.getAttribute('data-lightbox') || trigger.querySelector('img')?.src;
      const alt = trigger.querySelector('img')?.alt || 'Visualização ampliada';
      if (src) openLightbox(src, alt);
    });
  });

  if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeLightbox();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      closeLightbox();
    }
  });
}

/* --------------------------------------------------------------------------
   6. FAQ Accordion
   -------------------------------------------------------------------------- */
function initFAQ() {
  const faqItems = document.querySelectorAll('.faq-item');
  if (!faqItems.length) return;

  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    if (!question) return;

    question.addEventListener('click', () => {
      const isActive = item.classList.contains('active');
      faqItems.forEach(i => i.classList.remove('active'));
      if (!isActive) {
        item.classList.add('active');
      }
    });
  });
}

/* --------------------------------------------------------------------------
   7. Copy Address to Clipboard + Toast
   -------------------------------------------------------------------------- */
function initCopyAddress() {
  const copyBtns = document.querySelectorAll('[data-copy-address]');
  const toast = document.getElementById('toast');

  if (!copyBtns.length) return;

  const showToast = (message) => {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 3000);
  };

  copyBtns.forEach(btn => {
    btn.addEventListener('click', async (e) => {
      e.preventDefault();
      const address = btn.getAttribute('data-copy-address');
      if (!address) return;

      try {
        await navigator.clipboard.writeText(address);
        showToast('📍 Endereço copiado para a área de transferência!');
      } catch (err) {
        showToast('📍 ' + address);
      }
    });
  });
}

/* --------------------------------------------------------------------------
   8. Cookie Banner (LGPD & GA4)
   -------------------------------------------------------------------------- */
function initCookieBanner() {
  const banner = document.getElementById('cookie-banner');
  const acceptBtn = document.getElementById('cookie-accept');
  const rejectBtn = document.getElementById('cookie-reject');

  if (!banner || !acceptBtn || !rejectBtn) return;

  const consent = localStorage.getItem('toty_cookie_consent');

  if (!consent) {
    setTimeout(() => {
      banner.classList.add('show');
    }, 1200);
  }

  acceptBtn.addEventListener('click', () => {
    localStorage.setItem('toty_cookie_consent', 'accepted');
    banner.classList.remove('show');
    if (window.gtag) {
      gtag('consent', 'update', {
        'analytics_storage': 'granted'
      });
    }
  });

  rejectBtn.addEventListener('click', () => {
    localStorage.setItem('toty_cookie_consent', 'rejected');
    banner.classList.remove('show');
    if (window.gtag) {
      gtag('consent', 'update', {
        'analytics_storage': 'denied'
      });
    }
  });
}

/* --------------------------------------------------------------------------
   9. Scroll Reveal Animations
   -------------------------------------------------------------------------- */
function initScrollReveal() {
  const reveals = document.querySelectorAll('.reveal');
  if (!reveals.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  });

  reveals.forEach(el => observer.observe(el));
}

/* --------------------------------------------------------------------------
   10. Dynamic Current Year
   -------------------------------------------------------------------------- */
function setCurrentYear() {
  const yearEl = document.getElementById('current-year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
}

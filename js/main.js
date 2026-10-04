/* ==========================================================================
   Awwwards-Level 3D Storytelling Portfolio - Main Interactivity Logic
   ========================================================================== */

(function () {
  'use strict';

  // 1. PRELOADER LOGIC
  function initPreloader() {
    const loader = document.getElementById('loader');
    const loaderFill = document.getElementById('loader-fill');
    const loaderText = document.getElementById('loader-text');
    if (!loader || !loaderFill || !loaderText) return;

    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.floor(Math.random() * 12) + 5;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);

        loaderFill.style.width = '100%';
        loaderText.textContent = '100%';

        // Fade out preloader
        setTimeout(() => {
          if (window.gsap) {
            gsap.to(loader, {
              opacity: 0,
              pointerEvents: 'none',
              duration: 0.8,
              ease: 'power3.inOut',
              onComplete: () => {
                loader.style.display = 'none';
                if (window.ScrollTrigger) {
                  window.ScrollTrigger.refresh();
                }
              }
            });
          } else {
            loader.style.opacity = '0';
            loader.style.pointerEvents = 'none';
            setTimeout(() => { loader.style.display = 'none'; }, 800);
          }
        }, 300);
      } else {
        loaderFill.style.width = progress + '%';
        loaderText.textContent = progress + '%';
      }
    }, 60);
  }

  // 2. DUAL-RING CUSTOM MAGNETIC CURSOR
  function initCustomCursor() {
    const cursorDot = document.getElementById('cursor-dot');
    const cursorRing = document.getElementById('cursor-ring');
    if (!cursorDot || !cursorRing) return;

    let mouseX = 0, mouseY = 0;
    let ringX = 0, ringY = 0;

    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      cursorDot.style.left = mouseX + 'px';
      cursorDot.style.top = mouseY + 'px';
    });

    // Smooth lerp for outer ring
    function renderCursor() {
      ringX += (mouseX - ringX) * 0.15;
      ringY += (mouseY - ringY) * 0.15;

      cursorRing.style.left = ringX + 'px';
      cursorRing.style.top = ringY + 'px';

      requestAnimationFrame(renderCursor);
    }
    requestAnimationFrame(renderCursor);

    // Interactive Hover Elements Scaling
    const hoverables = document.querySelectorAll('a, button, .tilt-card, .btn-magnetic, .nav-link');
    hoverables.forEach((el) => {
      el.addEventListener('mouseenter', () => {
        document.body.classList.add('hovering-interactive');
      });
      el.addEventListener('mouseleave', () => {
        document.body.classList.remove('hovering-interactive');
      });
    });
  }

  // 3. MAGNETIC BUTTON HOVER EFFECT
  function initMagneticButtons() {
    const magneticBtns = document.querySelectorAll('.btn-magnetic');

    magneticBtns.forEach((btn) => {
      btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;

        btn.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
      });

      btn.addEventListener('mouseleave', () => {
        btn.style.transform = 'translate(0px, 0px)';
      });
    });
  }

  // 4. 3D CARD TILT WITH DYNAMIC GLARE ON MOUSE MOVE
  function init3DTiltCards() {
    const cards = document.querySelectorAll('.tilt-card');

    cards.forEach((card) => {
      // Create glare element if not present
      let glare = card.querySelector('.card-glare');
      if (!glare) {
        glare = document.createElement('div');
        glare.className = 'card-glare';
        glare.style.cssText = `
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          background: radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0.25) 0%, transparent 70%);
          opacity: 0;
          transition: opacity 0.3s ease;
          z-index: 10;
          border-radius: inherit;
        `;
        card.appendChild(glare);
      }

      // Set baseline upright state
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)';

      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = ((y - centerY) / centerY) * -12;
        const rotateY = ((x - centerX) / centerX) * 12;

        const percentX = (x / rect.width) * 100;
        const percentY = (y / rect.height) * 100;

        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.03)`;
        if (glare) {
          glare.style.background = `radial-gradient(circle at ${percentX}% ${percentY}%, rgba(255, 255, 255, 0.35) 0%, transparent 65%)`;
          glare.style.opacity = '1';
        }
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)';
        if (glare) glare.style.opacity = '0';
      });
    });
  }

  // 5. CONTACT FORM HANDLER & AIRPLANE ANIMATION
  function initContactForm() {
    const form = document.getElementById('contact-form');
    const submitBtn = document.getElementById('submit-btn');
    if (!form || !submitBtn) return;

    form.addEventListener('submit', (e) => {
      e.preventDefault();

      // Trigger paper airplane flight animation
      submitBtn.classList.add('sent');
      submitBtn.innerHTML = 'Sending... <i class="fa-solid fa-paper-plane"></i>';

      setTimeout(() => {
        submitBtn.innerHTML = 'Message Sent! <i class="fa-solid fa-check"></i>';
        submitBtn.style.background = '#10b981';

        // Success Toast Notification
        showToast('Thank you! Your message has been sent successfully.');

        // Reset form after delay
        setTimeout(() => {
          form.reset();
          submitBtn.classList.remove('sent');
          submitBtn.style.background = 'var(--accent-orange)';
          submitBtn.innerHTML = 'Send Message <i class="fa-solid fa-paper-plane"></i>';
        }, 3000);
      }, 1200);
    });
  }

  // 6. INTERACTIVE TESTIMONIAL SLIDER CONTROLLER
  function initTestimonialSlider() {
    const grid = document.getElementById('testimonials-grid');
    const prevBtn = document.getElementById('testimonial-prev');
    const nextBtn = document.getElementById('testimonial-next');
    const dotsContainer = document.getElementById('testimonial-dots');
    if (!grid || !prevBtn || !nextBtn) return;

    const cards = grid.querySelectorAll('.testimonial-card');
    const dots = dotsContainer ? dotsContainer.querySelectorAll('.dot') : [];
    let currentIndex = 0;

    function updateSlider(index) {
      if (index < 0) index = cards.length - 1;
      if (index >= cards.length) index = 0;
      currentIndex = index;

      // Scroll card into view inside horizontal container if scrollable
      const card = cards[currentIndex];
      if (card && window.innerWidth <= 992) {
        grid.scrollTo({
          left: card.offsetLeft - 20,
          behavior: 'smooth'
        });
      }

      dots.forEach((dot, idx) => {
        if (idx === currentIndex) dot.classList.add('active');
        else dot.classList.remove('active');
      });

      cards.forEach((c, idx) => {
        if (idx === currentIndex) {
          c.style.borderColor = 'rgba(255, 85, 0, 0.4)';
        } else {
          c.style.borderColor = 'rgba(255, 255, 255, 0.95)';
        }
      });
    }

    prevBtn.addEventListener('click', () => updateSlider(currentIndex - 1));
    nextBtn.addEventListener('click', () => updateSlider(currentIndex + 1));

    dots.forEach((dot, idx) => {
      dot.addEventListener('click', () => updateSlider(idx));
    });
  }

  // Toast Notification System
  function showToast(msg) {
    const existing = document.getElementById('toast-notification');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.id = 'toast-notification';
    toast.style.cssText = `
      position: fixed;
      bottom: 30px;
      right: 30px;
      padding: 16px 28px;
      background: #10b981;
      color: #ffffff;
      font-weight: 700;
      border-radius: 100px;
      box-shadow: 0 10px 30px rgba(16, 185, 129, 0.4);
      z-index: 10000;
      display: flex;
      align-items: center;
      gap: 12px;
      font-size: 0.95rem;
      transform: translateY(100px);
      opacity: 0;
      transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
    `;

    toast.innerHTML = `<i class="fa-solid fa-circle-check"></i> ${msg}`;
    document.body.appendChild(toast);

    requestAnimationFrame(() => {
      toast.style.transform = 'translateY(0)';
      toast.style.opacity = '1';
    });

    setTimeout(() => {
      toast.style.transform = 'translateY(100px)';
      toast.style.opacity = '0';
      setTimeout(() => toast.remove(), 400);
    }, 4000);
  }

  // Back to top smooth scroll
  function initBackToTop() {
    const btn = document.getElementById('back-to-top');
    if (!btn) return;
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      if (window.lenis) {
        window.lenis.scrollTo('#hero', { duration: 1.6 });
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    });
  }

  // Initialize interactive features on DOM ready
  function initMain() {
    initPreloader();
    initCustomCursor();
    initMagneticButtons();
    init3DTiltCards();
    initContactForm();
    initTestimonialSlider();
    initBackToTop();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initMain);
  } else {
    initMain();
  }
})();

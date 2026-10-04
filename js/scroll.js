/* ==========================================================================
   Awwwards-Level 3D Storytelling Portfolio - Lenis Smooth Scroll Engine
   ========================================================================== */

(function () {
  'use strict';

  let lenis;

  function initLenisScroll() {
    // 1. Initialize Lenis Smooth Scroll
    lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Custom cinematic easing curve
      direction: 'vertical',
      gestureDirection: 'vertical',
      smooth: true,
      mouseMultiplier: 1,
      smoothTouch: false,
      touchMultiplier: 2,
      infinite: false
    });

    // 2. Register GSAP ScrollTrigger Plugin
    if (window.gsap && window.ScrollTrigger) {
      gsap.registerPlugin(ScrollTrigger);

      // Sync Lenis scroll event with GSAP ScrollTrigger
      lenis.on('scroll', ScrollTrigger.update);

      // Connect Lenis RAF to GSAP Ticker for synchronized 60fps frame updates
      gsap.ticker.add((time) => {
        lenis.raf(time * 1000);
      });

      // Disable GSAP default lag smoothing for zero-lag scroll tracking
      gsap.ticker.lagSmoothing(0);
    } else {
      function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
      }
      requestAnimationFrame(raf);
    }

    // 3. Update Navbar and Scroll Progress Bar
    const navbar = document.querySelector('header.navbar');
    const progressBar = document.getElementById('progress-bar');
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section');

    lenis.on('scroll', (e) => {
      const scrollY = e.scroll;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = Math.min(100, Math.max(0, (scrollY / docHeight) * 100));

      // Update progress bar
      if (progressBar) {
        progressBar.style.width = progress + '%';
      }

      // Shift navbar state
      if (navbar) {
        if (scrollY > 60) {
          navbar.classList.add('scrolled');
        } else {
          navbar.classList.remove('scrolled');
        }
      }

      // Update Active Navigation Highlight based on scroll offset
      let currentSectionId = '';
      sections.forEach((sec) => {
        const top = sec.offsetTop - 180;
        const height = sec.offsetHeight;
        if (scrollY >= top && scrollY < top + height) {
          currentSectionId = sec.getAttribute('id');
        }
      });

      navLinks.forEach((link) => {
        link.classList.remove('active');
        if (link.getAttribute('href') === '#' + currentSectionId) {
          link.classList.add('active');
        }
      });
    });

    // 4. Smooth Anchor Link Scrolling
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;

        const targetEl = document.querySelector(targetId);
        if (targetEl) {
          lenis.scrollTo(targetEl, {
            offset: -80,
            duration: 1.4,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))
          });
        }
      });
    });

    // Export lenis instance globally
    window.lenisScroll = lenis;
  }

  // Initialize smooth scroll when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initLenisScroll);
  } else {
    initLenisScroll();
  }
})();

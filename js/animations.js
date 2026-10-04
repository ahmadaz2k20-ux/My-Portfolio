/* ==========================================================================
   Awwwards-Level 3D Storytelling Portfolio - GSAP Animation Sequences
   ========================================================================== */

(function () {
  'use strict';

  function initGSAPAnimations() {
    if (!window.gsap || !window.ScrollTrigger) return;

    gsap.registerPlugin(ScrollTrigger);

    // 1. HERO TRIO GRID & CENTER AVATAR SHOWCASE ANIMATION
    const heroName = document.querySelector('.hero-name-label');
    const heroWords = document.querySelectorAll('#hero-animated-title .word');
    const heroDesc = document.getElementById('hero-desc');
    const heroBtnLeft = document.getElementById('hero-buttons-left');
    const heroBtnRight = document.getElementById('hero-buttons-right');
    const heroStats = document.getElementById('hero-stats');
    const heroAvatar = document.getElementById('hero-avatar-card');

    const heroTl = gsap.timeline({ delay: 0.6 });

    if (heroName) {
      heroTl.from(heroName, {
        opacity: 0,
        y: 20,
        duration: 0.6,
        ease: 'power2.out'
      });
    }

    if (heroWords.length > 0) {
      heroTl.to(heroWords, {
        opacity: 1,
        y: 0,
        scale: 1,
        filter: 'blur(0px)',
        duration: 0.9,
        stagger: 0.1,
        ease: 'power3.out'
      }, '-=0.3');
    }

    if (heroBtnLeft) {
      heroTl.to(heroBtnLeft, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: 'power2.out'
      }, '-=0.5');
    }

    if (heroDesc) {
      heroTl.to(heroDesc, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: 'power2.out'
      }, '-=0.6');
    }

    if (heroStats) {
      heroTl.from(heroStats.children, {
        opacity: 0,
        scale: 0.8,
        x: 20,
        duration: 0.6,
        stagger: 0.1,
        ease: 'back.out(1.7)'
      }, '-=0.5');
    }

    if (heroBtnRight) {
      heroTl.to(heroBtnRight, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: 'power2.out'
      }, '-=0.4');
    }

    if (heroAvatar) {
      heroTl.from(heroAvatar, {
        opacity: 0,
        scale: 0.9,
        y: 35,
        duration: 1.1,
        ease: 'power3.out',
        clearProps: 'transform'
      }, '-=1.0');

      // Orbit Badges pop in
      heroTl.from('.orbit-badge', {
        scale: 0,
        opacity: 0,
        duration: 0.6,
        stagger: 0.15,
        ease: 'back.out(2)'
      }, '-=0.6');
    }

    // 2. THREE.JS PLANET & AVATAR SCROLL STORYTELLING TRANSITION
    ScrollTrigger.create({
      trigger: '#hero',
      start: 'top top',
      end: 'bottom top',
      scrub: 1,
      onUpdate: (self) => {
        const progress = self.progress;
        
        // Retrieve Three.js global references
        if (window.threePlanetGroup) {
          window.threePlanetGroup.position.z = -progress * 15;
          window.threePlanetGroup.position.y = -progress * 6;
          window.threePlanetGroup.rotation.y = progress * Math.PI * 1.5;
          window.threePlanetGroup.scale.setScalar(1 - progress * 0.4);
        }

        if (window.threeParticleSystem) {
          window.threeParticleSystem.rotation.y = progress * Math.PI;
        }

        if (heroAvatar) {
          heroAvatar.style.transform = `perspective(1000px) rotateY(${progress * 25}deg) rotateX(${progress * -15}deg) scale(${1 - progress * 0.15})`;
        }
      }
    });

    // 3. CHAPTER 01: WHO AM I
    gsap.from('#chapter-01 .about-card-glass', {
      scrollTrigger: {
        trigger: '#chapter-01',
        start: 'top 75%',
        toggleActions: 'play none none reverse'
      },
      y: 60,
      opacity: 0,
      duration: 1,
      stagger: 0.25,
      ease: 'power3.out'
    });

    // 4. CHAPTER 02: SKILLS UNIVERSE
    gsap.from('.skill-card', {
      scrollTrigger: {
        trigger: '#chapter-02',
        start: 'top 75%',
        toggleActions: 'play none none reverse'
      },
      scale: 0.9,
      opacity: 0,
      y: 40,
      duration: 0.8,
      stagger: 0.1,
      ease: 'back.out(1.5)',
      onComplete: () => {
        document.querySelectorAll('.skill-card').forEach((card) => {
          const percent = card.getAttribute('data-percent') || '0';
          const fill = card.querySelector('.skill-progress-fill');
          if (fill) fill.style.width = percent + '%';
        });
      }
    });

    // 6. CHAPTER 03: PROJECTS HORIZONTAL PINNED SCROLL (100VH FULL VIEWPORT)
    const projectsTrack = document.getElementById('projects-track');
    if (projectsTrack) {
      const getProjectsScrollAmount = () => {
        return -(projectsTrack.scrollWidth - window.innerWidth + 60);
      };

      const getPinDistance = () => {
        return projectsTrack.scrollWidth - window.innerWidth + 60;
      };

      gsap.to(projectsTrack, {
        x: getProjectsScrollAmount,
        ease: 'none',
        scrollTrigger: {
          trigger: '#chapter-03',
          start: 'top top',
          end: () => `+=${getPinDistance()}`,
          pin: true,
          pinSpacing: true,
          anticipatePin: 1,
          scrub: 1,
          invalidateOnRefresh: true
        }
      });

      window.addEventListener('load', () => {
        if (window.ScrollTrigger) window.ScrollTrigger.refresh();
      });
      document.querySelectorAll('#projects-track img').forEach((img) => {
        img.addEventListener('load', () => {
          if (window.ScrollTrigger) window.ScrollTrigger.refresh();
        });
      });
    }

    // 7. CHAPTER 04: CODE SHOWCASE TERMINAL TYPING
    let terminalTyped = false;
    ScrollTrigger.create({
      trigger: '#chapter-04',
      start: 'top 70%',
      onEnter: () => {
        if (!terminalTyped) {
          typeTerminalCode();
          terminalTyped = true;
        }
      }
    });

    // 8. CHAPTER 05: GITHUB CONTRIBUTION MATRIX
    let githubGridRendered = false;
    ScrollTrigger.create({
      trigger: '#chapter-05',
      start: 'top 75%',
      onEnter: () => {
        if (!githubGridRendered) {
          renderGitHubMatrix();
          githubGridRendered = true;
        }
      }
    });

    // 9. CHAPTER 06: SERVICES GRID
    gsap.from('.service-card', {
      scrollTrigger: {
        trigger: '#chapter-06',
        start: 'top 75%',
        toggleActions: 'play none none reverse'
      },
      y: 50,
      opacity: 0,
      duration: 0.8,
      stagger: 0.2,
      ease: 'power3.out'
    });

    // 10. CHAPTER 07: TESTIMONIALS REVEAL
    gsap.from('.testimonial-card', {
      scrollTrigger: {
        trigger: '#chapter-07',
        start: 'top 75%',
        toggleActions: 'play none none reverse'
      },
      y: 50,
      opacity: 0,
      duration: 0.9,
      stagger: 0.2,
      ease: 'power3.out'
    });

    // 11. GLOBAL 3D CANVAS PARALLAX STORYTELLING ACROSS ALL SECTIONS
    if (window.threePlanetGroup) {
      gsap.timeline({
        scrollTrigger: {
          trigger: 'body',
          start: 'top top',
          end: 'bottom bottom',
          scrub: 0.8
        }
      })
      .to(window.threePlanetGroup.position, { x: 5, y: -2, z: -3 }, 0.15)
      .to(window.threePlanetGroup.rotation, { x: 0.8, y: 2.2 }, 0.15)
      .to(window.threePlanetGroup.position, { x: -6, y: 1, z: -2 }, 0.35)
      .to(window.threePlanetGroup.rotation, { x: 1.5, y: 4.5 }, 0.35)
      .to(window.threePlanetGroup.position, { x: 4, y: -3, z: -3.5 }, 0.6)
      .to(window.threePlanetGroup.position, { x: 0, y: 0, z: -1.5 }, 0.95);
    }

    // 8. STUDIO FOOTER SCROLL REVEAL ANIMATION
    const studioFooter = document.getElementById('studio-footer');
    if (studioFooter) {
      const footerTl = gsap.timeline({
        scrollTrigger: {
          trigger: studioFooter,
          start: 'top bottom-=60',
          toggleActions: 'play none none reverse'
        }
      });

      footerTl
        .from('.footer-brand-col', {
          y: 45,
          opacity: 0,
          duration: 0.9,
          ease: 'power3.out'
        })
        .from('.footer-col', {
          y: 45,
          opacity: 0,
          duration: 0.9,
          stagger: 0.12,
          ease: 'power3.out'
        }, '-=0.7')
        .from('#footer-watermark', {
          y: 120,
          scale: 0.92,
          opacity: 0,
          duration: 1.4,
          ease: 'power4.out'
        }, '-=0.9');
    }
  }

  // Terminal Typing Animation Logic
  function typeTerminalCode() {
    const container = document.getElementById('terminal-content');
    if (!container) return;

    const codeLines = [
      '<span class="code-comment">// Crafting high-performance digital experiences</span>',
      '<span class="code-keyword">const</span> <span class="code-variable">developer</span> = {',
      '  name: <span class="code-string">"Azim Ahmad"</span>,',
      '  role: <span class="code-string">"Full Stack & 3D Web Engineer"</span>,',
      '  stack: [<span class="code-string">"Three.js"</span>, <span class="code-string">"GSAP"</span>, <span class="code-string">"React"</span>, <span class="code-string">"Node.js"</span>],',
      '  passion: <span class="code-string">"Building Awwwards-level interactive web software"</span>',
      '};',
      '',
      '<span class="code-keyword">async function</span> <span class="code-function">initializePortfolio</span>() {',
      '  <span class="code-keyword">await</span> developer.<span class="code-function">render3DScene</span>();',
      '  console.<span class="code-function">log</span>(<span class="code-string">"Welcome to my digital space! 🚀"</span>);',
      '}',
      '',
      '<span class="code-function">initializePortfolio</span>();'
    ];

    container.innerHTML = '';
    let lineIndex = 0;

    function addNextLine() {
      if (lineIndex < codeLines.length) {
        const lineEl = document.createElement('div');
        lineEl.innerHTML = codeLines[lineIndex] || '&nbsp;';
        container.appendChild(lineEl);
        lineIndex++;
        setTimeout(addNextLine, 80);
      } else {
        const blinker = document.createElement('span');
        blinker.className = 'cursor-blink';
        container.appendChild(blinker);
      }
    }

    addNextLine();
  }

  // GitHub Grid Generator
  function renderGitHubMatrix() {
    const matrixContainer = document.getElementById('github-matrix');
    if (!matrixContainer) return;

    matrixContainer.innerHTML = '';
    const totalBoxes = 28 * 7; // 28 columns x 7 rows

    for (let i = 0; i < totalBoxes; i++) {
      const box = document.createElement('div');
      box.className = 'contrib-box';

      // Random activity level simulation
      const rand = Math.random();
      if (rand > 0.85) box.classList.add('lvl-4');
      else if (rand > 0.65) box.classList.add('lvl-3');
      else if (rand > 0.45) box.classList.add('lvl-2');
      else if (rand > 0.25) box.classList.add('lvl-1');

      matrixContainer.appendChild(box);
    }

    // Staggered light up animation
    gsap.from('.contrib-box', {
      scale: 0,
      opacity: 0,
      stagger: {
        grid: [7, 28],
        from: 'center',
        amount: 1.2
      },
      duration: 0.4,
      ease: 'back.out(1.7)'
    });
  }

  // Initialize animations after page load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initGSAPAnimations);
  } else {
    initGSAPAnimations();
  }
})();

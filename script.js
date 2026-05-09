/* =======================================================
   COODIE STUDIO™ // FUNCTIONAL CORE
   ======================================================= */

   document.addEventListener("DOMContentLoaded", () => {

    // --- 1. HAMBURGER MENU MOBILE ---
    const menuToggle  = document.getElementById('menu-toggle');
    const mobileMenu  = document.getElementById('mobile-menu');
    const closeBtn    = document.getElementById('close-btn');
    const menuBackdrop = document.getElementById('menu-backdrop');

    const openMenu = () => {
        mobileMenu.classList.add('active');
        menuToggle.classList.add('active');
        document.body.style.overflow = 'hidden';
    };

    const closeMenu = () => {
        mobileMenu.classList.remove('active');
        menuToggle.classList.remove('active');
        document.body.style.overflow = '';
    };

    if (menuToggle)    menuToggle.addEventListener('click', openMenu);
    if (closeBtn)      closeBtn.addEventListener('click', closeMenu);
    if (menuBackdrop)  menuBackdrop.addEventListener('click', closeMenu);

    // Chiudi cliccando un link (escluso il trigger Services)
    if (mobileMenu) {
        mobileMenu.querySelectorAll('a:not(.mobile-services-submenu a)').forEach(link => {
            link.addEventListener('click', closeMenu);
        });
    }

    // --- 2. ACCORDION SERVICES (Mobile) ---
    const servicesBtn     = document.getElementById('mobile-services-btn');
    const servicesSubmenu = document.getElementById('mobile-services-submenu');

    if (servicesBtn && servicesSubmenu) {
        servicesBtn.addEventListener('click', () => {
            const isOpen = servicesSubmenu.classList.toggle('open');
            servicesBtn.classList.toggle('open', isOpen);
            servicesBtn.setAttribute('aria-expanded', isOpen);
            servicesSubmenu.setAttribute('aria-hidden', !isOpen);
        });
    }

    // --- 3. DROPDOWN SERVIZI (Desktop) ---
    const servicesTrigger = document.querySelector('.services-trigger');
    const servicesMenuDesktop = document.querySelector('.services-menu');

    if (servicesTrigger && servicesMenuDesktop) {
        servicesTrigger.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            servicesMenuDesktop.classList.toggle('active');
        });
        document.addEventListener('click', (e) => {
            if (!servicesMenuDesktop.contains(e.target) && e.target !== servicesTrigger) {
                servicesMenuDesktop.classList.remove('active');
            }
        });
    }

    // --- 4. OROLOGIO DI SISTEMA ---
    const clock = document.getElementById('live-clock');
    if (clock) {
        const updateClock = () => {
            clock.textContent = new Date().toLocaleTimeString('it-IT', {
                timeZone: 'Europe/Rome',
                hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false
            }) + ' CEST';
        };
        setInterval(updateClock, 1000);
        updateClock();
    }

    // --- 5. ACCORDION FAQ ---
    document.querySelectorAll('.js-faq-op').forEach(item => {
        const trigger = item.querySelector('.faq-trigger-op');
        const content = item.querySelector('.faq-content-op');
        if (trigger && content) {
            trigger.addEventListener('click', () => {
                item.classList.toggle('is-open');
                content.style.maxHeight = item.classList.contains('is-open')
                    ? content.scrollHeight + 'px' : null;
            });
        }
    });

    // --- 6. WORKS FILTER (work.html) ---
    const filterBtns = document.querySelectorAll('.filter-btn');
    const workItems  = document.querySelectorAll('.full-work-item');

    if (filterBtns.length && workItems.length) {
        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                const filter = btn.dataset.filter;
                workItems.forEach(item => {
                    const cats = item.dataset.category || '';
                    const show = filter === 'all' || cats.includes(filter);
                    item.style.display = show ? '' : 'none';
                    // Nascondi anche il divider se item nascosto
                    const divider = item.nextElementSibling;
                    if (divider && divider.classList.contains('works-divider')) {
                        divider.style.display = show ? '' : 'none';
                    }
                });
            });
        });
    }

   // --- 7. FORM DI CONTATTO (Reale con Formspree) ---
   const contactForm   = document.getElementById('contact-form-system');
   const contactStatus = document.getElementById('form-status-contact');

   if (contactForm && contactStatus) {
       contactForm.addEventListener('submit', async (e) => {
           e.preventDefault();
           contactStatus.textContent = '[ PROCESSING... ]';
           contactStatus.style.color = '#888';

           const formData = new FormData(contactForm);

           try {
               const response = await fetch(contactForm.action, {
                   method: 'POST',
                   body: formData,
                   headers: { 'Accept': 'application/json' }
               });

               if (response.ok) {
                   contactStatus.textContent = '[ SUCCESS: DATA DELIVERED ]';
                   contactStatus.style.color = '#00ff41';
                   contactForm.reset();
               } else {
                   contactStatus.textContent = '[ ERROR: COULD NOT SEND ]';
                   contactStatus.style.color = '#ff0000';
               }
           } catch (error) {
               contactStatus.textContent = '[ ERROR: NETWORK ISSUE ]';
               contactStatus.style.color = '#ff0000';
           }

           setTimeout(() => { contactStatus.textContent = ''; }, 4000);
       });
   }

/* ═══════════════════════════════════════════════════════════
   COODIE_STUDIO™ — ANIMATION SYSTEM
   Incolla il contenuto di questo file IN FONDO al tuo script.js,
   dentro il blocco DOMContentLoaded esistente
   (oppure aggiungilo come <script src="animations.js"> separato)
   ═══════════════════════════════════════════════════════════

   COME FUNZIONA:
   Il codice legge i data-anim già presenti nell'HTML
   e li anima quando entrano nel viewport.
   Non devi toccare gli HTML — il JS li tagga automaticamente.
   ═══════════════════════════════════════════════════════════ */

   (function () {

    /* ── 1. Mappa elementi → tipo animazione ─────────────────── */
  
    const SELECTORS = {
  
      // Titoli principali
      title: [
        'h1',
        '.section-title',
        '.work-hero-title',
        '.about-mega-title',
        '.contact-hero-title',
        '.svc-hero-title',
        '.manifesto-headline',
        '.philosophy-title',
        '.process-title',
        '.cta-closer-title',
        '.engine-title',
        '.footer-brand-minimal',
        '.referral-title',
        '.svc-what-title',
        '.svc-pricing-title',
        '.footer-brand-minimal',
        '.contact-form-title',
      ],
  
      // Testi / paragrafi / descrizioni
      text: [
        '.svc-hero-desc',
        '.about-hero-desc',
        '.contact-hero-sub',
        '.work-hero-sub',
        '.section-manifesto',
        '.manifesto-para',
        '.philosophy-sub',
        '.engine-lead',
        '.cform-note',
        '.referral-lead',
        '.svc-what-body p',
        '.process-step-desc',
        '.referral-step-desc',
        '.referral-percent-desc',
        '.about-hero-desc',
        '.bottom-left h2',
        'p.long-desc',
        'p.short-desc',
      ],
  
      // Card — staggerate in gruppo
      card: [
        '.service-item',
        '.philosophy-card',
        '.process-step',
        '.work-item',
        '.full-work-item',
        '.referral-step',
        '.svc-stat',
        '.stat-block',
        '.about-hero-stats .stat-block',
        '.contact-meta-block',
        '.cform-row',
        '.pricing-card',
        '.faq-item',
        '.faq-item-op',
        '.js-faq-op',
      ],
  
      // Immagini
      img: [
        '.work-image-container',
        '.full-work-image-wrap',
        '.about-image-wrapper',
        '.svc-hero-right',
      ],
  
      // Label / eyebrow
      label: [
        '.section-label',
        '.about-hero-eyebrow',
        '.svc-breadcrumb',
        '.manifesto-index',
        '.manifesto-tag',
        '.process-eyebrow',
        '.cta-closer-label',
        '.status-indicator',
        '.contact-meta-label',
        '.cform-label',
        '.referral-rules-label',
      ],
  
      // Linee orizzontali
      line: [
        'hr',
        '.works-divider',
      ],
    };
  
    /* ── 2. Taga ogni elemento con data-anim ─────────────────── */
  
    Object.entries(SELECTORS).forEach(([type, selList]) => {
      selList.forEach(sel => {
        document.querySelectorAll(sel).forEach(el => {
          // Non sovrascrivere se già taggato manualmente
          if (!el.hasAttribute('data-anim')) {
            el.setAttribute('data-anim', type);
          }
        });
      });
    });
  
    /* ── 3. Stagger per elementi fratelli dello stesso tipo ───── */
  
    // Raggruppa card fratelli (stesso parent) e applica delay progressivo
    const STAGGER_TYPES = ['card', 'img'];
  
    STAGGER_TYPES.forEach(type => {
      // Trova tutti i parent che hanno ≥2 figli con quel tipo
      const items = document.querySelectorAll(`[data-anim="${type}"]`);
      const parents = new Map();
  
      items.forEach(el => {
        const p = el.parentElement;
        if (!parents.has(p)) parents.set(p, []);
        parents.get(p).push(el);
      });
  
      parents.forEach((children) => {
        if (children.length > 1) {
          children.forEach((el, i) => {
            el.classList.add(`anim-d${Math.min(i, 5)}`);
          });
        }
      });
    });
  
    /* ── 4. IntersectionObserver ─────────────────────────────── */
  
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('anim-in');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.08,
      rootMargin: '0px 0px -40px 0px',
    });
  
    document.querySelectorAll('[data-anim]').forEach(el => observer.observe(el));
  
  })();
})();
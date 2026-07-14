/* ==========================================================================
   DUBAI BUSINESS INVESTMENT FORUM – CÔTE D'IVOIRE 2026
   Interactive JS Engine (Particles, Matchmaker Canvas, Scroll Animation)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // Force browser scroll position to top (Hero section) on load/refresh
  if (history.scrollRestoration) {
    history.scrollRestoration = 'manual';
  }
  window.scrollTo(0, 0);

  // Clear hash and force scroll on full page load (overrides post-rendering layout shifts)
  window.addEventListener('load', () => {
    setTimeout(() => {
      window.scrollTo(0, 0);
      if (window.location.hash && window.location.hash !== '#hero') {
        history.replaceState(null, null, ' ');
      }
    }, 100);
  });

  // ==========================================================================
  // 1. MOBILE MENU NAVIGATION
  // ==========================================================================
  const menuBtn = document.getElementById('menu-btn');
  const closeBtn = document.getElementById('close-btn');
  const mobileOverlay = document.getElementById('mobile-overlay');
  const mobileLinks = document.querySelectorAll('.mobile-link');

  const toggleMobileMenu = (state) => {
    mobileOverlay.classList.toggle('active', state);
    document.body.style.overflow = state ? 'hidden' : '';
  };

  if (menuBtn) menuBtn.addEventListener('click', () => toggleMobileMenu(true));
  if (closeBtn) closeBtn.addEventListener('click', () => toggleMobileMenu(false));
  mobileLinks.forEach(link => {
    link.addEventListener('click', () => toggleMobileMenu(false));
  });

  // ==========================================================================
  // 2. HEADER SHRINK ON SCROLL
  // ==========================================================================
  const header = document.getElementById('site-header');
  const handleScroll = () => {
    if (window.scrollY > 20) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };
  window.addEventListener('scroll', handleScroll);
  handleScroll(); // Initial check

  // ==========================================================================
  // 3. AMBIENT HERO PARTICLES SIMULATION
  // ==========================================================================
  const canvas = document.getElementById('hero-particles');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let particles = [];
    let animationFrameId;

    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      initParticles();
    };

    class Particle {
      constructor() {
        this.reset();
      }
      reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2 + 0.5;
        this.speedX = Math.random() * 0.4 - 0.2;
        this.speedY = Math.random() * -0.5 - 0.1; // Float upward
        this.opacity = Math.random() * 0.5 + 0.2;
        this.fadeSpeed = Math.random() * 0.005 + 0.002;
      }
      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        this.opacity -= this.fadeSpeed;

        if (this.y < 0 || this.opacity <= 0) {
          this.reset();
          this.y = canvas.height;
        }
      }
      draw() {
        ctx.save();
        ctx.globalAlpha = this.opacity;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = '#D9A441'; // Gold
        ctx.fill();
        ctx.restore();
      }
    }

    const initParticles = () => {
      particles = [];
      const count = Math.min(100, Math.floor(canvas.width / 15));
      for (let i = 0; i < count; i++) {
        particles.push(new Particle());
      }
    };

    const animateParticles = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        p.update();
        p.draw();
      });
      animationFrameId = requestAnimationFrame(animateParticles);
    };

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
    animateParticles();
  }

  // ==========================================================================
  // 4. GSAP SCROLL REVEAL & PARALLAX ANIMATIONS
  // ==========================================================================
  gsap.registerPlugin(ScrollTrigger);

  const revealElements = document.querySelectorAll('[data-reveal]');
  revealElements.forEach(el => {
    const delay = (el.getAttribute('data-delay') || 0) / 1000;
    
    gsap.to(el, {
      opacity: 1,
      x: 0,
      y: 0,
      scale: 1,
      duration: 1.2,
      ease: 'power3.out',
      delay: delay,
      scrollTrigger: {
        trigger: el,
        start: 'top 88%',
        toggleActions: 'play none none none'
      }
    });
  });

  // Parallax Backgrounds
  gsap.utils.toArray('.about-section, .guest-section, .gallery-section').forEach(section => {
    gsap.fromTo(section, 
      { backgroundPosition: '50% 20%' },
      {
        backgroundPosition: '50% 80%',
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true
        }
      }
    );
  });

  // Stats Counter Animation
  const counters = document.querySelectorAll('.counter');
  const countDuration = 2000; // ms

  const startCounting = (el) => {
    const target = parseInt(el.getAttribute('data-target'), 10);
    let start = 0;
    const increment = target / (countDuration / 16); // ~60fps

    const updateCount = () => {
      start += increment;
      if (start < target) {
        el.textContent = Math.floor(start);
        requestAnimationFrame(updateCount);
      } else {
        el.textContent = target;
      }
    };
    updateCount();
  };

  const statsSection = document.getElementById('stats');
  if (statsSection) {
    const statsObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          counters.forEach(c => startCounting(c));
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });
    statsObserver.observe(statsSection);
  }

  // ==========================================================================
  // 5. STRIPE-STYLE CARD GLOW (CURSOR TRACKING)
  // ==========================================================================
  const cards = document.querySelectorAll('.glass-card');
  cards.forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.setProperty('--x', `${x}px`);
      card.style.setProperty('--y', `${y}px`);
    });
  });



  // ==========================================================================
  // 7. REGISTRATION ACCREDITATION & NEWSLETTER FORMS
  // ==========================================================================
  const registerForm = document.getElementById('register-form');
  const formMsg = document.getElementById('form-msg');
  const submitBtn = document.getElementById('submit-btn');

  if (registerForm) {
    // Toggle visibility of the 'Autre' text field
    const otherCheckbox = document.getElementById('motif-other-checkbox');
    const otherInput = document.getElementById('reg-motif-other');
    if (otherCheckbox && otherInput) {
      otherCheckbox.addEventListener('change', (e) => {
        otherInput.style.display = e.target.checked ? 'block' : 'none';
        if (e.target.checked) {
          otherInput.focus();
        }
      });
    }

    // Toggle collapsible form sections
    const collapseTriggers = document.querySelectorAll('.form-collapse-trigger');
    collapseTriggers.forEach(trigger => {
      trigger.addEventListener('click', (e) => {
        e.preventDefault(); // Prevent button form trigger
        const section = trigger.closest('.form-collapsible-section');
        if (section) {
          const isExpanded = trigger.getAttribute('aria-expanded') === 'true';
          section.classList.toggle('active');
          trigger.setAttribute('aria-expanded', !isExpanded);
        }
      });
    });

    registerForm.addEventListener('submit', (e) => {
      e.preventDefault();
          const company = document.getElementById('reg-company').value;
      const sectorSelect = document.getElementById('reg-sector');
      const sector = sectorSelect ? sectorSelect.options[sectorSelect.selectedIndex].text : '';
      const rep = document.getElementById('reg-rep').value;
      const job = document.getElementById('reg-job').value;
      const country = document.getElementById('reg-country').value;
      const phone = document.getElementById('reg-phone').value;
      const email = document.getElementById('reg-email').value;
      
      // Get selected participation motives
      const motifs = [];
      document.querySelectorAll('input[name="motif"]:checked').forEach(cb => {
        if (cb.value === 'autre') {
          const otherVal = document.getElementById('reg-motif-other').value.trim();
          motifs.push(otherVal ? `Autre : ${otherVal}` : 'Autre');
        } else {
          const lblNode = cb.closest('.form-checkbox-container').querySelector('span[data-i18n]');
          motifs.push(lblNode ? lblNode.textContent.trim() : cb.value);
        }
      });

      // Get selected days
      const days = [];
      document.querySelectorAll('input[name="days"]:checked').forEach(cb => {
        const lblNode = cb.closest('.form-checkbox-container').querySelector('span[data-i18n]');
        days.push(lblNode ? lblNode.textContent.trim() : cb.value);
      });

      // Get selected documents
      const docs = [];
      document.querySelectorAll('input[name="docs"]:checked').forEach(cb => {
        const lblNode = cb.closest('.form-checkbox-container').querySelector('span[data-i18n]');
        docs.push(lblNode ? lblNode.textContent.trim() : cb.value);
      });

      const isCorporate = !/gmail\.com$|yahoo\.com$|hotmail\.com$|outlook\.com$|mail\.ru$/i.test(email);
      const currentLang = localStorage.getItem('preferredLang') || 'en';

      if (!isCorporate) {
        formMsg.className = "form-feedback error";
        formMsg.textContent = translations[currentLang]["msg.invalid_email"];
        return;
      }

      submitBtn.disabled = true;
      submitBtn.querySelector('span').textContent = translations[currentLang]["msg.processing"];

      // Build structured text message template for WhatsApp
      let message = '';
      if (currentLang === 'fr') {
        message = `🔴 *NOUVELLE FICHE D'ACCRÉDITATION - DBIF 2026* 🔴\n\n` +
                  `*1. IDENTITÉ DU PARTICIPANT / ENTREPRISE :*\n` +
                  `🏢 *Entreprise :* ${company}\n` +
                  `💼 *Secteur d'Activité :* ${sector}\n` +
                  `👤 *Représentant :* ${rep}\n` +
                  `👔 *Fonction :* ${job}\n` +
                  `🌍 *Pays :* ${country}\n` +
                  `📞 *Téléphone :* ${phone}\n` +
                  `📧 *E-mail :* ${email}\n\n` +
                  `*2. MOTIF DE LA PARTICIPATION :*\n` +
                  (motifs.length > 0 ? motifs.map(m => `• ${m}`).join('\n') : `• Aucun motif sélectionné`) + `\n\n` +
                  `*3. JOURNÉES DE PARTICIPATION SOUHAITÉES :*\n` +
                  (days.length > 0 ? days.map(d => `• ${d}`).join('\n') : `• Aucune journée sélectionnée`) + `\n\n` +
                  `*4. DOCUMENTS JOINTS :*\n` +
                  (docs.length > 0 ? docs.map(dc => `• ${dc}`).join('\n') : `• Aucun document joint`) + `\n\n` +
                  `---\n_Envoyé depuis le site officiel de Dubai Business Investment Forum_`;
      } else {
        message = `🔴 *NEW ACCREDITATION REQUEST - DBIF 2026* 🔴\n\n` +
                  `*1. PARTICIPANT & COMPANY IDENTITY :*\n` +
                  `🏢 *Company :* ${company}\n` +
                  `💼 *Sector of Activity :* ${sector}\n` +
                  `👤 *Representative :* ${rep}\n` +
                  `👔 *Job Title :* ${job}\n` +
                  `🌍 *Country :* ${country}\n` +
                  `📞 *Phone :* ${phone}\n` +
                  `📧 *Email :* ${email}\n\n` +
                  `*2. PURPOSE OF PARTICIPATION :*\n` +
                  (motifs.length > 0 ? motifs.map(m => `• ${m}`).join('\n') : `• No purpose selected`) + `\n\n` +
                  `*3. DESIRED DAYS OF PARTICIPATION :*\n` +
                  (days.length > 0 ? days.map(d => `• ${d}`).join('\n') : `• No days selected`) + `\n\n` +
                  `*4. ATTACHED DOCUMENTS :*\n` +
                  (docs.length > 0 ? docs.map(dc => `• ${dc}`).join('\n') : `• No documents attached`) + `\n\n` +
                  `---\n_Sent from the official Dubai Business Investment Forum website_`;
      }

      // Open WhatsApp link immediately in a new tab (bypasses browser popup blocker)
      const whatsappUrl = `https://wa.me/2250717659292?text=${encodeURIComponent(message)}`;
      window.open(whatsappUrl, '_blank');

      // Simulate API submit latency
      setTimeout(() => {
        formMsg.className = "form-feedback success";
        formMsg.textContent = translations[currentLang]["msg.register_success"];
        registerForm.reset();
        submitBtn.disabled = false;
        submitBtn.querySelector('span').textContent = translations[currentLang]["contact.form.submit"];
      }, 1500);
    });
  }

  const newsForm = document.getElementById('news-subscribe-form');
  const subMsg = document.getElementById('sub-msg');

  if (newsForm) {
    newsForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const currentLang = localStorage.getItem('preferredLang') || 'en';
      subMsg.className = "subscribe-msg success";
      subMsg.textContent = translations[currentLang]["msg.newsletter_success"];
      newsForm.reset();
      setTimeout(() => { subMsg.textContent = ""; }, 5000);
    });
  }

  // ==========================================================================
  // 8. MÜLLER-BROCKMANN GRID TOGGLE SYSTEM
  // ==========================================================================
  const gridOverlay = document.getElementById('guides-overlay');
  if (gridOverlay) {
    // Generate 12 columns
    for (let i = 0; i < 12; i++) {
      const colDiv = document.createElement('div');
      gridOverlay.appendChild(colDiv);
    }
  }

  const toggleGrid = () => {
    document.body.classList.toggle('grid-on');
  };

  const gridToggleBtn = document.getElementById('grid-toggle');
  if (gridToggleBtn) {
    gridToggleBtn.addEventListener('click', (e) => {
      e.preventDefault();
      toggleGrid();
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'g' || e.key === 'G') {
      // Prevent triggering inside text inputs
      if (document.activeElement.tagName !== 'INPUT' && document.activeElement.tagName !== 'SELECT' && document.activeElement.tagName !== 'TEXTAREA') {
        toggleGrid();
      }
    }
  });

  // ==========================================================================
  // 9. OPTICAL INK ALIGNMENT SYSTEM
  // ==========================================================================
  const alignDisplayInk = async () => {
    const selectors = '.hero-title, .section-title, .stat-number';
    try {
      await document.fonts.ready;
      const cvs = document.createElement('canvas');
      const ctx = cvs.getContext('2d');
      document.querySelectorAll(selectors).forEach(el => {
        el.style.marginLeft = '0px';
        const cs = getComputedStyle(el);
        let ch = (el.textContent || '').trim()[0];
        if (!ch) return;
        if (cs.textTransform === 'uppercase') ch = ch.toUpperCase();
        ctx.font = `${cs.fontStyle} ${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`;
        const abl = ctx.measureText(ch).actualBoundingBoxLeft;
        if (isFinite(abl) && abl > 0) {
          el.style.marginLeft = `${(abl * 0.8).toFixed(2)}px`;
        }
      });
    } catch (e) {
      console.log('Fonts not loaded yet or canvas measure unsupported', e);
    }
  };

  // ==========================================================================
  // 10. MULTILINGUAL TRANSLATION SYSTEM (FR / EN)
  // ==========================================================================
  const translations = {
    en: {
      "popup.eyebrow": "DUBAI BUSINESS INVESTMENT FORUM",
      "popup.title": "PRE-FORUM",
      "popup.subtitle": "DUBAI & CÔTE D'IVOIRE",
      "popup.dates": "Thursday, July 16, 2026",
      "popup.location": "Abidjan · Côte d'Ivoire",
      "popup.btn": "VISIT",
      "shuffler.c1.title": "Abidjan Hub",
      "shuffler.c1.desc": "Corporate Entry Point",
      "shuffler.c2.title": "Dubai Chamber",
      "shuffler.c2.desc": "Global Ecosystem Connection",
      "shuffler.c3.title": "Bilateral Trust",
      "shuffler.c3.desc": "Unified Regulatory Passport",
      "nav.home": "Home",
      "nav.about": "About",
      "nav.forum": "Forum",
      "nav.opportunities": "Opportunities",
      "nav.pricing": "Pricing",

      "nav.speakers": "Speakers",
      "nav.program": "Program",
      "nav.gallery": "Gallery",
      "nav.contact": "Contact",
      "nav.register": "Register Now",
      "nav.partner": "Become a Partner",
      "hero.eyebrow": "DUBAI BUSINESS INVESTMENT FORUM",
      "hero.title": "PRE-FORUM DUBAI INVESTMENT<br>CÔTE D'IVOIRE<br><span class=\"text-gold italic font-serif hero-edition\">Edition 2026</span>",
      "hero.subtitle": "100 selected Ivorian companies. Three days to connect Abidjan to Dubai.",
      "hero.dates": "Thursday, July 16, 2026",
      "hero.card1.title": "The Gateway",
      "hero.card1.desc": "Connecting elite African companies and entrepreneurs directly to the capital markets and business ecosystem of Dubai.",
      "hero.card2.title": "Strategic Alignment",
      "hero.card2.desc": "Facilitating bilateral trade agreements, major joint ventures, and sustainable project financing in highly profitable emerging sectors.",
      "hero.card3.title": "Investment Pipeline",
      "hero.card3.desc": "Unlocking access to sovereign wealth funds, private equity hubs, venture capitalists, and premium family offices in the Gulf region.",
      "stats.leaders": "Companies",
      "stats.funds": "Investment Funds",
      "stats.countries": "Economic Ecosystems",
      "stats.opportunities": "Investment Opportunities",
      "stats.meetings": "Strategic Meetings",
      "about.badge.title": "ABIDJAN 2026",
      "about.badge.desc": "Summit Headquarter",
      "about.eyebrow": "ABOUT THE FORUM",
      "about.title": "The Strategic Bridge Between West Africa & the Gulf",
      "about.desc": "The IVOIRE-DUBAI INVESTMENT FORUM 2026 marks the 3rd edition of a must-attend event between the West African business community and the Dubai Chambers. For three days, Abidjan welcomes a delegation led by Mr. Cyril Darkwa, Representative of the Dubai Chambers for West Africa, for a program structured around two complementary objectives:",
      "about.bullet1.title": "Showcase Dubai's opportunities",
      "about.bullet1.desc": "Introduce Ivorian and West African entrepreneurs, investors and businesses to concrete opportunities for establishment, investment and commercial development in Dubai and the United Arab Emirates.",
      "about.bullet2.title": "Identify concrete partnerships",
      "about.bullet2.desc": "Visit key Ivorian businesses and institutions, sector by sector, to detect partnership opportunities, investment flows, and market entry strategies between Côte d'Ivoire and the UAE.",
      "about.footer": "100 Ivorian companies, selected across the country's main economic sectors, will participate in this forum.",
      "guest.badge": "Special Guest",
      "guest.eyebrow": "GUEST OF HONOR",
      "guest.name": "Mr. Cyril DARKWA",
      "guest.title": "Chief Representative of Dubai Chambers for West Africa",
      "guest.bio.title": "Biography",
      "guest.bio.desc": "Mr. Cyril Darkwa represents the Dubai Chamber of Commerce in West African markets. With recognized expertise in developing international trade, he has been supporting African entrepreneurs in their establishment in the United Arab Emirates for several years.",
      "guest.mission.title": "Mission",
      "guest.mission.desc": "His mission is to identify, structure, and support partnership opportunities between West African companies and Dubai's economic ecosystem - investors, family offices, banks, and free zones.",
      "guest.role.title": "Role of Dubai Chambers in Africa",
      "guest.role.desc": "Dubai Chambers acts as the official entry point for any African company wishing to establish, invest or trade with Dubai, facilitating access to business networks, funding and the regulatory frameworks of the United Arab Emirates.",
      "why.eyebrow": "EXECUTIVE ADVANTAGES",
      "why.title": "Bilateral Economic Catalysts",
      "why.desc": "Understand why this summit connects two of the world's most dynamic and complementary economic ecosystems.",
      "why.dubai.title": "Why Dubai?",
      "why.dubai.subtitle": "The Global Capital Hub",
      "why.dubai.b1.title": "100% Foreign Ownership",
      "why.dubai.b1.desc": "Full operational ownership in free zones with zero capital repatriation limits.",
      "why.dubai.b2.title": "Tax Advantages & Free Capital Flows",
      "why.dubai.b2.desc": "Extremely competitive corporate tax structure and zero personal income taxation.",
      "why.dubai.b3.title": "Global Logistics & Connectivity",
      "why.dubai.b3.desc": "World-class aviation and maritime hubs connecting Europe, Asia, and Africa.",
      "why.dubai.b4.title": "Innovation Ecosystem",
      "why.dubai.b4.desc": "Gateway to global AI hubs, venture funds, fintech sandboxes, and web3 technologies.",
      "why.ci.title": "Why Côte d'Ivoire?",
      "why.ci.subtitle": "The Locomotive of West Africa",
      "why.ci.b1.title": "Fastest Growing African Economy",
      "why.ci.b1.desc": "Consistent double-digit infrastructure growth and political macroeconomic stability.",
      "why.ci.b2.title": "Gateway to the UEMOA Zone",
      "why.ci.b2.desc": "A single market of over 120 million consumers utilizing the stable currency system.",
      "why.ci.b3.title": "Deepwater Ports & Logistics Expansion",
      "why.ci.b3.desc": "Major strategic ports in Abidjan and San Pedro serving landlocked West African nations.",
      "why.ci.b4.title": "Untapped Industrial Sectors",
      "why.ci.b4.desc": "Vast investment potentials in Agriculture, Energy, Mining, Tech, and Tourism.",
      "opp.eyebrow": "SECTOR PROSPECTS",
      "opp.title": "Investment Opportunities",
      "opp.desc": "Discover the twelve high-yield investment sectors targeted for capital flow and joint ventures during the summit.",
      "opp.card1.title": "Real Estate",
      "opp.card1.desc": "Premium commercial spaces, luxury residential properties, and retail developments connecting Dubai standards to Abidjan.",
      "opp.card2.title": "Infrastructure",
      "opp.card2.desc": "Highways, rail networks, deepwater ports, and smart city developments shaping the future of West African transportation.",
      "opp.card3.title": "Technology",
      "opp.card3.desc": "Cloud infrastructure, fiber networks, AI research centers, and state-of-the-art technological parks in West Africa.",
      "opp.card4.title": "Agriculture",
      "opp.card4.desc": "Industrial cocoa processing, high-yield agribusiness, advanced cold chains, and automated farming technologies.",
      "opp.card5.title": "Energy",
      "opp.card5.desc": "Hydroelectric power, solar grid farms, biomass, and natural gas infrastructure ensuring stable regional grids.",
      "opp.card6.title": "Healthcare",
      "opp.card6.desc": "Modern clinical networks, regional research laboratories, specialized hospitals, and pharmaceutical manufacturing.",
      "opp.card7.title": "Tourism",
      "opp.card7.desc": "Luxury resort complexes, business hospitality, eco-lodges, and cultural development along the Guinean Gulf.",
      "opp.card8.title": "Logistics",
      "opp.card8.desc": "Smart supply chain complexes, industrial packaging hubs, air cargo systems, and dry-port networks.",
      "opp.card9.title": "Education",
      "opp.card9.desc": "Bilingual technological institutes, vocational training academies, and corporate executive university centers.",
      "opp.card10.title": "FinTech",
      "opp.card10.desc": "Cross-border settlement systems, mobile banking rails, micro-lending platforms, and digital asset markets.",
      "opp.card11.title": "Manufacturing",
      "opp.card11.desc": "Automotive assembly, building material fabrication, consumer goods production, and regional export units.",
      "opp.card12.title": "Industrial Zones",
      "opp.card12.desc": "Special Economic Zones (SEZs) offering tax holidays, custom exemptions, and pre-built operational structures.",

      "high.eyebrow": "AGENDA HIGHLIGHTS",
      "high.title": "Forum Structure & Key Highlights",
      "high.desc": "Experience exclusive networking events, bilateral governmental roundtables, and major venture pitches.",
      "high.card1.title": "International Conferences",
      "high.card1.desc": "Keynotes from global economic directors, geopolitical analysts, and investment officers focusing on Africa-GCC trade corridors.",
      "high.card2.title": "B2B Investment Matchmaking",
      "high.card2.desc": "Scheduled private sessions matching vetted African infrastructure projects with Gulf developers and asset managers.",
      "high.card3.title": "Government Dialogues",
      "high.card3.desc": "High-level ministerial talks establishing regulatory frameworks, double-taxation treaties, and customized investment policies.",
      "high.card4.title": "Venture Pitch Arena",
      "high.card4.desc": "A selective platform highlighting the top 20 high-growth West African scale-ups presenting to venture funds and family offices.",
      "high.card5.title": "Gala Dinner & Awards",
      "high.card5.desc": "An elite networking banquet honoring outstanding bilateral projects, pioneer investment partnerships, and diplomatic leaders.",
      "high.card6.title": "Exhibition Pavilions",
      "high.card6.desc": "Exclusive display zones showcasing major infrastructure models, agribusiness assets, and tech platforms from both ecosystems.",
      "speakers.eyebrow": "SUMMIT PANELISTS",
      "speakers.title": "Distinguished Speakers",
      "speakers.desc": "Learn from global economic pioneers, sovereign trust managers, and pioneering market creators.",
      "speakers.s1.title": "Managing Partner, Gulf Venture Partners",
      "speakers.s1.desc": "Over 20 years facilitating institutional capital flows between Gulf sovereign funds and emerging markets.",
      "speakers.s2.title": "Director of Infrastructure Development",
      "speakers.s2.desc": "Leading macroeconomic initiatives for urban development and transport hubs across West Africa.",
      "speakers.s3.title": "Managing Director, West African Bank Group",
      "speakers.s3.desc": "Pioneering structural project financing and public-private partnership models in the UEMOA zone.",
      "partners.title": "SUPPORTED BY GLOBAL TRUSTED INSTITUTIONS",
      "gallery.eyebrow": "SUMMIT ATMOSPHERE",
      "gallery.title": "Media & Summit Gallery",
      "gallery.desc": "Glimpses of diplomatic collaboration, business signing ceremonies, and regional development projects.",
      "gallery.c1.title": "Bilateral Deal Signing",
      "gallery.c1.desc": "Abidjan 2026",
      "gallery.c2.title": "Real Estate Showcase",
      "gallery.c2.desc": "Architecture of the Future",
      "gallery.c3.title": "Investor Roundtable",
      "gallery.c3.desc": "Dubai & African Funds",
      "gallery.c4.title": "Dubai Excellence",
      "gallery.c4.desc": "Economic Partnership",
      "pricing.eyebrow": "PARTICIPATION GRID",
      "pricing.title": "Our Participation Packages",
      "pricing.desc": "Select the package best suited to your strategic objectives for this forum.",
      "pricing.prestige.badge": "RECOMMENDED",
      "pricing.prestige.name": "PASS PRESTIGE",
      "pricing.prestige.desc": "This package is designed for executives, investors, and VIPs wishing to benefit from a privileged participation.",
      "pricing.prestige.f1": "Number of passes included: 3 people",
      "pricing.prestige.f2": "Priority access to private B2B matchmaking sessions",
      "pricing.prestige.f3": "Access to the VIP lounge",
      "pricing.performance.name": "PASS PERFORMANCE",
      "pricing.performance.desc": "This package allows entrepreneurs, executives, and professionals to participate in the forum and develop their international network.",
      "pricing.performance.f1": "Individual participant pass",
      "pricing.performance.f2": "General access to conferences and panels",
      "pricing.performance.f3": "Access to the exhibition area",
      "contact.eyebrow": "SUMMIT ACCREDITATION",
      "contact.title": "Secure Your Exclusive Access",
      "contact.desc": "Attendance at the Dubai Business Investment Forum is strictly reserved for corporate leaders, private equity officers, government delegations, and accredited journalists.",
      "contact.venue.lbl": "Venue",
      "contact.venue.val": "ITC Hôtel Ivoire, Côte d'Ivoire",
      "contact.dates.lbl": "Summit Dates",
      "contact.dates.val": "Thursday, July 16, 2026",
      "contact.inquiry.lbl": "General Inquiry",
      "contact.form.title": "Accreditation Sheet",
      "contact.form.desc": "Please provide your corporate and participant details below.",
      "contact.form.section1": "1. Participant & Company Identity",
      "contact.form.section2": "2. Purpose of Participation",
      "contact.form.section3": "3. Desired Days of Participation",
      "contact.form.section4": "4. Attached Documents (If applicable)",
      "contact.form.company": "Company Name",
      "contact.form.company.ph": "e.g. Africa Capital Partners",
      "contact.form.sector": "Sector of Activity",
      "contact.form.select": "Select a sector...",
      "contact.form.opt1": "Agriculture & Agri-food",
      "contact.form.opt2": "Real Estate & Smart Cities",
      "contact.form.opt3": "Energy & Infrastructure",
      "contact.form.opt4": "Technology & FinTech",
      "contact.form.opt5": "Logistics & Transport",
      "contact.form.opt6": "Other",
      "contact.form.rep": "Representative Name",
      "contact.form.rep.ph": "e.g. Jean-Marc Konan",
      "contact.form.job": "Job Title / Position",
      "contact.form.job.ph": "e.g. Chief Executive Officer",
      "contact.form.country": "Country",
      "contact.form.country.ph": "e.g. Côte d'Ivoire",
      "contact.form.phone": "Phone Number",
      "contact.form.phone.ph": "e.g. +225 07 00 00 00 00",
      "contact.form.email": "Corporate Email Address",
      "contact.form.email.ph": "e.g. contact@company.com",
      "contact.form.m1": "Financing request",
      "contact.form.m2": "Partnership request",
      "contact.form.m3": "Company incorporation request in Dubai",
      "contact.form.m4": "Real estate investment opportunities",
      "contact.form.m5": "Meeting with trade finance / export credit companies",
      "contact.form.m6": "Booking for the September Investors & CEOs Forum",
      "contact.form.m7": "Other (specify)",
      "contact.form.m7.ph": "Please specify...",
      "contact.form.day1": "Day 1 — July 15 (Opening, Welcome Cocktail)",
      "contact.form.day2": "Day 2 — July 16 (Roundtables)",
      "contact.form.day3": "Day 3 — July 17 (Press Briefing, Launch Ceremony)",
      "contact.form.doc1": "Partnership file",
      "contact.form.doc2": "Financing request file",
      "contact.form.doc3": "Company presentation (Pitch deck)",
      "contact.form.doc4": "Other document",
      "contact.form.submit": "Submit Accreditation Form",
      "footer.logo.sub": "INVESTMENT FORUM",
      "footer.desc": "Unlocking bilateral trade corridors, joint investment infrastructure and high-yield capital pipelines connecting Côte d'Ivoire and Dubai.",
      "footer.core": "Summit Core",
      "footer.info": "Delegate Info",
      "footer.news": "Newsletter",
      "footer.news.desc": "Subscribe to receive high-level updates, bilateral economic alerts, and agenda notifications.",
      "footer.news.ph": "corporate@email.com",
      "footer.copy": "&copy; 2026 Dubai Business Investment Forum. All rights reserved.",
      "footer.terms": "Terms of Use",
      "footer.privacy": "Privacy Policy",
      "footer.grid": "Grid System Toggle (G)",
      "msg.invalid_email": "Please use a valid corporate email address. Webmail accounts (Gmail, Yahoo, etc.) are not accepted.",
      "msg.processing": "Processing Request...",
      "msg.register_success": "Thank you. Your accreditation credentials have been received. Our diplomatic relations officer will email you details within 48 hours.",
      "msg.newsletter_success": "Accredited to newsletter briefing list."
    },
    fr: {
      "popup.eyebrow": "DUBAI BUSINESS INVESTMENT FORUM",
      "popup.title": "PRÉ-FORUM",
      "popup.subtitle": "DUBAI & CÔTE D'IVOIRE",
      "popup.dates": "Jeudi 16 juillet 2026",
      "popup.location": "Abidjan · Côte d'Ivoire",
      "popup.btn": "VISITER",
      "shuffler.c1.title": "Abidjan Hub",
      "shuffler.c1.desc": "Point d'entrée corporatif",
      "shuffler.c2.title": "Dubai Chamber",
      "shuffler.c2.desc": "Connexion écosystème globale",
      "shuffler.c3.title": "Bilateral Trust",
      "shuffler.c3.desc": "Passeport réglementaire unifié",
      "nav.home": "Accueil",
      "nav.about": "À propos",
      "nav.forum": "Forum",
      "nav.opportunities": "Opportunités",
      "nav.pricing": "Tarifs",

      "nav.speakers": "Intervenants",
      "nav.program": "Programme",
      "nav.gallery": "Galerie",
      "nav.contact": "Contact",
      "nav.register": "S'inscrire",
      "nav.partner": "Devenir partenaire",
      "hero.eyebrow": "DUBAI BUSINESS INVESTMENT FORUM",
      "hero.title": "PRÉ-FORUM DUBAI INVESTMENT<br>CÔTE D'IVOIRE<br><span class=\"text-gold italic font-serif hero-edition\">Edition 2026</span>",
      "hero.subtitle": "100 entreprises ivoiriennes sélectionnées. Trois jours pour connecter Abidjan à Dubaï.",
      "hero.dates": "Jeudi 16 juillet 2026",
      "hero.card1.title": "La Passerelle",
      "hero.card1.desc": "Connecter les entreprises africaines d'élite et les entrepreneurs directement aux marchés de capitaux et à l'écosystème commercial de Dubaï.",
      "hero.card2.title": "Alignement stratégique",
      "hero.card2.desc": "Faciliter les accords commerciaux bilatéraux, les coentreprises majeures et le financement de projets durables dans des secteurs émergents hautement rentables.",
      "hero.card3.title": "Pipeline d'investissement",
      "hero.card3.desc": "Ouvrir l'accès aux fonds souverains, aux hubs de capital-investissement, aux capital-risqueurs et aux family offices de premier plan dans la région du Golfe.",
      "stats.leaders": "Entreprises",
      "stats.funds": "Fonds d'investissement",
      "stats.countries": "Deux écosystèmes économiques",
      "stats.opportunities": "Opportunités d'investissement",
      "stats.meetings": "Rencontres stratégiques",
      "about.badge.title": "ABIDJAN 2026",
      "about.badge.desc": "Siège du sommet",
      "about.eyebrow": "À PROPOS DU FORUM",
      "about.title": "Le pont stratégique entre l'Afrique de l'Ouest et le Golfe",
      "about.desc": "L'IVOIRE-DUBAI INVESTMENT FORUM 2026 marque la 3ᵉ édition d'un rendez-vous devenu incontournable entre la communauté d'affaires ouest-africaine et la Chambre de Commerce de Dubaï (Dubai Chambers). Pendant trois jours, Abidjan accueille une délégation dirigée par M. Cyril Darkwa, Représentant de la Chambre de Commerce de Dubaï pour l'Afrique de l'Ouest, pour un programme structuré autour de deux objectifs complémentaires :",
      "about.bullet1.title": "Faire connaître les opportunités de Dubaï",
      "about.bullet1.desc": "Présenter aux entrepreneurs, investisseurs et entreprises ivoiriens et ouest-africains les possibilités concrètes d'implantation, d'investissement et de développement commercial à Dubaï et dans les Émirats Arabes Unis.",
      "about.bullet2.title": "Identifier des partenariats concrets",
      "about.bullet2.desc": "Visiter des entreprises et institutions ivoiriennes clés, secteur par secteur, pour détecter des opportunités de partenariat, de flux d'investissement et de stratégies d'entrée sur le marché entre la Côte d'Ivoire et les EAU.",
      "about.footer": "100 entreprises ivoiriennes, sélectionnées à travers les principaux secteurs économiques du pays, participeront à ce forum.",
      "guest.badge": "Invité Spécial",
      "guest.eyebrow": "L'INVITÉ D'HONNEUR",
      "guest.name": "M. Cyril DARKWA",
      "guest.title": "Chief Representative de Dubai Chambers pour l'Afrique de l'Ouest",
      "guest.bio.title": "Biographie",
      "guest.bio.desc": "M. Cyril Darkwa représente la Chambre de Commerce de Dubaï auprès des marchés d'Afrique de l'Ouest. Fort d'une expertise reconnue dans le développement des échanges commerciaux internationaux, il accompagne depuis plusieurs années les entrepreneurs africains dans leur implantation aux Émirats arabes unis.",
      "guest.mission.title": "Mission",
      "guest.mission.desc": "Sa mission consiste à identifier, structurer et accompagner les opportunités de partenariat entre les entreprises d'Afrique de l'Ouest et l'écosystème économique de Dubaï - investisseurs, family offices, banques et zones franches.",
      "guest.role.title": "Rôle de Dubai Chambers en Afrique",
      "guest.role.desc": "Dubai Chambers agit comme le point d'entrée officiel pour toute entreprise africaine souhaitant s'implanter, investir ou commercer avec Dubaï, en facilitant l'accès aux réseaux d'affaires, aux financements et aux cadres réglementaires des Émirats arabes unis.",
      "why.eyebrow": "AVANTAGES EXÉCUTIFS",
      "why.title": "Catalyseurs économiques bilatéraux",
      "why.desc": "Découvrez pourquoi ce sommet relie deux des écosystèmes économiques les plus dynamiques et complémentaires au monde.",
      "why.dubai.title": "Pourquoi Dubaï ?",
      "why.dubai.subtitle": "Le hub financier mondial",
      "why.dubai.b1.title": "Propriété étrangère à 100%",
      "why.dubai.b1.desc": "Propriété opérationnelle totale dans les zones franches sans limites de rapatriement des capitaux.",
      "why.dubai.b2.title": "Avantages fiscaux & libre circulation",
      "why.dubai.b2.desc": "Structure d'imposition des sociétés extrêmement compétitive et absence d'imposition sur le revenu des personnes physiques.",
      "why.dubai.b3.title": "Logistique & connectivité mondiales",
      "why.dubai.b3.desc": "Plaques tournantes aéronautiques et maritimes de classe mondiale reliant l'Europe, l'Asie et l'Afrique.",
      "why.dubai.b4.title": "Écosystème d'innovation",
      "why.dubai.b4.desc": "Passerelle vers les hubs mondiaux de l'IA, les fonds de capital-risque, les bacs à sable fintech et les technologies web3.",
      "why.ci.title": "Pourquoi la Côte d'Ivoire ?",
      "why.ci.subtitle": "La locomotive de l'Afrique de l'Ouest",
      "why.ci.b1.title": "Économie africaine à croissance rapide",
      "why.ci.b1.desc": "Croissance constante des infrastructures à deux chiffres et stabilité macroéconomique et politique.",
      "why.ci.b2.title": "Porte d'entrée vers la zone UEMOA",
      "why.ci.b2.desc": "Un marché unique de plus de 120 millions de consommateurs utilisant un système monétaire stable.",
      "why.ci.b3.title": "Ports en eau profonde & expansion logistique",
      "why.ci.b3.desc": "Principaux ports stratégiques d'Abidjan et de San Pedro desservant les pays enclavés d'Afrique de l'Ouest.",
      "why.ci.b4.title": "Secteurs industriels inexploités",
      "why.ci.b4.desc": "Vastes potentiels d'investissement dans l'agriculture, l'énergie, l'exploitation minière, la technologie et le tourisme.",
      "opp.eyebrow": "PERSPECTIVES SECTORIELLES",
      "opp.title": "Opportunités d'investissement",
      "opp.desc": "Découvrez les douze secteurs d'investissement à haut rendement ciblés pour les flux de capitaux et les coentreprises pendant le sommet.",
      "opp.card1.title": "Immobilier",
      "opp.card1.desc": "Espaces commerciaux haut de gamme, propriétés résidentielles de luxe et développements commerciaux reliant les standards de Dubaï à Abidjan.",
      "opp.card2.title": "Infrastructures",
      "opp.card2.desc": "Autoroutes, réseaux ferroviaires, ports en eau profonde et développements de villes intelligentes façonnant l'avenir des transports en Afrique de l'Ouest.",
      "opp.card3.title": "Technologie",
      "opp.card3.desc": "Infrastructures cloud, réseaux de fibres optiques, centres de recherche en IA et parcs technologiques de pointe en Afrique de l'Ouest.",
      "opp.card4.title": "Agriculture",
      "opp.card4.desc": "Transformation industrielle du cacao, agro-industrie à haut rendement, chaînes du froid avancées et technologies agricoles automatisées.",
      "opp.card5.title": "Énergie",
      "opp.card5.desc": "Énergie hydroélectrique, parcs solaires, biomasse et infrastructures de gaz naturel assurant la stabilité des réseaux régionaux.",
      "opp.card6.title": "Santé",
      "opp.card6.desc": "Réseaux cliniques modernes, laboratoires de recherche régionaux, hôpitaux spécialisés et fabrication de produits pharmaceutiques.",
      "opp.card7.title": "Tourisme",
      "opp.card7.desc": "Complexes hôteliers de luxe, hôtellerie d'affaires, éco-lodges et développement culturel le long du golfe de Guinée.",
      "opp.card8.title": "Logistique",
      "opp.card8.desc": "Complexes de chaîne d'approvisionnement intelligents, hubs d'emballage industriels, systèmes de fret aérien et réseaux de ports secs.",
      "opp.card9.title": "Éducation",
      "opp.card9.desc": "Instituts technologiques bilingues, académies de formation professionnelle et centres universitaires pour cadres d'entreprise.",
      "opp.card10.title": "FinTech",
      "opp.card10.desc": "Systèmes de règlement transfrontaliers, rails bancaires mobiles, plateformes de micro-crédit et marchés d'actifs numériques.",
      "opp.card11.title": "Industrie",
      "opp.card11.desc": "Assemblage automobile, fabrication de matériaux de construction, production de biens de consommation et unités d'exportation régionales.",
      "opp.card12.title": "Zones industrielles",
      "opp.card12.desc": "Zones économiques spéciales (ZES) offrant des congés fiscaux, des exonérations douanières et des structures opérationnelles pré-construites.",

      "high.eyebrow": "POINTS FORTS DE L'AGENDA",
      "high.title": "Structure du forum & points forts",
      "high.desc": "Participez à des événements de réseautage exclusifs, des tables rondes gouvernementales bilatérales et des présentations de projets majeurs.",
      "high.card1.title": "Conférences internationales",
      "high.card1.desc": "Conférences de directeurs économiques mondiaux, d'analystes géopolitiques et de responsables d'investissement sur les corridors commerciaux Afrique-CCG.",
      "high.card2.title": "Matchmaking d'investissement B2B",
      "high.card2.desc": "Sessions privées planifiées mettant en relation des projets d'infrastructure africains validés avec des promoteurs et gestionnaires d'actifs du Golfe.",
      "high.card3.title": "Dialogues gouvernementaux",
      "high.card3.desc": "Discussions ministérielles de haut niveau établissant des cadres réglementaires, des traités de double imposition et des politiques d'investissement sur mesure.",
      "high.card4.title": "Pitch de start-ups & projets",
      "high.card4.desc": "Une plateforme sélective mettant en lumière les 20 scale-ups ouest-africaines à forte croissance se présentant devant des fonds de capital-risque et des family offices.",
      "high.card5.title": "Dîner de gala & distinctions",
      "high.card5.desc": "Un banquet de réseautage d'élite honorant les projets bilatéraux exceptionnels, les partenariats d'investissement pionniers et les leaders diplomatiques.",
      "high.card6.title": "Pavillons d'exposition",
      "high.card6.desc": "Zones d'exposition exclusives présentant des modèles d'infrastructure majeurs, des actifs agro-industriels et des plateformes technologiques des deux écosystèmes.",
      "speakers.eyebrow": "PANÉLISTES DU SOMMET",
      "speakers.title": "Intervenants de renom",
      "speakers.desc": "Apprenez auprès de pionniers de l'économie mondiale, de gestionnaires de fonds souverains et de créateurs de marchés innovants.",
      "speakers.s1.title": "Associé gérant, Gulf Venture Partners",
      "speakers.s1.desc": "Plus de 20 ans d'expérience dans la facilitation des flux de capitaux institutionnels entre les fonds souverains du Golfe et les marchés émergents.",
      "speakers.s2.title": "Directrice du développement des infrastructures",
      "speakers.s2.desc": "Dirige des initiatives macroéconomiques pour le développement urbain et les hubs de transport en Afrique de l'Ouest.",
      "speakers.s3.title": "Directeur général, West African Bank Group",
      "speakers.s3.desc": "Pionnier du financement structurel de projets et des modèles de partenariat public-privé dans la zone UEMOA.",
      "partners.title": "SOUTENU PAR DES INSTITUTIONS MONDIALES DE CONFIANCE",
      "gallery.eyebrow": "ATMOSPHÈRE DU SOMMET",
      "gallery.title": "Galerie média & du sommet",
      "gallery.desc": "Aperçus des collaborations diplomatiques, des cérémonies de signature d'accords et des projets de développement régionaux.",
      "gallery.c1.title": "Signature d'accord bilatéral",
      "gallery.c1.desc": "Abidjan 2026",
      "gallery.c2.title": "Présentation de l'immobilier",
      "gallery.c2.desc": "L'architecture du futur",
      "gallery.c3.title": "Table ronde des investisseurs",
      "gallery.c3.desc": "Dubaï & fonds africains",
      "gallery.c4.title": "Excellence de Dubaï",
      "gallery.c4.desc": "Partenariat économique",
      "pricing.eyebrow": "GRILLE DE PARTICIPATION",
      "pricing.title": "Nos Formules de Participation",
      "pricing.desc": "Sélectionnez la formule la plus adaptée à vos objectifs stratégiques pour ce forum.",
      "pricing.prestige.badge": "RECOMMANDÉ",
      "pricing.prestige.name": "PASS PRESTIGE",
      "pricing.prestige.desc": "Cette formule est destinée aux dirigeants, investisseurs et personnalités souhaitant bénéficier d'une participation privilégiée.",
      "pricing.prestige.f1": "Nombre de places incluses : 3 personnes",
      "pricing.prestige.f2": "Accès prioritaire aux sessions privées de matchmaking B2B",
      "pricing.prestige.f3": "Accès au lounge VIP",
      "pricing.performance.name": "PASS PERFORMANCE",
      "pricing.performance.desc": "Cette formule permet aux entrepreneurs, cadres et professionnels de participer au forum et de développer leur réseau international.",
      "pricing.performance.f1": "Participant individuel",
      "pricing.performance.f2": "Accès général aux conférences & tables rondes",
      "pricing.performance.f3": "Accès à l'espace d'exposition",
      "contact.eyebrow": "ACCRÉDITATION AU SOMMET",
      "contact.title": "Garantissez votre accès exclusif",
      "contact.desc": "La participation au Dubai Business Investment Forum est strictement réservée aux dirigeants d'entreprise, aux responsables de capital-investissement, aux délégations gouvernementales et aux journalistes accrédités.",
      "contact.venue.lbl": "Lieu",
      "contact.venue.val": "ITC Hôtel Ivoire, Côte d'Ivoire",
      "contact.dates.lbl": "Dates du sommet",
      "contact.dates.val": "Jeudi 16 juillet 2026",
      "contact.inquiry.lbl": "Demande générale",
      "contact.form.title": "Fiche d'Accréditation",
      "contact.form.desc": "Veuillez fournir les détails professionnels de votre entreprise ci-dessous.",
      "contact.form.section1": "1. Identité du participant / de l'entreprise",
      "contact.form.section2": "2. Motif de la participation",
      "contact.form.section3": "3. Journées de participation souhaitées",
      "contact.form.section4": "4. Documents joints (le cas échéant)",
      "contact.form.company": "Nom de l'entreprise",
      "contact.form.company.ph": "ex. Africa Capital Partners",
      "contact.form.sector": "Secteur d'activité",
      "contact.form.select": "Sélectionnez un secteur...",
      "contact.form.opt1": "Agriculture & Agroalimentaire",
      "contact.form.opt2": "Immobilier & Smart Cities",
      "contact.form.opt3": "Énergie & Infrastructures",
      "contact.form.opt4": "Technologie & FinTech",
      "contact.form.opt5": "Logistique & Transport",
      "contact.form.opt6": "Autre",
      "contact.form.rep": "Nom du représentant",
      "contact.form.rep.ph": "ex. Jean-Marc Konan",
      "contact.form.job": "Fonction",
      "contact.form.job.ph": "ex. Directeur Général",
      "contact.form.country": "Pays",
      "contact.form.country.ph": "ex. Côte d'Ivoire",
      "contact.form.phone": "Téléphone",
      "contact.form.phone.ph": "ex. +225 07 00 00 00 00",
      "contact.form.email": "E-mail",
      "contact.form.email.ph": "ex. contact@entreprise.com",
      "contact.form.m1": "Demande de financement",
      "contact.form.m2": "Demande de partenariat",
      "contact.form.m3": "Demande de création d'entreprise à Dubaï",
      "contact.form.m4": "Opportunités d'investissement immobilier",
      "contact.form.m5": "Rencontre avec des sociétés de trade finance (crédits export)",
      "contact.form.m6": "Réservation pour le Forum des Investisseurs et CEO de septembre",
      "contact.form.m7": "Autre (préciser)",
      "contact.form.m7.ph": "Veuillez préciser...",
      "contact.form.day1": "Jour 1 — 15 juillet (Ouverture, cocktail de bienvenue)",
      "contact.form.day2": "Jour 2 — 16 juillet (Tables rondes)",
      "contact.form.day3": "Jour 3 — 17 juillet (Point de presse, cérémonie de lancement)",
      "contact.form.doc1": "Dossier de partenariat",
      "contact.form.doc2": "Dossier de demande de financement",
      "contact.form.doc3": "Présentation de l'entreprise (Pitch deck)",
      "contact.form.doc4": "Autre document",
      "contact.form.submit": "Soumettre la demande d'accréditation",
      "footer.logo.sub": "FORUM D'INVESTISSEMENT",
      "footer.desc": "Libérer des corridors commerciaux bilatéraux, des infrastructures d'investissement conjointes et des flux de capitaux à haut rendement reliant la Côte d'Ivoire et Dubaï.",
      "footer.core": "Cœur du sommet",
      "footer.info": "Infos délégués",
      "footer.news": "Newsletter",
      "footer.news.desc": "Abonnez-vous pour recevoir des mises à jour de haut niveau, des alertes économiques bilatérales et des notifications d'agenda.",
      "footer.news.ph": "entreprise@email.com",
      "footer.copy": "&copy; 2026 Dubai Business Investment Forum. Tous droits réservés.",
      "footer.terms": "Conditions d'utilisation",
      "footer.privacy": "Politique de confidentialité",
      "footer.grid": "Afficher la grille (G)",
      "msg.invalid_email": "Veuillez utiliser une adresse e-mail professionnelle valide. Les adresses personnelles (Gmail, Yahoo, etc.) ne sont pas acceptées.",
      "msg.processing": "Traitement de la demande...",
      "msg.register_success": "Merci. Vos informations d'accréditation ont été reçues. Notre responsable des relations diplomatiques vous contactera par e-mail sous 48 heures.",
      "msg.newsletter_success": "Inscription à la newsletter validée."
    }
  };

  const updateLanguage = (lang) => {
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (translations[lang] && translations[lang][key] !== undefined) {
        el.innerHTML = translations[lang][key];
      }
    });

    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
      const key = el.getAttribute('data-i18n-placeholder');
      if (translations[lang] && translations[lang][key] !== undefined) {
        el.setAttribute('placeholder', translations[lang][key]);
      }
    });

    localStorage.setItem('preferredLang', lang);

    const langSelect = document.getElementById('lang-select');
    if (langSelect) {
      langSelect.value = lang;
    }
    
    document.documentElement.setAttribute('lang', lang);
  };

  const langSelect = document.getElementById('lang-select');
  if (langSelect) {
    langSelect.addEventListener('change', (e) => {
      updateLanguage(e.target.value);
      if (typeof alignDisplayInk === 'function') {
        alignDisplayInk();
      }
    });
  }

  const savedLang = localStorage.getItem('preferredLang');
  const defaultLang = savedLang || (navigator.language.startsWith('fr') ? 'fr' : 'en');
  updateLanguage(defaultLang);

  // Initialize and display the intro pop-up, locking background scroll
  document.body.classList.add('intro-popup-active');
  const introPopup = document.getElementById('intro-popup');
  if (introPopup) {
    // Show pop-up after a slight layout delay
    setTimeout(() => {
      introPopup.classList.add('active');
    }, 100);

    const visitBtn = document.getElementById('intro-popup-btn');
    if (visitBtn) {
      visitBtn.addEventListener('click', () => {
        // Animate pop-up elements out with premium easing
        gsap.to('.intro-popup-card', {
          opacity: 0,
          scale: 0.9,
          duration: 0.5,
          ease: 'power3.in'
        });

        gsap.to('#intro-popup', {
          opacity: 0,
          duration: 0.6,
          ease: 'power3.inOut',
          onComplete: () => {
            introPopup.style.display = 'none';
            document.body.classList.remove('intro-popup-active');
            
            // Re-align layout spacing after unlocking
            if (typeof alignDisplayInk === 'function') {
              alignDisplayInk();
            }
          }
        });
      });
    }
  }

  alignDisplayInk();
  window.addEventListener('resize', alignDisplayInk);
});

/* ==========================================================================
   DUBAI BUSINESS INVESTMENT FORUM – CÔTE D'IVOIRE 2026
   Interactive JS Engine (Particles, Matchmaker Canvas, Scroll Animation)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

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
  // 4. SCROLL REVEAL (INTERSECTION OBSERVER) & STATS COUNTERS
  // ==========================================================================
  const revealElements = document.querySelectorAll('[data-reveal]');
  
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const delay = entry.target.getAttribute('data-delay') || 0;
        // Reduce the artificial stagger delay to make elements appear faster
        const fastDelay = delay ? delay / 2 : 0; 
        setTimeout(() => {
          entry.target.classList.add('revealed');
        }, fastDelay);
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0,
    rootMargin: '0px 0px 150px 0px'
  });

  revealElements.forEach(el => revealObserver.observe(el));

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
    registerForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const email = document.getElementById('reg-email').value;
      const isCorporate = !/gmail\.com$|yahoo\.com$|hotmail\.com$|outlook\.com$|mail\.ru$/i.test(email);
      const currentLang = localStorage.getItem('preferredLang') || 'en';

      if (!isCorporate) {
        formMsg.className = "form-feedback error";
        formMsg.textContent = translations[currentLang]["msg.invalid_email"];
        return;
      }

      submitBtn.disabled = true;
      submitBtn.querySelector('span').textContent = translations[currentLang]["msg.processing"];

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
      "nav.about": "About",
      "nav.forum": "Forum",
      "nav.opportunities": "Opportunities",

      "nav.speakers": "Speakers",
      "nav.program": "Program",
      "nav.gallery": "Gallery",
      "nav.contact": "Contact",
      "nav.register": "Register Now",
      "nav.partner": "Become a Partner",
      "hero.eyebrow": "DUBAI BUSINESS INVESTMENT FORUM",
      "hero.title": "DUBAI INVESTMENT<br>FORUM, CÔTE D'IVOIRE<br><span class=\"text-gold italic font-serif hero-edition\">Edition 2026</span>",
      "hero.subtitle": "100 selected Ivorian companies. Three days to connect Abidjan to Dubai.",
      "hero.dates": "July 15 · 16 · 17, 2026",
      "hero.visitors": "15,000 Visitors",
      "hero.card1.title": "The Gateway",
      "hero.card1.desc": "Connecting elite African companies, government agencies, and entrepreneurs directly to the capital markets and business ecosystem of Dubai.",
      "hero.card2.title": "Strategic Alignment",
      "hero.card2.desc": "Facilitating bilateral trade agreements, major joint ventures, and sustainable project financing in highly profitable emerging sectors.",
      "hero.card3.title": "Investment Pipeline",
      "hero.card3.desc": "Unlocking access to sovereign wealth funds, private equity hubs, venture capitalists, and premium family offices in the Gulf region.",
      "stats.leaders": "Business Leaders",
      "stats.funds": "Investment Funds",
      "stats.countries": "Countries",
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
      "why.ci.subtitle": "The Gateway to West Africa",
      "why.ci.b1.title": "Fastest Growing African Economy",
      "why.ci.b1.desc": "Consistent double-digit infrastructure growth and political macroeconomic stability.",
      "why.ci.b2.title": "Gateway to the UEMOA Region",
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
      "contact.eyebrow": "SUMMIT ACCREDITATION",
      "contact.title": "Secure Your Exclusive Access",
      "contact.desc": "Attendance at the Dubai Business Investment Forum is strictly reserved for corporate leaders, private equity officers, government delegations, and accredited journalists.",
      "contact.venue.lbl": "Venue",
      "contact.dates.lbl": "Summit Dates",
      "contact.dates.val": "July 15, 16 and 17, 2026",
      "contact.inquiry.lbl": "General Inquiry",
      "contact.form.title": "Delegate Accreditation",
      "contact.form.desc": "Please supply your professional credentials below.",
      "contact.form.name": "Full Name",
      "contact.form.name.ph": "e.g. Jean-Marc Konan",
      "contact.form.org": "Organization",
      "contact.form.org.ph": "e.g. Africa Capital Partners",
      "contact.form.role": "Job Title",
      "contact.form.role.ph": "e.g. Chief Investment Officer",
      "contact.form.email": "Corporate Email Address",
      "contact.form.email.ph": "e.g. jm.konan@africacapital.com",
      "contact.form.sector": "Primary Sector of Interest",
      "contact.form.select": "Select interest area...",
      "contact.form.opt1": "Real Estate & Smart Cities",
      "contact.form.opt2": "Infrastructure & Logistics",
      "contact.form.opt3": "Technology & FinTech",
      "contact.form.opt4": "Energy & Power Grid",
      "contact.form.opt5": "Agriculture & Food Processing",
      "contact.form.opt6": "Government Partnerships",
      "contact.form.submit": "Submit Accreditation Request",
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
      "nav.about": "À propos",
      "nav.forum": "Forum",
      "nav.opportunities": "Opportunités",

      "nav.speakers": "Intervenants",
      "nav.program": "Programme",
      "nav.gallery": "Galerie",
      "nav.contact": "Contact",
      "nav.register": "S'inscrire",
      "nav.partner": "Devenir partenaire",
      "hero.eyebrow": "DUBAI BUSINESS INVESTMENT FORUM",
      "hero.title": "DUBAI INVESTMENT<br>FORUM, CÔTE D'IVOIRE<br><span class=\"text-gold italic font-serif hero-edition\">Edition 2026</span>",
      "hero.subtitle": "100 entreprises ivoiriennes sélectionnées. Trois jours pour connecter Abidjan à Dubaï.",
      "hero.dates": "15 · 16 · 17 Juillet 2026",
      "hero.visitors": "15 000 Visiteurs",
      "hero.card1.title": "La Passerelle",
      "hero.card1.desc": "Connecter les entreprises africaines d'élite, les agences gouvernementales et les entrepreneurs directement aux marchés de capitaux et à l'écosystème commercial de Dubaï.",
      "hero.card2.title": "Alignement stratégique",
      "hero.card2.desc": "Faciliter les accords commerciaux bilatéraux, les coentreprises majeures et le financement de projets durables dans des secteurs émergents hautement rentables.",
      "hero.card3.title": "Pipeline d'investissement",
      "hero.card3.desc": "Ouvrir l'accès aux fonds souverains, aux hubs de capital-investissement, aux capital-risqueurs et aux family offices de premier plan dans la région du Golfe.",
      "stats.leaders": "Chefs d'entreprise",
      "stats.funds": "Fonds d'investissement",
      "stats.countries": "Pays",
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
      "why.ci.subtitle": "La porte d'entrée de l'Afrique de l'Ouest",
      "why.ci.b1.title": "Économie africaine à croissance rapide",
      "why.ci.b1.desc": "Croissance constante des infrastructures à deux chiffres et stabilité macroéconomique et politique.",
      "why.ci.b2.title": "Porte d'entrée vers la région UEMOA",
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
      "contact.eyebrow": "ACCRÉDITATION AU SOMMET",
      "contact.title": "Garantissez votre accès exclusif",
      "contact.desc": "La participation au Dubai Business Investment Forum est strictement réservée aux dirigeants d'entreprise, aux responsables de capital-investissement, aux délégations gouvernementales et aux journalistes accrédités.",
      "contact.venue.lbl": "Lieu",
      "contact.dates.lbl": "Dates du sommet",
      "contact.dates.val": "15, 16 et 17 juillet 2026",
      "contact.inquiry.lbl": "Demande générale",
      "contact.form.title": "Accréditation des délégués",
      "contact.form.desc": "Veuillez fournir vos informations professionnelles ci-dessous.",
      "contact.form.name": "Nom complet",
      "contact.form.name.ph": "ex. Jean-Marc Konan",
      "contact.form.org": "Organisation",
      "contact.form.org.ph": "ex. Africa Capital Partners",
      "contact.form.role": "Titre du poste",
      "contact.form.role.ph": "ex. Chief Investment Officer",
      "contact.form.email": "Adresse e-mail professionnelle",
      "contact.form.email.ph": "ex. jm.konan@africacapital.com",
      "contact.form.sector": "Secteur d'intérêt principal",
      "contact.form.select": "Sélectionnez un secteur d'intérêt...",
      "contact.form.opt1": "Immobilier & Villes intelligentes",
      "contact.form.opt2": "Infrastructures & Logistique",
      "contact.form.opt3": "Technologie & FinTech",
      "contact.form.opt4": "Énergie & Réseau électrique",
      "contact.form.opt5": "Agriculture & Agroalimentaire",
      "contact.form.opt6": "Partenariats gouvernementaux",
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

  alignDisplayInk();
  window.addEventListener('resize', alignDisplayInk);
});

/**
 * K. N. BHANDARI — CINEMATIC PERSONAL LEGACY WEBSITE
 * Motion & Interactivity Engine (GSAP, ScrollTrigger, Archival Gallery, Mobile Drawer)
 */

document.addEventListener('DOMContentLoaded', () => {
  initHeroMotion();
  initScrollAnimations();
  initHorizontalGallery();
  initSearchCatalog();
});

// --------------------------------------------------------------------------
// 1. HERO ENTRANCE ANIMATION (Slow, deliberate, cinematic)
// --------------------------------------------------------------------------
function initHeroMotion() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  if (typeof gsap === 'undefined') return;

  const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

  // Archival collage panels staggered reveal
  tl.from('.hero-collage-panel', {
    duration: 1.4,
    opacity: 0,
    y: 35,
    scale: 0.96,
    stagger: 0.12,
    delay: 0.2
  });

  // Small uppercase label
  tl.from('.hero-label', {
    duration: 1.0,
    opacity: 0,
    y: 15,
    letterSpacing: '0.4em'
  }, '-=1.0');

  // Main heading lines
  tl.from('.hero-title-line-1', {
    duration: 1.2,
    opacity: 0,
    y: 40,
    rotateX: -10
  }, '-=0.8');

  tl.from('.hero-title-line-2', {
    duration: 1.3,
    opacity: 0,
    y: 45,
    rotateX: -15
  }, '-=0.9');

  // Supporting narrative
  tl.from('.hero-desc', {
    duration: 1.1,
    opacity: 0,
    y: 25
  }, '-=0.8');

  // CTA button and badges
  tl.from('.hero-cta-group', {
    duration: 1.0,
    opacity: 0,
    y: 20
  }, '-=0.7');
}

// --------------------------------------------------------------------------
// 2. SCROLL REVEALS & PARALLAX
// --------------------------------------------------------------------------
function initScrollAnimations() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

  gsap.registerPlugin(ScrollTrigger);

  // Section Headers Reveal
  gsap.utils.toArray('.reveal-header').forEach(header => {
    gsap.from(header, {
      scrollTrigger: {
        trigger: header,
        start: 'top 85%',
        toggleActions: 'play none none none'
      },
      duration: 1.2,
      opacity: 0,
      y: 40,
      ease: 'power3.out'
    });
  });

  // Milestone Cards Stagger
  gsap.from('.milestone-card', {
    scrollTrigger: {
      trigger: '.milestones-grid',
      start: 'top 80%'
    },
    duration: 1.2,
    opacity: 0,
    y: 50,
    stagger: 0.2,
    ease: 'power3.out'
  });

  // Archival Story Cards
  gsap.utils.toArray('.editorial-card').forEach(card => {
    gsap.from(card, {
      scrollTrigger: {
        trigger: card,
        start: 'top 88%'
      },
      duration: 1.1,
      opacity: 0,
      y: 35,
      ease: 'power2.out'
    });
  });

  // Parallax subtle background movement
  gsap.utils.toArray('.parallax-image').forEach(img => {
    gsap.to(img, {
      scrollTrigger: {
        trigger: img,
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1.5
      },
      y: -30,
      ease: 'none'
    });
  });
}

// --------------------------------------------------------------------------
// 3. HORIZONTAL ARCHIVAL GALLERY (Section 4)
// --------------------------------------------------------------------------
function initHorizontalGallery() {
  const track = document.getElementById('horizontal-gallery-track');
  const prevBtn = document.getElementById('gallery-prev-btn');
  const nextBtn = document.getElementById('gallery-next-btn');
  if (!track) return;

  if (prevBtn && nextBtn) {
    prevBtn.addEventListener('click', () => {
      track.scrollBy({ left: -420, behavior: 'smooth' });
    });
    nextBtn.addEventListener('click', () => {
      track.scrollBy({ left: 420, behavior: 'smooth' });
    });
  }
}

// --------------------------------------------------------------------------
// 4. MOBILE NAVIGATION DRAWER
// --------------------------------------------------------------------------
function toggleMobileMenu() {
  const drawer = document.getElementById('mobile-drawer');
  if (!drawer) return;
  drawer.classList.toggle('hidden');
  document.body.classList.toggle('overflow-hidden', !drawer.classList.contains('hidden'));
}

// --------------------------------------------------------------------------
// 5. SEARCH CATALOG & COMMAND PALETTE (Ctrl+K)
// --------------------------------------------------------------------------
const searchDatabase = [
  { title: "One Life. Many Chapters.", category: "Monograph", url: "index.html", snippet: "The life, work and enduring legacy of Mr. Kailash Nath Bhandari." },
  { title: "Biographical Record & Jodhpur University", category: "Biography", url: "about.html", snippet: "Jodhpur University BA 1960, LLB 1962, five decades of public leadership." },
  { title: "Career Chronology (1960–2024)", category: "Journey", url: "journey.html", snippet: "Interactive vertical timeline tracing 64 years of institutional stewardship." },
  { title: "United India Assurance Company (1998–2000)", category: "Leadership", url: "leadership.html#united-india", snippet: "Chairman-cum-Managing Director guiding national restructuring and solvency." },
  { title: "The New India Assurance Company (2000–2002)", category: "Leadership", url: "leadership.html#new-india", snippet: "CMD presiding over 28 global branch offices and domestic expansion." },
  { title: "Hindalco Industries Board Stewardship (2006–2024)", category: "Governance", url: "governance.html#hindalco", snippet: "18 years as Independent Director on Aditya Birla Group metals flagship." },
  { title: "Magma HDI & Boardroom Committees", category: "Governance", url: "governance.html#magma", snippet: "Audit and Policyholders' Protection committee leadership." },
  { title: "Education & National Law University, Jodhpur", category: "Contributions", url: "contributions.html#nluj", snippet: "Founder Honorary Director, School of Insurance Studies at NLU Jodhpur." },
  { title: "President, Shri Oswal Singh Sabha Jodhpur", category: "Contributions", url: "contributions.html#jodhpur", snippet: "Stewarding 125-year Sardar School and Netraheen Vikas Sansthan Blind School." },
  { title: "Curatorial Office & Professional Enquiries", category: "Contact", url: "contact.html", snippet: "Official registry and curatorial secretariat in Mumbai and Jodhpur." }
];

function openSearchModal() {
  const modal = document.getElementById('search-modal');
  if (modal) {
    modal.classList.remove('hidden');
    const input = document.getElementById('search-input');
    if (input) {
      input.value = '';
      input.focus();
      renderSearchResults('');
    }
  }
}

function closeSearchModal() {
  const modal = document.getElementById('search-modal');
  if (modal) modal.classList.add('hidden');
}

function renderSearchResults(q) {
  const container = document.getElementById('search-results');
  if (!container) return;
  const query = q.toLowerCase().trim();
  const results = query ? searchDatabase.filter(item => 
    item.title.toLowerCase().includes(query) || 
    item.snippet.toLowerCase().includes(query) || 
    item.category.toLowerCase().includes(query)
  ) : searchDatabase.slice(0, 6);

  if (!results.length) {
    container.innerHTML = `<div class="p-8 text-center text-xs text-charcoal/60">No archival documents found matching "${q}".</div>`;
    return;
  }

  container.innerHTML = results.map(item => `
    <a href="${item.url}" class="block p-4 border-b border-[#651D2A]/15 hover:bg-[#651D2A]/5 transition-colors group">
      <div class="flex items-center justify-between">
        <span class="font-display font-semibold text-lg text-[#310D15] group-hover:text-[#651D2A] transition-colors">${item.title}</span>
        <span class="text-[10px] uppercase font-mono px-2 py-0.5 bg-[#651D2A]/10 text-[#651D2A] border border-[#651D2A]/20 rounded">${item.category}</span>
      </div>
      <p class="text-xs text-[#252222]/70 mt-1">${item.snippet}</p>
    </a>
  `).join('');
}

document.addEventListener('keydown', (e) => {
  if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
    e.preventDefault();
    openSearchModal();
  }
  if (e.key === 'Escape') {
    closeSearchModal();
    const drawer = document.getElementById('mobile-drawer');
    if (drawer && !drawer.classList.contains('hidden')) {
      toggleMobileMenu();
    }
  }
});

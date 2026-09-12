/* ==========================================================================
   Main — entry point. Boots site metadata, lists, carousels, filters.
   ========================================================================== */

(async function main() {
  // 1. Site metadata (every page)
  const site = await Data.loadSite();
  Data.renderSiteMeta(site);
  Data.setActiveNav();

  // 2. Nav
  Nav.init();

  // 3. Reveal on scroll
  initReveal();

  // 4. Page-specific
  const page = document.body.dataset.page;

  if (page === "home") {
    await loadHome();
  } else if (page === "works") {
    await loadWorks();
  } else if (page === "articles") {
    await loadArticles();
  } else if (page === "albums") {
    await loadAlbums();
  } else if (page === "albums-detail") {
    await loadAlbumDetail();
  } else if (page === "videos") {
    await loadVideos();
  } else if (page === "documents") {
    await loadDocuments();
  } else if (page === "presentations") {
    await loadPresentations();
  } else if (page === "about") {
    await loadAbout();
  }

  // 5. Video modal click handler (always available)
  Carousel.initVideoModal();
})();

async function loadHome() {
  const worksData = await Data.loadJson("works.json");
  const articlesData = await Data.loadJson("articles.json");

  const featured = (worksData?.works || []).filter(w => w.featured).slice(0, 3);
  const featuredEl = document.querySelector("#featured-works");
  if (featuredEl) Data.renderWorksGrid(featuredEl, featured);

  const recentArticles = (articlesData?.articles || []).slice(0, 3);
  const articlesEl = document.querySelector("#recent-articles");
  if (articlesEl) Data.renderArticlesList(articlesEl, recentArticles);
}

async function loadWorks() {
  const data = await Data.loadJson("works.json");
  const list = data?.works || [];

  // Populate filter bar dynamically if empty
  const filterBar = document.querySelector(".filter-bar");
  if (filterBar && filterBar.children.length === 0) {
    const tags = new Set();
    list.forEach(w => (w.tags || []).forEach(t => tags.add(t)));
    const tagsArr = ["all", ...tags];
    filterBar.innerHTML = tagsArr.map(t =>
      `<button class="filter-btn ${t === 'all' ? 'active' : ''}" data-tag="${t}">${t === 'all' ? '全部' : t}<span class="filter-count"></span></button>`
    ).join("");
  }

  const container = document.querySelector("#works-list");
  if (container) {
    Data.renderWorksGrid(container, list);
  }

  Filter.init(".filter-bar", "#works-list .card", "tags");
}

async function loadArticles() {
  const data = await Data.loadJson("articles.json");
  const list = data?.articles || [];

  const filterBar = document.querySelector(".filter-bar");
  if (filterBar && filterBar.children.length === 0) {
    const tags = new Set();
    list.forEach(a => (a.tags || []).forEach(t => tags.add(t)));
    const tagsArr = ["all", ...tags];
    filterBar.innerHTML = tagsArr.map(t =>
      `<button class="filter-btn ${t === 'all' ? 'active' : ''}" data-tag="${t}">${t === 'all' ? '全部' : t}<span class="filter-count"></span></button>`
    ).join("");
  }

  const container = document.querySelector("#articles-list");
  if (container) {
    Data.renderArticlesList(container, list);
  }

  Filter.init(".filter-bar", "#articles-list .article-card", "tags");
}

async function loadAlbums() {
  const data = await Data.loadJson("albums.json");
  const list = data?.albums || [];
  const container = document.querySelector("#albums-list");
  if (container) Data.renderAlbumsGrouped(container, list);
}

async function loadAlbumDetail() {
  const slug = new URLSearchParams(window.location.search).get("id") ||
               document.body.dataset.albumId;
  if (!slug) return;

  const data = await Data.loadJson("albums.json");
  const album = (data?.albums || []).find(a => a.id === slug);
  if (!album) return;

  // Set page title etc
  document.title = `${album.title} · 相册`;

  // Render title
  const titleEl = document.querySelector("[data-album-title]");
  if (titleEl) titleEl.textContent = album.title;
  const dateEl = document.querySelector("[data-album-date]");
  if (dateEl) dateEl.textContent = album.date || "";
  const descEl = document.querySelector("[data-album-desc]");
  if (descEl) descEl.textContent = album.description || "";
  const tagEl = document.querySelector("[data-album-tag]");
  if (tagEl) tagEl.textContent = album.tag || "";

  // Render swiper slides
  const wrapper = document.querySelector(".album-swiper .swiper-wrapper");
  if (wrapper) {
    wrapper.innerHTML = (album.photos || []).map(p => `
      <div class="swiper-slide">
        <img src="${p.src}" alt="${p.caption || ''}" loading="lazy" onerror="this.outerHTML='<div style=&quot;width:100%;height:100%;background:linear-gradient(135deg,#FF7262,#A259FF);display:flex;align-items:center;justify-content:center;color:white;font-weight:600;&quot;>${p.caption || ''}</div>'" />
        ${p.caption ? `<p class="caption">${p.caption}</p>` : ""}
      </div>
    `).join("");
  }

  // Init swiper
  Carousel.initAlbumSwiper(album.photos || []);
}

async function loadVideos() {
  const data = await Data.loadJson("videos.json");
  const list = data?.videos || [];

  // Carousel
  const carouselEl = document.querySelector("#video-carousel");
  if (carouselEl) {
    Data.renderVideoCarousel(carouselEl, list);
    setTimeout(() => Carousel.initVideoSwiper(), 100);
  }

  // Grid (all)
  const gridEl = document.querySelector("#video-grid");
  if (gridEl) {
    Data.renderVideoGrid(gridEl, list);
  }
}

async function loadDocuments() {
  const data = await Data.loadJson("documents.json");
  const list = data?.documents || [];
  const container = document.querySelector("#docs-list");
  if (container) Data.renderDocumentsList(container, list);
}

async function loadPresentations() {
  const data = await Data.loadJson("presentations.json");
  const list = data?.presentations || [];
  const container = document.querySelector("#presentations-list");
  if (container) Data.renderPresentationsGrid(container, list);
}

async function loadAbout() {
  // Site data already loaded. Render education/experience/awards from site.json
  const site = await Data.loadSite();
  if (!site) return;

  // Education
  const eduEl = document.querySelector("#edu-list");
  if (eduEl && site.education) {
    eduEl.innerHTML = site.education.map(e => `
      <div class="timeline-item">
        <span class="timeline-date">${e.year || ""}</span>
        <h4>${e.school || ""}</h4>
        <div class="org">${e.major || ""} · ${e.degree || ""}</div>
        <p>${e.desc || ""}</p>
      </div>
    `).join("");
  }

  // Experience
  const expEl = document.querySelector("#exp-list");
  if (expEl && site.experience) {
    expEl.innerHTML = site.experience.map(e => `
      <div class="timeline-item">
        <span class="timeline-date">${e.period || ""}</span>
        <h4>${e.role || ""}</h4>
        <div class="org">${e.company || ""}</div>
        <p>${e.desc || ""}</p>
      </div>
    `).join("");
  }

  // Skills
  const skillsEl = document.querySelector("#skills-list");
  if (skillsEl && site.skills) {
    const groups = Array.isArray(site.skills[0]?.items) ? site.skills : [{ category: "技能", items: site.skills }];
    skillsEl.innerHTML = groups.map(g => `
      <div class="skill-group">
        <h3>${g.category || "技能"}</h3>
        <div class="skill-list">
          ${(g.items || []).map(s => `<span class="skill">${s}</span>`).join("")}
        </div>
      </div>
    `).join("");
  }

  // Awards
  const awardsEl = document.querySelector("#awards-list");
  if (awardsEl && site.awards) {
    awardsEl.innerHTML = site.awards.map(a => `
      <div class="award-item">
        <div>
          <div class="award-title">${a.title || ""}</div>
          <div class="award-org">${a.org || ""}</div>
        </div>
        <div class="award-year">${a.year || ""}</div>
      </div>
    `).join("");
  }
}

function initReveal() {
  const els = document.querySelectorAll(".reveal");
  if (!els.length || !("IntersectionObserver" in window)) {
    els.forEach(e => e.classList.add("is-visible"));
    return;
  }
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });
  els.forEach(el => io.observe(el));
}

/* ==========================================================================
   Data loader & renderers — fetch JSON, render list/detail
   ========================================================================== */

const Data = (() => {
  // Resolve data path relative to the current page
  // - root: index.html, about.html, etc. → /data/...
  // - detail: works/foo.html → ../data/...
  function dataUrl(filename) {
    const inSubfolder = window.location.pathname.split("/").filter(Boolean).length > 1 &&
                        !/index\.html$|\.html$/.test(window.location.pathname.split("/").pop() || "");
    const depth = window.location.pathname.split("/").filter(p => p && !p.endsWith(".html")).length;
    // Works/articles/albums subfolder pages are 1 level deep (works/foo.html)
    const isSubPage = /\/(works|articles|albums|presentations)\/[^/]+\.html$/.test(window.location.pathname);
    const prefix = isSubPage ? "../" : "";
    return `${prefix}data/${filename}`;
  }

  // Cache to avoid refetching
  const cache = {};

  async function loadJson(name) {
    if (cache[name]) return cache[name];
    try {
      const res = await fetch(dataUrl(name));
      if (!res.ok) throw new Error(`Failed to load ${name}: ${res.status}`);
      const data = await res.json();
      cache[name] = data;
      return data;
    } catch (e) {
      console.error("[Data] load error:", e);
      return null;
    }
  }

  // === Render helpers ===
  function el(tag, attrs = {}, children = []) {
    const e = document.createElement(tag);
    Object.entries(attrs).forEach(([k, v]) => {
      if (k === "class") e.className = v;
      else if (k === "html") e.innerHTML = v;
      else if (k === "text") e.textContent = v;
      else if (k.startsWith("data-")) e.setAttribute(k, v);
      else if (k === "style" && typeof v === "object") Object.assign(e.style, v);
      else e.setAttribute(k, v);
    });
    (Array.isArray(children) ? children : [children]).forEach(c => {
      if (c == null) return;
      if (typeof c === "string") e.appendChild(document.createTextNode(c));
      else e.appendChild(c);
    });
    return e;
  }

  function tagClass(tag) {
    const palette = ["purple", "pink", "blue", "mint", "yellow", "dark"];
    let h = 0;
    for (let i = 0; i < tag.length; i++) h = (h * 31 + tag.charCodeAt(i)) | 0;
    return `tag-${palette[Math.abs(h) % palette.length]}`;
  }

  function tagEl(tag) {
    return el("span", { class: `tag ${tagClass(tag)}`, text: tag });
  }

  // === Works ===
  function renderWorksGrid(container, works) {
    container.innerHTML = "";
    if (!works || !works.length) {
      container.appendChild(el("div", { class: "empty", html: "<h3>暂无作品</h3><p>添加新作品请看「添加作品」教程页。</p>" }));
      return;
    }
    const grid = el("div", { class: "grid grid-3" });
    works.forEach(w => grid.appendChild(renderWorkCard(w)));
    container.appendChild(grid);
  }

  function renderWorkCard(w) {
    const link = el("a", { class: "card", href: w.url || `works/${w.id}.html` });
    const cover = el("div", { class: "card-cover", html: `<img src="${w.cover}" alt="${w.title}" loading="lazy" onerror="this.outerHTML='<div style=&quot;width:100%;height:100%;display:flex;align-items:center;justify-content:center;background:linear-gradient(135deg,#A259FF,#FF7262);color:white;font-weight:600;&quot;>${w.title}</div>'" />` });
    const body = el("div", { class: "card-body" }, [
      el("div", { class: "card-tags" }, (w.tags || []).map(tagEl)),
      el("h3", { class: "card-title", text: w.title }),
      w.subtitle ? el("p", { class: "card-subtitle", text: w.subtitle }) : null,
      w.summary ? el("p", { class: "card-summary", text: w.summary }) : null,
      el("div", { class: "card-meta" }, [
        el("span", { text: w.date || "" }),
        w.category ? el("span", { text: "· " + w.category }) : null
      ]),
      el("div", { class: "card-link", html: '查看详情 <svg class="icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>' })
    ]);
    link.append(cover, body);
    return link;
  }

  // === Articles ===
  function renderArticlesList(container, articles) {
    container.innerHTML = "";
    if (!articles || !articles.length) {
      container.appendChild(el("div", { class: "empty", html: "<h3>暂无文章</h3>" }));
      return;
    }
    const wrap = el("div", { class: "stagger", style: { display: "flex", flexDirection: "column", gap: "var(--s-4)" } });
    articles.forEach(a => wrap.appendChild(renderArticleCard(a)));
    container.appendChild(wrap);
  }

  function renderArticleCard(a) {
    const link = el("a", { class: "article-card", href: a.url || `articles/${a.id}.html` });
    const cover = el("div", { class: "article-cover", html: `<img src="${a.cover}" alt="${a.title}" loading="lazy" onerror="this.outerHTML='<div style=&quot;width:100%;height:100%;display:flex;align-items:center;justify-content:center;background:linear-gradient(135deg,#1ABCFE,#A259FF);color:white;font-weight:600;&quot;>${a.title}</div>'" />` });
    const body = el("div", { class: "article-body" }, [
      el("div", { class: "card-tags" }, (a.tags || []).map(tagEl)),
      el("h3", { class: "article-title", text: a.title }),
      a.excerpt ? el("p", { class: "article-excerpt", text: a.excerpt }) : null,
      el("div", { class: "article-meta" }, [
        el("span", { text: a.date || "" }),
        el("span", { class: "dot" }),
        el("span", { text: a.read_time || "5 分钟阅读" }),
        el("span", { class: "dot" }),
        el("span", { text: a.author || "" })
      ])
    ]);
    link.append(cover, body);
    return link;
  }

  // === Albums (grouped by tag) ===
  function renderAlbumsGrouped(container, albums) {
    container.innerHTML = "";
    if (!albums || !albums.length) {
      container.appendChild(el("div", { class: "empty", html: "<h3>暂无相册</h3>" }));
      return;
    }
    const groups = {};
    albums.forEach(a => {
      const tag = a.tag || "未分类";
      if (!groups[tag]) groups[tag] = [];
      groups[tag].push(a);
    });

    Object.entries(groups).forEach(([tag, list]) => {
      const section = el("div", { class: "album-section" });
      section.appendChild(el("div", { class: "album-section-header" }, [
        el("h3", { html: `<span class="accent"></span>${tag}` }),
        el("span", { class: "count", text: `${list.length} 个相册` })
      ]));
      const grid = el("div", { class: "grid grid-3" });
      list.forEach(a => grid.appendChild(renderAlbumCard(a)));
      section.appendChild(grid);
      container.appendChild(section);
    });
  }

  function renderAlbumCard(a) {
    const link = el("a", { class: "album-card", href: a.url || `albums/${a.id}.html` });
    const coverSrc = a.cover || (a.photos && a.photos[0] && a.photos[0].src);
    link.innerHTML = `
      <img class="album-cover" src="${coverSrc}" alt="${a.title}" loading="lazy" onerror="this.outerHTML='<div style=&quot;width:100%;height:100%;background:linear-gradient(135deg,#FF7262,#A259FF);&quot;></div>'" />
      <span class="album-tag">${a.tag || ""}</span>
      <span class="album-count">${(a.photos || []).length} 张</span>
      <div class="album-overlay">
        <div class="album-title">${a.title}</div>
        <div class="album-date">${a.date || ""}</div>
      </div>
    `;
    return link;
  }

  // === Documents ===
  function renderDocumentsList(container, docs) {
    container.innerHTML = "";
    if (!docs || !docs.length) {
      container.appendChild(el("div", { class: "empty", html: "<h3>暂无文档</h3>" }));
      return;
    }
    const wrap = el("div", { style: { display: "flex", flexDirection: "column", gap: "var(--s-3)" } });
    docs.forEach(d => wrap.appendChild(renderDocItem(d)));
    container.appendChild(wrap);
  }

  function renderDocItem(d) {
    const ext = (d.type || (d.url || "").split(".").pop() || "file").toLowerCase();
    const item = el("div", { class: "doc-item" });
    item.innerHTML = `
      <div class="doc-icon ${ext}">${ext.toUpperCase().slice(0, 4)}</div>
      <div class="doc-info">
        <h4>${d.title}</h4>
        <div class="doc-meta">
          <span>${(d.type || ext).toUpperCase()}</span>
          <span>·</span>
          <span>${d.size || ""}</span>
          <span>·</span>
          <span>${d.date || ""}</span>
        </div>
        ${d.description ? `<p class="doc-desc">${d.description}</p>` : ""}
      </div>
      <div class="doc-actions">
        ${d.preview_url || d.url ? `<a class="btn btn-secondary btn-sm" href="${d.preview_url || d.url}" target="_blank" rel="noopener">预览</a>` : ""}
        ${d.url ? `<a class="btn btn-primary btn-sm" href="${d.url}" download target="_blank" rel="noopener">下载</a>` : ""}
      </div>
    `;
    return item;
  }

  // === Videos ===
  function renderVideoCarousel(container, videos) {
    container.innerHTML = "";
    if (!videos || !videos.length) return;
    const swiperWrap = el("div", { class: "swiper video-swiper" });
    const wrapper = el("div", { class: "swiper-wrapper" });
    videos.forEach(v => {
      const slide = el("div", { class: "swiper-slide" });
      const card = el("div", { class: "video-card" });
      const platform = v.platform || (v.embed_url && v.embed_url.includes("bilibili") ? "bilibili" : "youtube");
      card.innerHTML = `
        <div class="video-thumb" data-embed='${v.embed_url || ""}' data-youtube='${v.youtube_url || ""}' data-platform='${platform}'>
          <span class="video-platform ${platform}">${platform === "bilibili" ? "B站" : "YouTube"}</span>
          <span class="video-duration">${v.duration || ""}</span>
          <img src="${v.cover}" alt="${v.title}" loading="lazy" onerror="this.outerHTML='<div style=&quot;width:100%;height:100%;background:linear-gradient(135deg,#1ABCFE,#A259FF);&quot;></div>'" />
          <div class="video-play">
            <svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
          </div>
        </div>
        <div class="video-info">
          <h4>${v.title}</h4>
          <p>${v.description || ""}</p>
        </div>
      `;
      slide.appendChild(card);
      wrapper.appendChild(slide);
    });
    swiperWrap.appendChild(wrapper);
    container.appendChild(swiperWrap);
    container.insertAdjacentHTML("beforeend", `
      <div class="swiper-pagination" style="position:relative;margin-top:24px;text-align:center;"></div>
      <div class="swiper-button-prev" style="left:0;color:white;"></div>
      <div class="swiper-button-next" style="right:0;color:white;"></div>
    `);
  }

  function renderVideoGrid(container, videos) {
    container.innerHTML = "";
    if (!videos || !videos.length) return;
    const grid = el("div", { class: "video-grid" });
    videos.forEach(v => {
      const platform = v.platform || (v.embed_url && v.embed_url.includes("bilibili") ? "bilibili" : "youtube");
      const item = el("div", { class: "video-card", style: { background: "var(--c-graphite)" } });
      item.innerHTML = `
        <div class="video-thumb" data-embed='${v.embed_url || ""}' data-youtube='${v.youtube_url || ""}' data-platform='${platform}'>
          <span class="video-platform ${platform}">${platform === "bilibili" ? "B站" : "YouTube"}</span>
          <span class="video-duration">${v.duration || ""}</span>
          <img src="${v.cover}" alt="${v.title}" loading="lazy" onerror="this.outerHTML='<div style=&quot;width:100%;height:100%;background:linear-gradient(135deg,#1ABCFE,#A259FF);&quot;></div>'" />
          <div class="video-play">
            <svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
          </div>
        </div>
        <div class="video-info">
          <h4>${v.title}</h4>
          <p>${v.description || ""}</p>
        </div>
      `;
      grid.appendChild(item);
    });
    container.appendChild(grid);
  }

  // === Presentations ===
  function renderPresentationsGrid(container, ppts) {
    container.innerHTML = "";
    if (!ppts || !ppts.length) {
      container.appendChild(el("div", { class: "empty", html: "<h3>暂无 PPT</h3>" }));
      return;
    }
    const grid = el("div", { class: "grid grid-3" });
    ppts.forEach(p => {
      const link = el("a", { class: "ppt-card", href: p.url || `presentations/${p.id}.html` });
      link.innerHTML = `
        <img class="ppt-cover" src="${p.cover}" alt="${p.title}" loading="lazy" onerror="this.outerHTML='<div style=&quot;width:100%;height:100%;background:linear-gradient(135deg,#1ABCFE,#A259FF);&quot;></div>'" />
        <span class="ppt-slides">${p.slides || 0} 页</span>
        <div class="ppt-overlay">
          <h3>${p.title}</h3>
          <div class="ppt-meta">
            <span>${p.date || ""}</span>
            <span>·</span>
            <span>${p.tag || ""}</span>
          </div>
        </div>
      `;
      grid.appendChild(link);
    });
    container.appendChild(grid);
  }

  // === Site / Nav ===
  async function loadSite() {
    return await loadJson("site.json");
  }

  function renderSiteMeta(site) {
    if (!site) return;
    document.title = site.name ? `${site.name} · 作品集` : document.title;

    // Brand
    document.querySelectorAll("[data-site-brand]").forEach(el => {
      el.textContent = site.name || "@yourname";
    });

    // Tagline
    document.querySelectorAll("[data-site-tagline]").forEach(el => {
      el.textContent = site.tagline || "";
    });

    // Hero
    document.querySelectorAll("[data-site-name]").forEach(el => {
      el.textContent = site.name || "";
    });
    document.querySelectorAll("[data-site-name-first]").forEach(el => {
      el.textContent = (site.name || "").split(/[\s·•]/)[0] || site.name || "";
    });
    document.querySelectorAll("[data-site-school]").forEach(el => {
      el.textContent = site.school || "";
    });
    document.querySelectorAll("[data-site-grade]").forEach(el => {
      el.textContent = site.grade || "";
    });
    document.querySelectorAll("[data-site-email]").forEach(el => {
      el.textContent = site.email || "";
      if (el.tagName === "A") el.href = "mailto:" + (site.email || "");
    });
    document.querySelectorAll("[data-site-github]").forEach(el => {
      el.textContent = site.github || "";
      if (el.tagName === "A") el.href = site.github || "#";
    });
    document.querySelectorAll("[data-site-linkedin]").forEach(el => {
      if (el.tagName === "A") el.href = site.linkedin || "#";
      el.style.display = site.linkedin ? "" : "none";
    });
    document.querySelectorAll("[data-site-twitter]").forEach(el => {
      if (el.tagName === "A") el.href = site.twitter || "#";
      el.style.display = site.twitter ? "" : "none";
    });
    document.querySelectorAll("[data-site-zhihu]").forEach(el => {
      if (el.tagName === "A") el.href = site.zhihu || "#";
      el.style.display = site.zhihu ? "" : "none";
    });
    document.querySelectorAll("[data-site-wechat]").forEach(el => {
      el.textContent = site.wechat_id || "";
    });
    document.querySelectorAll("[data-site-wechat-qr]").forEach(el => {
      if (el.tagName === "IMG") el.src = site.wechat_qr || "assets/images/wechat-qr.svg";
      else if (el.tagName === "DIV") {
        // render inline placeholder
        if (site.wechat_qr) {
          el.innerHTML = `<img src="${site.wechat_qr}" alt="WeChat QR" style="width:100%;height:100%;object-fit:contain;" onerror="this.outerHTML='<div style=\\'width:100%;height:100%;background:white;display:flex;align-items:center;justify-content:center;color:#6B6B6B;font-size:12px;\\'>微信二维码</div>'" />`;
        }
      }
    });
    document.querySelectorAll("[data-site-avatar]").forEach(el => {
      if (el.tagName === "IMG") el.src = site.avatar || "assets/images/avatar.svg";
    });
  }

  function setActiveNav() {
    const path = window.location.pathname.split("/").pop() || "index.html";
    document.querySelectorAll(".nav-links a").forEach(a => {
      const href = a.getAttribute("href");
      if (!href) return;
      if (href === path || (path === "" && href === "index.html")) {
        a.classList.add("active");
      } else if (path.startsWith("works") && href === "works.html") {
        a.classList.add("active");
      } else if (path.startsWith("articles") && href === "articles.html") {
        a.classList.add("active");
      } else if (path.startsWith("albums") && href === "albums.html") {
        a.classList.add("active");
      }
    });
  }

  return {
    loadJson,
    loadSite,
    renderSiteMeta,
    renderWorksGrid,
    renderArticlesList,
    renderAlbumsGrouped,
    renderDocumentsList,
    renderVideoCarousel,
    renderVideoGrid,
    renderPresentationsGrid,
    setActiveNav,
    tagEl,
    el,
    tagClass
  };
})();

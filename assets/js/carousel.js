/* ==========================================================================
   Carousel — Album Swiper + Thumbs + Lightbox + Video Modal
   ========================================================================== */

const Carousel = (() => {
  function initAlbumSwiper(photos) {
    if (typeof Swiper === "undefined") {
      console.warn("Swiper not loaded");
      return;
    }

    const mainEl = document.querySelector(".album-swiper");
    const thumbsEl = document.querySelector(".album-thumbs");
    if (!mainEl || !photos || !photos.length) return;

    // Build thumbs HTML
    if (thumbsEl) {
      thumbsEl.innerHTML = photos.map((p, i) => `
        <div class="thumb ${i === 0 ? "active" : ""}" data-index="${i}">
          <span class="index">${i + 1}</span>
          <img src="${p.src}" alt="${p.caption || ""}" loading="lazy" onerror="this.outerHTML='<div style=&quot;width:100%;height:100%;background:linear-gradient(135deg,#FF7262,#A259FF);&quot;></div>'" />
        </div>
      `).join("");

      thumbsEl.querySelectorAll(".thumb").forEach(t => {
        t.addEventListener("click", () => {
          const i = parseInt(t.dataset.index, 10);
          if (mainSwiper) mainSwiper.slideTo(i);
        });
      });
    }

    // Init main swiper
    const mainSwiper = new Swiper(".album-swiper", {
      loop: true,
      autoplay: {
        delay: 4000,
        disableOnInteraction: false,
        pauseOnMouseEnter: true
      },
      keyboard: {
        enabled: true,
        onlyInViewport: true
      },
      pagination: {
        el: ".album-swiper .swiper-pagination",
        clickable: true
      },
      navigation: {
        nextEl: ".album-swiper .swiper-button-next",
        prevEl: ".album-swiper .swiper-button-prev"
      },
      on: {
        slideChange: (s) => {
          if (thumbsEl) {
            const realIndex = s.realIndex;
            thumbsEl.querySelectorAll(".thumb").forEach((t, i) => {
              t.classList.toggle("active", i === realIndex);
            });
          }
        }
      }
    });

    // Click slide to open lightbox
    mainEl.querySelectorAll(".swiper-slide").forEach((slide, i) => {
      slide.addEventListener("click", () => {
        openLightbox(photos, mainSwiper.realIndex);
      });
    });

    // Add a hint
    const hint = document.createElement("div");
    hint.style.cssText = "position:absolute;top:16px;left:16px;background:rgba(0,0,0,0.5);color:white;padding:6px 12px;border-radius:999px;font-size:12px;z-index:10;backdrop-filter:blur(4px);";
    hint.textContent = "点击放大 · 键盘 ← →";
    mainEl.appendChild(hint);
  }

  // === Lightbox ===
  let lbState = { photos: [], index: 0, open: false };

  function openLightbox(photos, startIndex = 0) {
    if (!photos || !photos.length) return;
    lbState = { photos, index: startIndex, open: true };
    renderLightbox();
    const lb = document.querySelector(".lightbox");
    if (lb) lb.classList.add("open");
    document.body.style.overflow = "hidden";
  }

  function closeLightbox() {
    lbState.open = false;
    const lb = document.querySelector(".lightbox");
    if (lb) lb.classList.remove("open");
    document.body.style.overflow = "";
  }

  function renderLightbox() {
    let lb = document.querySelector(".lightbox");
    if (!lb) {
      lb = document.createElement("div");
      lb.className = "lightbox";
      lb.innerHTML = `
        <button class="lightbox-close" aria-label="关闭">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
        </button>
        <button class="lightbox-nav prev" aria-label="上一张">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 18l-6-6 6-6"/></svg>
        </button>
        <button class="lightbox-nav next" aria-label="下一张">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 18l6-6-6-6"/></svg>
        </button>
        <span class="lightbox-counter"></span>
        <span class="lightbox-caption"></span>
        <div class="lightbox-content"></div>
      `;
      document.body.appendChild(lb);

      lb.querySelector(".lightbox-close").addEventListener("click", closeLightbox);
      lb.querySelector(".lightbox-nav.prev").addEventListener("click", () => navigateLightbox(-1));
      lb.querySelector(".lightbox-nav.next").addEventListener("click", () => navigateLightbox(1));
      lb.addEventListener("click", (e) => {
        if (e.target === lb) closeLightbox();
      });
    }

    const p = lbState.photos[lbState.index];
    const content = lb.querySelector(".lightbox-content");
    content.innerHTML = `<img src="${p.src}" alt="${p.caption || ""}" />`;
    lb.querySelector(".lightbox-counter").textContent = `${lbState.index + 1} / ${lbState.photos.length}`;
    lb.querySelector(".lightbox-caption").textContent = p.caption || "";
  }

  function navigateLightbox(delta) {
    lbState.index = (lbState.index + delta + lbState.photos.length) % lbState.photos.length;
    renderLightbox();
  }

  // Keyboard nav for lightbox
  document.addEventListener("keydown", (e) => {
    if (!lbState.open) return;
    if (e.key === "Escape") closeLightbox();
    else if (e.key === "ArrowLeft") navigateLightbox(-1);
    else if (e.key === "ArrowRight") navigateLightbox(1);
  });

  // === Video Modal ===
  function initVideoModal() {
    document.addEventListener("click", (e) => {
      const thumb = e.target.closest(".video-thumb");
      if (!thumb) return;
      const embed = thumb.dataset.embed || "";
      const youtube = thumb.dataset.youtube || "";
      const platform = thumb.dataset.platform || "bilibili";
      openVideoModal(embed, youtube, platform, thumb.closest(".video-card")?.querySelector("h4")?.textContent || "视频");
    });
  }

  function openVideoModal(embedUrl, youtubeUrl, platform, title) {
    let modal = document.querySelector(".video-modal");
    if (!modal) {
      modal = document.createElement("div");
      modal.className = "video-modal";
      modal.innerHTML = `
        <div class="video-modal-inner">
          <div class="video-modal-header">
            <h3></h3>
            <button class="video-modal-close" aria-label="关闭">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
            </button>
          </div>
          <div class="video-modal-embed"></div>
        </div>
      `;
      document.body.appendChild(modal);
      modal.querySelector(".video-modal-close").addEventListener("click", closeVideoModal);
      modal.addEventListener("click", (e) => {
        if (e.target === modal) closeVideoModal();
      });
      document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && modal.classList.contains("open")) closeVideoModal();
      });
    }

    let url = platform === "youtube" ? youtubeUrl : embedUrl;
    if (!url) {
      console.warn("No embed URL for video");
      return;
    }

    modal.querySelector(".video-modal-header h3").textContent = title;
    modal.querySelector(".video-modal-embed").innerHTML = `<iframe src="${url}" allowfullscreen="true" allow="autoplay; encrypted-media" frameborder="0"></iframe>`;
    modal.classList.add("open");
    document.body.style.overflow = "hidden";
  }

  function closeVideoModal() {
    const modal = document.querySelector(".video-modal");
    if (modal) {
      modal.classList.remove("open");
      modal.querySelector(".video-modal-embed").innerHTML = "";
    }
    document.body.style.overflow = "";
  }

  // === Init video swiper ===
  function initVideoSwiper() {
    if (typeof Swiper === "undefined") return;
    const el = document.querySelector(".video-swiper");
    if (!el) return;
    return new Swiper(".video-swiper", {
      slidesPerView: "auto",
      spaceBetween: 16,
      centeredSlides: true,
      loop: true,
      grabCursor: true,
      autoplay: {
        delay: 3500,
        disableOnInteraction: false
      },
      keyboard: { enabled: true },
      pagination: {
        el: ".video-swiper + .swiper-pagination",
        clickable: true
      },
      navigation: {
        nextEl: ".video-swiper ~ .swiper-button-next",
        prevEl: ".video-swiper ~ .swiper-button-prev"
      },
      breakpoints: {
        0: { slidesPerView: 1.2, spaceBetween: 12 },
        640: { slidesPerView: 2.2, spaceBetween: 16 },
        1024: { slidesPerView: 3.2, spaceBetween: 16 }
      }
    });
  }

  return {
    initAlbumSwiper,
    initVideoSwiper,
    initVideoModal,
    openLightbox,
    closeLightbox,
    openVideoModal,
    closeVideoModal
  };
})();

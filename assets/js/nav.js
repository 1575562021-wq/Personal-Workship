/* ==========================================================================
   Nav — Mobile menu toggle
   ========================================================================== */

const Nav = (() => {
  function init() {
    const toggle = document.querySelector(".nav-toggle");
    const links = document.querySelector(".nav-links");
    if (!toggle || !links) return;

    toggle.addEventListener("click", () => {
      const open = links.classList.toggle("open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });

    // Close on link click (mobile)
    links.querySelectorAll("a").forEach(a => {
      a.addEventListener("click", () => {
        if (links.classList.contains("open")) {
          links.classList.remove("open");
          toggle.setAttribute("aria-expanded", "false");
        }
      });
    });

    // Close on resize past breakpoint
    let lastWidth = window.innerWidth;
    window.addEventListener("resize", () => {
      if (Math.abs(window.innerWidth - lastWidth) > 100) {
        links.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
        lastWidth = window.innerWidth;
      }
    });
  }

  return { init };
})();

/* ==========================================================================
   Filter — tag-based filter for works & articles
   ========================================================================== */

const Filter = (() => {
  function init(filterSelector, itemSelector, dataAttr, countContainer) {
    const filterBar = document.querySelector(filterSelector);
    const items = document.querySelectorAll(itemSelector);
    if (!filterBar || !items.length) return;

    // Build counts
    const counts = { all: items.length };
    items.forEach(item => {
      const tags = (item.dataset[dataAttr] || "").split(",").map(t => t.trim()).filter(Boolean);
      tags.forEach(t => { counts[t] = (counts[t] || 0) + 1; });
    });

    // Update button counts
    filterBar.querySelectorAll(".filter-btn").forEach(btn => {
      const tag = btn.dataset.tag;
      if (counts[tag] != null) {
        const c = btn.querySelector(".filter-count");
        if (c) c.textContent = counts[tag];
      }
    });

    // Click handler
    filterBar.addEventListener("click", (e) => {
      const btn = e.target.closest(".filter-btn");
      if (!btn) return;
      const tag = btn.dataset.tag;
      filterBar.querySelectorAll(".filter-btn").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");

      items.forEach(item => {
        if (tag === "all") {
          item.style.display = "";
        } else {
          const tags = (item.dataset[dataAttr] || "").split(",").map(t => t.trim());
          item.style.display = tags.includes(tag) ? "" : "none";
        }
      });

      // Update URL hash
      if (tag !== "all") {
        history.replaceState(null, "", `#tag=${encodeURIComponent(tag)}`);
      } else {
        history.replaceState(null, "", window.location.pathname);
      }
    });

    // Restore from hash
    const hash = window.location.hash.match(/tag=([^&]+)/);
    if (hash) {
      const tag = decodeURIComponent(hash[1]);
      const btn = filterBar.querySelector(`.filter-btn[data-tag="${tag}"]`);
      if (btn) btn.click();
    }
  }

  return { init };
})();

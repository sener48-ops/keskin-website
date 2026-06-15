/* ============================================================
   KESKİN — Etkileşimler
   Saf JS, bağımlılık yok.
   - Hamburger menü
   - Scroll'da navbar gölgesi
   - Aktif menü vurgusu
   - Scroll-reveal (IntersectionObserver)
   - Yukarı çık butonu
   - Yıl bilgisi
   ============================================================ */

(function () {
  "use strict";

  var header   = document.querySelector(".site-header");
  var nav      = document.getElementById("mainNav");
  var toggle   = document.getElementById("navToggle");
  var toTop     = document.getElementById("toTop");
  var navLinks = nav ? nav.querySelectorAll("a") : [];

  /* ---- Hamburger menü ---- */
  function closeMenu() {
    nav.classList.remove("open");
    toggle.classList.remove("open");
    toggle.setAttribute("aria-expanded", "false");
  }

  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var isOpen = nav.classList.toggle("open");
      toggle.classList.toggle("open", isOpen);
      toggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });

    // Menüden bir linke tıklayınca kapat (mobil)
    navLinks.forEach(function (link) {
      link.addEventListener("click", closeMenu);
    });
  }

  /* ---- Scroll: navbar gölge + yukarı çık butonu ---- */
  function onScroll() {
    var y = window.scrollY || window.pageYOffset;
    if (header) header.classList.toggle("scrolled", y > 20);
    if (toTop)  toTop.classList.toggle("show", y > 500);
    highlightActive();
  }
  window.addEventListener("scroll", onScroll, { passive: true });

  /* ---- Aktif menü vurgusu ---- */
  var sections = Array.prototype.map.call(navLinks, function (link) {
    var id = link.getAttribute("href");
    return (id && id.charAt(0) === "#" && id.length > 1) ? document.querySelector(id) : null;
  });

  function highlightActive() {
    var pos = (window.scrollY || window.pageYOffset) + 120;
    var currentIndex = -1;
    sections.forEach(function (sec, i) {
      if (sec && sec.offsetTop <= pos) currentIndex = i;
    });
    navLinks.forEach(function (link, i) {
      link.classList.toggle("active", i === currentIndex);
    });
  }

  /* ---- Scroll-reveal ---- */
  var reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    // Eski tarayıcı fallback: hepsini göster
    reveals.forEach(function (el) { el.classList.add("visible"); });
  }

  /* ---- Footer yıl ---- */
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // İlk durum
  onScroll();
})();

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

  /* ---- WhatsApp randevu formu ---- */
  var WHATSAPP_NUMBER = "905333464799"; // DEĞİŞTİR: WhatsApp numarası (ülke kodu + numara, başında + yok)
  var bookingForm = document.getElementById("bookingForm");
  if (bookingForm) {
    bookingForm.addEventListener("submit", function (e) {
      e.preventDefault();
      var f = bookingForm;
      var ad = (f.ad.value || "").trim();
      var tel = (f.telefon.value || "").trim();
      if (!ad || !tel) {
        // Tarayıcı doğrulamasını tetikle
        if (typeof f.reportValidity === "function") f.reportValidity();
        return;
      }
      var lines = [
        "Merhaba, ücretsiz danışma randevusu talep ediyorum.",
        "",
        "Ad Soyad: " + ad,
        "Telefon: " + tel,
        "Konu: " + f.konu.value
      ];
      if (f.tarih.value) lines.push("Tercih edilen tarih: " + f.tarih.value);
      if (f.saat.value)  lines.push("Tercih edilen saat: " + f.saat.value);
      var mesaj = (f.mesaj.value || "").trim();
      if (mesaj) lines.push("Mesaj: " + mesaj);

      var url = "https://wa.me/" + WHATSAPP_NUMBER + "?text=" + encodeURIComponent(lines.join("\n"));
      window.open(url, "_blank", "noopener");
    });
  }

  /* ---- Galeri lightbox ---- */
  var galleryGrid = document.getElementById("galleryGrid");
  var lightbox = document.getElementById("lightbox");
  if (galleryGrid && lightbox) {
    var lbImg = document.getElementById("lbImg");
    var items = Array.prototype.slice.call(galleryGrid.querySelectorAll(".gallery-item img"));
    var current = 0;

    function show(i) {
      current = (i + items.length) % items.length;
      lbImg.src = items[current].src;
      lbImg.alt = items[current].alt || "";
    }
    function openLb(i) {
      show(i);
      lightbox.classList.add("open");
      lightbox.setAttribute("aria-hidden", "false");
      document.body.style.overflow = "hidden";
    }
    function closeLb() {
      lightbox.classList.remove("open");
      lightbox.setAttribute("aria-hidden", "true");
      document.body.style.overflow = "";
    }

    galleryGrid.addEventListener("click", function (e) {
      var btn = e.target.closest ? e.target.closest(".gallery-item") : null;
      if (!btn) return;
      var imgs = galleryGrid.querySelectorAll(".gallery-item");
      openLb(Array.prototype.indexOf.call(imgs, btn));
    });

    document.getElementById("lbClose").addEventListener("click", closeLb);
    document.getElementById("lbPrev").addEventListener("click", function () { show(current - 1); });
    document.getElementById("lbNext").addEventListener("click", function () { show(current + 1); });
    lightbox.addEventListener("click", function (e) { if (e.target === lightbox) closeLb(); });
    document.addEventListener("keydown", function (e) {
      if (!lightbox.classList.contains("open")) return;
      if (e.key === "Escape") closeLb();
      else if (e.key === "ArrowLeft") show(current - 1);
      else if (e.key === "ArrowRight") show(current + 1);
    });
  }

  /* ---- Footer yıl ---- */
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // İlk durum
  onScroll();
})();

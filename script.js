/* =========================================================
   EDIT THESE FIRST
   ========================================================= */
const WHATSAPP_NUMBER = "254700000000";   // Your number with country code, no + or spaces (Kenya starts with 254)
const SPOTS_LEFT = 5;                     // Update this as customers sign up. Set to 0 to close the launch offer.
const SPOTS_TOTAL = 5;
const TYPED_WORDS = ["salons", "barbers", "restaurants", "shops", "clinics", "photographers"];
const WHATSAPP_MESSAGE = "Hi, I'd like a website for my business.";
/* ========================================================= */

(function () {
  "use strict";

  var root = document.documentElement;
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---- 1. WhatsApp buttons ---- */
  var waUrl = "https://wa.me/" + WHATSAPP_NUMBER + "?text=" + encodeURIComponent(WHATSAPP_MESSAGE);
  document.querySelectorAll("[data-wa]").forEach(function (a) {
    a.setAttribute("href", waUrl);
    a.setAttribute("target", "_blank");
    a.setAttribute("rel", "noopener");
  });

  /* ---- 2. Footer year ---- */
  var year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();

  /* ---- 3. Typing effect in the hero ---- */
  var typed = document.getElementById("typed");
  if (typed && TYPED_WORDS.length && !reduceMotion) {
    var w = 0, c = 0, deleting = false;
    (function tick() {
      var word = TYPED_WORDS[w];
      typed.textContent = word.slice(0, c);
      var delay = deleting ? 45 : 95;
      if (!deleting && c === word.length) { deleting = true; delay = 1400; }
      else if (deleting && c === 0) { deleting = false; w = (w + 1) % TYPED_WORDS.length; delay = 350; }
      else { c += deleting ? -1 : 1; }
      setTimeout(tick, delay);
    })();
  }

  /* ---- 4. Launch-offer spots counter ---- */
  var left = document.getElementById("spots-left");
  var total = document.getElementById("spots-total");
  if (total) total.textContent = SPOTS_TOTAL;
  if (SPOTS_LEFT <= 0) {
    var badge = document.getElementById("offer-badge");
    if (badge) badge.textContent = "Launch offer closed. Message me for current pricing.";
    document.querySelectorAll("[data-launch]").forEach(function (el) {
      if (el.id !== "offer-badge") el.hidden = true;
    });
  } else if (left) {
    if (reduceMotion) { left.textContent = SPOTS_LEFT; }
    else {
      var n = 0;
      var counter = setInterval(function () {
        n += 1;
        left.textContent = n;
        if (n >= SPOTS_LEFT) clearInterval(counter);
      }, 160);
    }
  }

  /* ---- 5. Theme switch: purple or maroon ---- */
  var themeBtn = document.getElementById("theme-toggle");
  var themeLabel = document.getElementById("theme-label");
  function paintThemeButton() {
    var current = root.getAttribute("data-theme") === "maroon" ? "maroon" : "purple";
    var next = current === "purple" ? "maroon" : "purple";
    if (themeLabel) themeLabel.textContent = current.charAt(0).toUpperCase() + current.slice(1);
    if (themeBtn) themeBtn.setAttribute("aria-label", "Switch theme to " + next);
  }
  if (themeBtn) {
    themeBtn.addEventListener("click", function () {
      var next = root.getAttribute("data-theme") === "maroon" ? "purple" : "maroon";
      root.setAttribute("data-theme", next);
      try { localStorage.setItem("theme", next); } catch (e) {}
      paintThemeButton();
    });
  }
  paintThemeButton();

  /* ---- 6. Mobile menu ---- */
  var menuBtn = document.getElementById("menu-toggle");
  var nav = document.getElementById("nav");
  function setMenu(open) {
    nav.classList.toggle("open", open);
    menuBtn.setAttribute("aria-expanded", String(open));
    menuBtn.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  }
  if (menuBtn && nav) {
    menuBtn.addEventListener("click", function () { setMenu(!nav.classList.contains("open")); });
    nav.querySelectorAll("a").forEach(function (a) { a.addEventListener("click", function () { setMenu(false); }); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") setMenu(false); });
  }

  /* ---- 7. Scroll reveal ---- */
  var reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) { entry.target.classList.add("in"); io.unobserve(entry.target); }
      });
    }, { threshold: 0.12 });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add("in"); });
  }

  /* ---- 8. Sample filter ---- */
  var chips = document.querySelectorAll(".chip");
  var samples = document.querySelectorAll(".sample");
  chips.forEach(function (chip) {
    chip.addEventListener("click", function () {
      var f = chip.getAttribute("data-filter");
      chips.forEach(function (c) {
        var on = c === chip;
        c.classList.toggle("is-active", on);
        c.setAttribute("aria-pressed", String(on));
      });
      samples.forEach(function (s) {
        s.hidden = !(f === "all" || s.getAttribute("data-cat") === f);
      });
    });
  });

  /* ---- 9. FAQ accordion ---- */
  var questions = document.querySelectorAll(".faq-q");
  questions.forEach(function (q) {
    q.addEventListener("click", function () {
      var open = q.getAttribute("aria-expanded") === "true";
      questions.forEach(function (other) {
        other.setAttribute("aria-expanded", "false");
        other.nextElementSibling.hidden = true;
      });
      if (!open) {
        q.setAttribute("aria-expanded", "true");
        q.nextElementSibling.hidden = false;
      }
    });
  });

  /* ---- 10. Contact form (works with Netlify Forms once deployed) ---- */
  var form = document.getElementById("contact-form");
  var status = document.getElementById("form-status");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      status.textContent = "Sending...";
      fetch("/", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams(new FormData(form)).toString()
      }).then(function (res) {
        if (!res.ok) throw new Error("Request failed");
        form.reset();
        status.textContent = "Thanks! Your message was sent. I'll reply soon.";
      }).catch(function () {
        status.textContent = "Could not send the message. Please use the WhatsApp button instead.";
      });
    });
  }
})();

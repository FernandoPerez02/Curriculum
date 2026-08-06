(() => {
  "use strict";

  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  const navbar = document.getElementById("navbar");
  const navToggle = document.getElementById("nav-toggle");
  const navLinks = document.getElementById("nav-links");

  // ---- Mobile nav toggle ----
  if (navToggle && navbar && navLinks) {
    const closeMenu = () => {
      navbar.classList.remove("is-open");
      navToggle.setAttribute("aria-expanded", "false");
      navToggle.setAttribute("aria-label", "Abrir menú de navegación");
      document.body.style.overflow = "";
    };

    const openMenu = () => {
      navbar.classList.add("is-open");
      navToggle.setAttribute("aria-expanded", "true");
      navToggle.setAttribute("aria-label", "Cerrar menú de navegación");
      document.body.style.overflow = "hidden";
    };

    navToggle.addEventListener("click", () => {
      const isOpen = navbar.classList.contains("is-open");
      isOpen ? closeMenu() : openMenu();
    });

    navLinks.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", closeMenu);
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") closeMenu();
    });
  }

  // ---- Navbar background/shrink on scroll ----
  if (navbar) {
    const updateNavbarState = () => {
      navbar.classList.toggle("is-scrolled", window.scrollY > 12);
    };
    updateNavbarState();
    window.addEventListener("scroll", updateNavbarState, { passive: true });
  }

  // ---- Scroll-spy: highlight the active nav link ----
  const sections = document.querySelectorAll("main section[id]");
  const navAnchors = document.querySelectorAll('.nav-links a[href^="#"]');

  if (sections.length && navAnchors.length && "IntersectionObserver" in window) {
    const setActiveLink = (id) => {
      navAnchors.forEach((anchor) => {
        const isActive = anchor.getAttribute("href") === `#${id}`;
        anchor.classList.toggle("is-active", isActive);
        if (isActive) {
          anchor.setAttribute("aria-current", "true");
        } else {
          anchor.removeAttribute("aria-current");
        }
      });
    };

    const spy = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActiveLink(visible.target.id);
      },
      { rootMargin: "-40% 0px -50% 0px", threshold: [0, 0.25, 0.5, 1] }
    );

    sections.forEach((section) => spy.observe(section));
  }

  // ---- Scroll-reveal animations ----
  const revealEls = document.querySelectorAll(".reveal");

  if (revealEls.length) {
    if (prefersReducedMotion || !("IntersectionObserver" in window)) {
      revealEls.forEach((el) => el.classList.add("is-visible"));
    } else {
      const revealObserver = new IntersectionObserver(
        (entries, observer) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("is-visible");
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.15, rootMargin: "0px 0px -60px 0px" }
      );

      revealEls.forEach((el) => revealObserver.observe(el));
    }
  }

  // ---- Footer year ----
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();
})();

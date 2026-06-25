import { gsap } from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const STORAGE_KEY = "lune-theme";

const THEMES = {
  DARK: "dark",
  LIGHT: "light",
};

const FAVICONS = {
  dark: "/images/favicon-dark.png",
  light: "/images/favicon.png",
};

// ─── HELPERS ─────────────────────────────────────────────

function getSystemTheme() {
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? THEMES.DARK
    : THEMES.LIGHT;
}

function loadTheme() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);

    if (saved === THEMES.DARK || saved === THEMES.LIGHT) {
      return saved;
    }

    return getSystemTheme();
  } catch {
    return THEMES.DARK;
  }
}

function saveTheme(theme) {
  try {
    localStorage.setItem(STORAGE_KEY, theme);
  } catch (e) {
    console.error("Theme save error:", e);
  }
}

function applyTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);

  const favicon = document.getElementById("favicon");

  if (favicon) {
    favicon.href = FAVICONS[theme];
  }
}

function animateTheme(theme) {
  const bg = theme === THEMES.DARK ? "#0a0a0f" : "#f5f2ea";

  gsap.killTweensOf(document.body);

  gsap.to(document.body, {
    backgroundColor: bg,
    duration: 0.4,
    ease: "power2.out",
  });
}

// ─── BURGER MENU ─────────────────────────────────────────
function initBurger() {
  const btn = document.getElementById("burger-btn");
  const nav = document.querySelector(".header-nav");
  if (!btn || !nav) return;

  btn.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("open");
    btn.classList.toggle("active", isOpen);
    btn.setAttribute("aria-expanded", isOpen);
    document.body.classList.toggle("no-scroll", isOpen);
  });

  nav.querySelectorAll(".nav-link").forEach((link) => {
    link.addEventListener("click", () => {
      nav.classList.remove("open");
      btn.classList.remove("active");
      btn.setAttribute("aria-expanded", "false");
      document.body.classList.remove("no-scroll");
    });
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 768) {
      nav.classList.remove("open");
      btn.classList.remove("active");
      btn.setAttribute("aria-expanded", "false");
      document.body.classList.remove("no-scroll");
    }
  });
}

export function initTheme() {
  const toggle = document.getElementById("theme-toggle");
  if (!toggle) return;

  let current = loadTheme();
  applyTheme(current);

  toggle.addEventListener("click", () => {
    current = current === THEMES.DARK ? THEMES.LIGHT : THEMES.DARK;
    applyTheme(current);
    saveTheme(current);
    animateTheme(current);
  });
}

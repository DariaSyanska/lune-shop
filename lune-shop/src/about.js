function safeInit(name, initFn) {
  try {
    if (typeof initFn === "function") initFn();
  } catch (error) {
    console.error(`${name} initialization failed:`, error);
  }
}

function initHeader() {
  const header = document.getElementById("header");
  if (!header) return;
  const update = () => {
    header.classList.toggle("scrolled", window.scrollY > 10);
  };
  update();
  window.addEventListener("scroll", update, { passive: true });
}

function initParallax() {
  const heroBg = document.querySelector(".about-hero-bg");
  if (!heroBg || window.matchMedia("(prefers-reduced-motion: reduce)").matches)
    return;

  let ticking = false;
  window.addEventListener(
    "scroll",
    () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          heroBg.style.transform = `translateY(${window.scrollY * 0.2}px)`;
          ticking = false;
        });
        ticking = true;
      }
    },
    { passive: true },
  );
}

document.addEventListener("DOMContentLoaded", () => {
  safeInit("Header", initHeader);
  safeInit("Parallax", initParallax);
  console.log("About page specific animations loaded 🌕");
});

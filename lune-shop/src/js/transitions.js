import { gsap } from "gsap";

export function initTransitions() {
  const links = document.querySelectorAll(
    'a[href]:not([target="_blank"]):not([href^="#"]):not([href=""]):not([href^="mailto:"]):not([href^="tel:"])',
  );

  links.forEach((link) => {
    link.addEventListener("click", (e) => {
      if (e.ctrlKey || e.metaKey || e.shiftKey || e.altKey) return;

      const destination = link.getAttribute("href");
      const currentPath =
        window.location.pathname.split("/").pop() || "index.html";

      if (
        destination === currentPath ||
        destination === window.location.pathname
      )
        return;

      e.preventDefault();
      runOutroAnimation(destination);
    });
  });
}

function createCurtain(id, startY) {
  let curtain = document.getElementById(id);
  if (!curtain) {
    curtain = document.createElement("div");
    curtain.id = id;

    Object.assign(curtain.style, {
      position: "fixed",
      top: "0",
      left: "0",
      width: "100vw",
      height: "100vh",
      backgroundColor: "var(--bg-body, #101014)",
      zIndex: "99999",
      pointerEvents: "none",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      transform: `translateY(${startY})`,
    });

    const currentTheme =
      document.documentElement.getAttribute("data-theme") || "dark";
    const lightDisplay = currentTheme === "light" ? "block" : "none";
    const darkDisplay = currentTheme === "dark" ? "block" : "none";

    curtain.innerHTML = `
      <img src="/images/lune-light.svg" alt="Lune" style="width: 140px; opacity: 0; position: absolute; display: ${lightDisplay};" id="transition-logo-light">
      <img src="/images/lune-dark.svg" alt="Lune" style="width: 140px; opacity: 0; position: absolute; display: ${darkDisplay};" id="transition-logo-dark">
    `;

    document.body.appendChild(curtain);
  }
  return curtain;
}

function runOutroAnimation(destination) {
  const transitionCurtain = createCurtain("page-transition-curtain", "100%");
  const logos = transitionCurtain.querySelectorAll("img");

  const tl = gsap.timeline({
    onComplete: () => {
      window.location.href = destination;
    },
  });

  tl.to(transitionCurtain, {
    y: "0%",
    duration: 0.6,
    ease: "power3.inOut",
  }).to(logos, {
    opacity: 1,
    duration: 0.3,
    ease: "power1.out",
  });
}

export function runIntroAnimation() {
  const transitionCurtain = createCurtain("page-transition-curtain", "0%");
  const logos = transitionCurtain.querySelectorAll("img");

  gsap.set(logos, { opacity: 1 });

  const tl = gsap.timeline({
    onComplete: () => {
      transitionCurtain.remove();
    },
  });

  tl.to(logos, {
    opacity: 0,
    duration: 0.3,
    delay: 0.6,
    ease: "power1.in",
  }).to(
    transitionCurtain,
    {
      y: "-100%",
      duration: 0.7,
      ease: "power3.inOut",
    },
    "-=0.1",
  );
}

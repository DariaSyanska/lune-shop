import { gsap } from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function initAnimations() {
  if (typeof window === "undefined") return;
  if (initAnimations._initialized) return;
  initAnimations._initialized = true;

  const heroSection = document.querySelector(".hero-section");
  const moon = document.querySelector(".hero-moon");
  const heroText = document.querySelector(".hero-text");
  const scrollHint = document.querySelector(".hero-scroll-indicator");
  const cards = document.querySelectorAll(".product-card");
  const reveals = document.querySelectorAll(".reveal-on-scroll");

  // ─── 1. INTRO SEQUENCE ───────────────────────────────────
  if (moon) {
    const tl = gsap.timeline({ delay: 0.3 });

    tl.from(moon, {
      scale: 0.5,
      opacity: 0,
      duration: 2.2,
      ease: "expo.out",
    });

    if (heroText) {
      tl.from(
        heroText.children,
        {
          opacity: 0,
          y: 18,
          stagger: 0.18,
          duration: 1.2,
          ease: "power3.out",
        },
        "-=1.4",
      );
    }

    if (scrollHint) {
      tl.from(
        scrollHint,
        { opacity: 0, y: 10, duration: 0.8, ease: "power2.out" },
        "-=0.4",
      );
    }
  }

  // ─── 2. STARS ───────────────────────────────────────────
  const starsContainer = document.querySelector(".hero-stars");
  if (starsContainer) {
    for (let i = 0; i < 70; i++) {
      const star = document.createElement("span");
      const size = Math.random() * 1.8 + 0.6;

      Object.assign(star.style, {
        position: "absolute",
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        width: `${size}px`,
        height: `${size}px`,
        borderRadius: "50%",
        background: "rgba(245, 242, 234, 0.75)",
        pointerEvents: "none",
        opacity: "0",
      });

      gsap.to(star, {
        opacity: Math.random() * 0.7 + 0.1,
        duration: Math.random() * 3 + 2,
        delay: Math.random() * 6,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });

      starsContainer.appendChild(star);
    }
  }

  // ─── 3. PARALLAX MOUSE ────────────────────────────────────
  if (heroSection && moon) {
    heroSection.addEventListener("mousemove", (e) => {
      const cx = window.innerWidth / 2;
      const cy = window.innerHeight / 2;
      const dx = (e.clientX - cx) / cx;
      const dy = (e.clientY - cy) / cy;

      gsap.to(moon, {
        x: dx * 22,
        y: dy * 22,
        duration: 1,
        ease: "power2.out",
      });

      if (starsContainer) {
        gsap.to(starsContainer, {
          x: dx * -8,
          y: dy * -8,
          duration: 1.4,
          ease: "power2.out",
        });
      }
    });

    heroSection.addEventListener("mouseleave", () => {
      gsap.to([moon, starsContainer], {
        x: 0,
        y: 0,
        duration: 1.2,
        ease: "power2.out",
      });
    });
  }

  // ─── 4. SCROLL — PORTAL (APPLE-STYLE) ────────────────────
  if (heroSection && moon) {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: heroSection,
        start: "top top",
        end: "bottom top",
        scrub: 1.2,
        pin: true,
        invalidateOnRefresh: true,
      },
    });

    tl.to(
      moon,
      {
        scale: 4,
        opacity: 0,
        ease: "power1.inOut",
      },
      0,
    )
      .to(
        heroText,
        {
          y: -50,
          opacity: 0,
          ease: "power1.inOut",
        },
        0,
      )
      .to(
        starsContainer,
        {
          opacity: 0,
          ease: "power1.inOut",
        },
        0,
      );
  }

  // ─── 5. PRODUCT CARDS ─────────────────────────────────
  if (cards.length) {
    gsap.from(cards, {
      opacity: 0,
      y: 30,
      stagger: 0.07,
      duration: 0.6,
      ease: "power2.out",
      scrollTrigger: {
        trigger: cards[0],
        start: "top 90%",
        toggleActions: "play none none none",
      },
    });
  }

  // ─── 6. SCROLL REVEAL ────────────────────────────────────
  reveals.forEach((el) => {
    gsap.from(el, {
      opacity: 0,
      y: 40,
      duration: 0.8,
      ease: "power2.out",
      scrollTrigger: {
        trigger: el,
        start: "top 85%",
        toggleActions: "play none none none",
      },
    });
  });

  window.addEventListener("resize", () => ScrollTrigger.refresh());
}

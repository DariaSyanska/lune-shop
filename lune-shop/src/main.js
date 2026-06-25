import "./styles/main.scss";

import { initAnimations } from "./js/animations.js";
import { initCart, addToCart, toggleCart } from "./js/cart.js";
import { initCatalog } from "./js/catalog.js";
import { initModals } from "./js/modal.js";
import { initSearch } from "./js/search.js";
import { initTheme } from "./js/theme.js";
import { initTransitions, runIntroAnimation } from "./js/transitions.js";
import { initWishlist } from "./js/wishlist.js";

// ─── GLOBAL BASKET BRIDGE ────────────────
window.addToCart = addToCart;
window.toggleCart = toggleCart;

// ─── SAFE INIT ─────────────────────────────────────────
function safeInit(name, initFn) {
  try {
    if (typeof initFn === "function") {
      initFn();
    }
  } catch (error) {
    console.error(`${name} initialization failed:`, error);
  }
}

// ─── SET YEAR ─────────────────
function setYear() {
  const el = document.getElementById("year");
  if (el) el.textContent = new Date().getFullYear();
}

// ─── KEYBOARD ACCESSIBILITY ────────────────────────────
document.addEventListener("keydown", (e) => {
  const target = e.target.closest?.(".open-product");
  if (!target) return;

  if (e.key === "Enter" || e.key === " ") {
    e.preventDefault();
    target.click();
  }
});

// ─── INIT HEADER FILTERS ───────────────────────
function initHeaderFilters() {
  const searchBtn = document.getElementById("search-open");
  if (!searchBtn) return;

  const hideSearchPages = [
    "about.html",
    "shipping.html",
    "contact.html",
    "terms.html",
    "privacy.html",
  ];

  const currentPath = window.location.pathname;

  if (hideSearchPages.some((page) => currentPath.includes(page))) {
    searchBtn.style.setProperty("display", "none", "important");
  }
}

// ─── INIT MOBILE NAV ─────────────────
function initMobileNav() {
  const burgerBtn = document.getElementById("burger-btn");
  const burgerClose = document.getElementById("burger-close");
  const nav = document.getElementById("mobile-nav");

  if (!burgerBtn || !nav) return;

  burgerBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    nav.classList.add("open");
    nav.querySelectorAll(".nav-list li").forEach((li) => {
      li.style.animation = "none";
      li.offsetHeight;
      li.style.animation = "";
    });
    document.body.style.overflow = "hidden";
  });

  if (burgerClose) {
    burgerClose.addEventListener("click", (e) => {
      e.stopPropagation();
      nav.classList.remove("open");
      document.body.style.overflow = "";
    });
  }

  nav.querySelectorAll(".nav-link").forEach((link) => {
    link.addEventListener("click", () => {
      nav.classList.remove("open");
      document.body.style.overflow = "";
    });
  });
}

// ─── INIT APP ─────────────────────────────────────────
document.addEventListener("DOMContentLoaded", () => {
  setYear();
  initHeaderFilters();
  initMobileNav();

  safeInit("Transitions", initTransitions);

  // ─── HEADER SCROLL EFFECT ─────────────────
  const header = document.querySelector("header");
  window.addEventListener("scroll", () => {
    if (window.scrollY > 50) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }
  });

  if (typeof window.Lenis !== "undefined") {
    window.lenis = new window.Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      smoothWheel: true,
    });

    function raf(time) {
      window.lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
  }

  safeInit("Catalog", initCatalog);
  safeInit("Theme", initTheme);
  safeInit("Cart", initCart);
  safeInit("Wishlist", initWishlist);
  safeInit("Modals", initModals);
  safeInit("Search", initSearch);
  safeInit("FAQ", initFaqAccordion);
});

// ─── PAGE LOADED ─────────────────────────
window.addEventListener("load", () => {
  safeInit("Intro Animation", runIntroAnimation);
  safeInit("Animations", initAnimations);

  const scrollBtn = document.querySelector(".scroll-indicator-btn");
  if (scrollBtn) {
    scrollBtn.addEventListener("click", (e) => {
      e.preventDefault();
      const targetSection = document.getElementById("collection-section");
      if (targetSection) {
        window.lenis
          ? window.lenis.scrollTo(targetSection, { offset: -40 })
          : targetSection.scrollIntoView({ behavior: "smooth" });
      }
    });
  }

  initNewsletter();

  function initNewsletter() {
    const newsletter = document.getElementById("newsletter-popup");
    if (!newsletter) return;

    const content = newsletter.querySelector(".newsletter-content");
    const closeBtn = document.getElementById("newsletter-close");
    const hasSeenNewsletter = sessionStorage.getItem("lune-newsletter-seen");

    if (closeBtn) {
      closeBtn.addEventListener("click", closeNewsletter);
    }

    newsletter.addEventListener("click", (e) => {
      if (e.target === newsletter) closeNewsletter();
    });

    function closeNewsletter() {
      import("gsap").then(({ gsap }) => {
        gsap.to(content, {
          scale: 0.9,
          opacity: 0,
          duration: 0.3,
          onComplete: () => {
            newsletter.classList.remove("active");
            setTimeout(() => (newsletter.style.display = "none"), 100);
          },
        });
      });
    }

    if (!hasSeenNewsletter && content) {
      newsletter.style.display = "flex";

      requestAnimationFrame(() => {
        newsletter.classList.add("active");
        import("gsap").then(({ gsap }) => {
          gsap.fromTo(
            content,
            { scale: 0.9, opacity: 0 },
            { scale: 1, opacity: 1, duration: 0.4, ease: "power2.out" },
          );
        });
      });
      sessionStorage.setItem("lune-newsletter-seen", "true");
    }
  }
});

// ─── FAQ ─────────────────────────
export function initFaqAccordion() {
  const faqItems = document.querySelectorAll(".faq-item");

  faqItems.forEach((item) => {
    const trigger = item.querySelector(".faq-trigger");
    const content = item.querySelector(".faq-content");

    trigger.addEventListener("click", () => {
      const isActive = item.classList.contains("active");

      faqItems.forEach((otherItem) => {
        if (otherItem !== item) {
          otherItem.classList.remove("active");
          otherItem
            .querySelector(".faq-trigger")
            .setAttribute("aria-expanded", "false");
        }
      });

      if (isActive) {
        item.classList.remove("active");
        trigger.setAttribute("aria-expanded", "false");
      } else {
        item.classList.add("active");
        trigger.setAttribute("aria-expanded", "true");
      }
    });
  });
}

// THANK-YOU PAGE
document.addEventListener("DOMContentLoaded", () => {
  if (window.location.pathname.includes("thank-you.html")) {
    generateOrderNumber();
  }
});

function generateOrderNumber() {
  const orderNumber = Math.floor(100000 + Math.random() * 900000);
  const metaEl = document.querySelector(".thank-you-meta");
  if (metaEl) {
    metaEl.innerHTML = `Order number: <strong>#${orderNumber}</strong><br>A confirmation email has been sent successfully.`;
  }
}

// ACCOUNT PAGE
document.addEventListener("DOMContentLoaded", () => {
  initAccountTabs();
});

function initAccountTabs() {
  const signOutBtn = document.querySelector(".account-nav-link.sign-out");
  if (signOutBtn) {
    signOutBtn.addEventListener("click", (e) => {
      localStorage.removeItem("lune-user");
    });
  }
  const navLinks = document.querySelectorAll(
    ".account-nav-link:not(.sign-out)",
  );
  const tabContents = document.querySelectorAll(".account-tab-content");

  if (navLinks.length === 0 || tabContents.length === 0) return;

  navLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();

      navLinks.forEach((nav) => nav.classList.remove("active"));

      tabContents.forEach((tab) => tab.classList.remove("active"));

      link.classList.add("active");

      const targetId = link.getAttribute("href").substring(1);
      const targetContent = document.getElementById(targetId);

      if (targetContent) {
        targetContent.classList.add("active");
      }
    });
  });
}

// ─── AUTHENTICATION FLOW ─────────────────────────
document.addEventListener("DOMContentLoaded", () => {
  if (
    !localStorage.getItem("lune-user") &&
    !localStorage.getItem("lune-demo-setup")
  ) {
    const demoUser = {
      name: "Daria Sianska",
      emailOrPhone: "admin@example.com",
      password: "123456",
    };
    localStorage.setItem("lune-user", JSON.stringify(demoUser));
    localStorage.setItem("lune-demo-setup", "true");
  }

  const loginForm = document.getElementById("login-form");
  const registerForm = document.getElementById("register-form");
  const switchBtns = document.querySelectorAll(".auth-switch-btn");

  switchBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const targetId = btn.getAttribute("data-target");
      document.querySelectorAll(".auth-form-wrapper").forEach((wrapper) => {
        wrapper.classList.remove("active");
      });
      document.getElementById(targetId).classList.add("active");
    });
  });

  if (registerForm) {
    registerForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const name = document.getElementById("reg-name").value;
      const emailOrPhone = document.getElementById("reg-email").value;
      const password = document.getElementById("reg-password").value;

      const user = { name, emailOrPhone, password };

      localStorage.setItem("lune-user", JSON.stringify(user));

      const btn = registerForm.querySelector("button");
      btn.textContent = "Creating account...";

      setTimeout(() => {
        alert("Account created successfully!");
        window.location.href = "account.html";
      }, 1000);
    });
  }

  if (loginForm) {
    loginForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const emailOrPhone = document.getElementById("login-email").value;
      const password = document.getElementById("login-password").value;

      const btn = loginForm.querySelector("button");
      btn.textContent = "Verifying...";

      setTimeout(() => {
        if (emailOrPhone === "admin@example.com" && password === "123456") {
          const demoUser = {
            name: "Daria Sianska",
            emailOrPhone: "admin@example.com",
            password: "123456",
          };
          localStorage.setItem("lune-user", JSON.stringify(demoUser));
          window.location.href = "account.html";
          return;
        }

        const savedUserStr = localStorage.getItem("lune-user");
        if (savedUserStr) {
          const savedUser = JSON.parse(savedUserStr);
          if (
            savedUser.emailOrPhone === emailOrPhone &&
            savedUser.password === password
          ) {
            window.location.href = "account.html";
            return;
          }
        }

        btn.textContent = "Sign In";
        alert("Invalid email/phone or password.");
      }, 800);
    });
  }
});

// ─── ACCOUNT PERSONALIZATION ─────────────────────────
document.addEventListener("DOMContentLoaded", () => {
  if (window.location.pathname.includes("account.html")) {
    const savedUserStr = localStorage.getItem("lune-user");

    if (savedUserStr) {
      const user = JSON.parse(savedUserStr);

      const emailEl = document.getElementById("display-email");
      const phoneEl = document.getElementById("display-phone");
      if (emailEl) emailEl.textContent = `Email: ${user.emailOrPhone || "N/A"}`;
      if (phoneEl)
        phoneEl.textContent = `Phone: ${user.phone || "+33 624 766 107"}`;

      const editBtn = document.getElementById("edit-profile-btn");
      const editForm = document.getElementById("edit-profile-form");

      if (editBtn && editForm) {
        editBtn.addEventListener("click", () => {
          editForm.classList.add("active");
          editBtn.style.display = "none";
          document.getElementById("edit-name").value = user.name || "";
          document.getElementById("edit-email").value = user.emailOrPhone || "";
          document.getElementById("edit-phone").value = user.phone || "";
        });

        editForm.addEventListener("submit", (e) => {
          e.preventDefault();
          user.name = document.getElementById("edit-name").value;
          user.emailOrPhone = document.getElementById("edit-email").value;
          user.phone = document.getElementById("edit-phone").value;

          localStorage.setItem("lune-user", JSON.stringify(user));
          location.reload();
        });
      }

      const accountTitle = document.querySelector(".account-title");
      if (accountTitle && user.name) {
        const firstName = user.name.split(" ")[0];
        accountTitle.textContent = `Welcome back, ${firstName}.`;
      }

      const idName = document.querySelector(".id-name");
      if (idName && user.name) idName.textContent = user.name;

      const infoTexts = document.querySelectorAll(
        ".profile-details .account-placeholder-text",
      );
      infoTexts.forEach((p) => {
        if (p.textContent.includes("Email:") && user.emailOrPhone) {
          p.textContent = `Email: ${user.emailOrPhone}`;
        }
      });

      const idNumber = document.querySelector(".id-number");
      const qrImg = document.querySelector(".id-qr-code img");

      if (idNumber && qrImg && user.name) {
        const shortName = user.name.split(" ")[0].substring(0, 4).toUpperCase();
        const pseudoRandom = Math.abs(
          user.emailOrPhone.split("").reduce((a, b) => {
            a = (a << 5) - a + b.charCodeAt(0);
            return a & a;
          }, 0),
        )
          .toString()
          .substring(0, 4);
        const memberId = `LUN-${shortName}-${pseudoRandom}`;
        idNumber.textContent = `ID: ${memberId}`;

        const qrData = encodeURIComponent(
          `LUNE VIP MEMBER\nName: ${user.name}\nContact: ${user.emailOrPhone}\nMember ID: ${memberId}`,
        );
        const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${qrData}&bgcolor=ffffff&color=000000&margin=0`;

        qrImg.src = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${qrData}&bgcolor=ffffff&color=000000&margin=0`;
        qrImg.style.cursor = "pointer";
        qrImg.title = "Click to enlarge";

        const qrModal = document.getElementById("qr-modal-overlay");
        const enlargedQr = document.getElementById("enlarged-qr-img");
        const qrCloseBtn = document.getElementById("qr-modal-close");
        const tcModal = document.getElementById("tc-modal-overlay");
        const tcOpenBtn = document.getElementById("open-tc-btn");
        const tcCloseBtn = document.getElementById("tc-modal-close");

        qrImg.addEventListener("click", () => {
          if (qrModal && enlargedQr) {
            enlargedQr.src = qrUrl;
            qrModal.classList.add("active");
          }
        });

        if (qrCloseBtn)
          qrCloseBtn.addEventListener("click", () =>
            qrModal.classList.remove("active"),
          );
        if (tcOpenBtn && tcModal)
          tcOpenBtn.addEventListener("click", () =>
            tcModal.classList.add("active"),
          );
        if (tcCloseBtn && tcModal)
          tcCloseBtn.addEventListener("click", () =>
            tcModal.classList.remove("active"),
          );

        window.addEventListener("click", (e) => {
          if (e.target === tcModal) tcModal.classList.remove("active");
          else if (e.target === qrModal) qrModal.classList.remove("active");
        });
      }

      const ordersContainer = document.getElementById("account-orders-list");
      if (ordersContainer) {
        const pastOrders =
          JSON.parse(localStorage.getItem("lune-orders")) || [];
        if (pastOrders.length === 0) {
          ordersContainer.innerHTML = `
            <p class="account-placeholder-text">You haven't placed any orders yet.</p>
            <a href="catalog.html" class="order-action-link" style="margin-top: 16px; display: inline-block;">Go to Shop</a>
          `;
        } else {
          ordersContainer.innerHTML = pastOrders
            .map(
              (order) => `
            <div class="order-card" style="margin-bottom: 24px;">
              <div class="order-header">
                <span class="order-number">Order #${order.id}</span>
                <span class="order-date">${order.date}</span>
              </div>
              <div class="order-body">
                <div class="order-items-preview">
                  ${order.items.map((item) => `<img src="${item.img.startsWith("http") || item.img.startsWith("/") ? item.img : "/" + item.img}" alt="${item.title}">`).join("")}
                </div>
                <span>€ ${order.total.toFixed(2)}</span>
              </div>
            </div>`,
            )
            .join("");
        }
      }

      const addressContainer = document.getElementById(
        "address-list-container",
      );
      const showAddFormBtn = document.getElementById("show-add-address-btn");
      const addAddressForm = document.getElementById("add-address-form");
      const cancelAddrBtn = document.getElementById("cancel-add-address");

      function renderAddresses() {
        const addresses =
          JSON.parse(localStorage.getItem("lune-addresses")) || [];
        addressContainer.innerHTML =
          addresses.length === 0
            ? `<p class="account-placeholder-text">No addresses.</p>`
            : addresses
                .map(
                  (addr, idx) => `
            <div class="address-card">
              <div class="address-info"><p class="addr-name">${addr.name}</p><p class="addr-details">${addr.street}, ${addr.city}</p></div>
              <button class="remove-address-btn" data-index="${idx}">Remove</button>
            </div>`,
                )
                .join("");
      }

      if (addressContainer && showAddFormBtn && addAddressForm) {
        renderAddresses();
        showAddFormBtn.addEventListener("click", () => {
          addAddressForm.classList.add("active");
          showAddFormBtn.classList.add("hidden");
        });
        cancelAddrBtn.addEventListener("click", () => {
          addAddressForm.classList.remove("active");
          showAddFormBtn.classList.remove("hidden");
        });
        addAddressForm.addEventListener("submit", (e) => {
          e.preventDefault();
          const newAddr = {
            name: document.getElementById("addr-name").value,
            street: document.getElementById("addr-street").value,
            city: document.getElementById("addr-city").value,
            zip: document.getElementById("addr-zip").value,
          };
          const addresses =
            JSON.parse(localStorage.getItem("lune-addresses")) || [];
          addresses.push(newAddr);
          localStorage.setItem("lune-addresses", JSON.stringify(addresses));
          addAddressForm.reset();
          addAddressForm.classList.remove("active");
          showAddFormBtn.classList.remove("hidden");
          renderAddresses();
        });
        addressContainer.addEventListener("click", (e) => {
          if (e.target.classList.contains("remove-address-btn")) {
            const index = e.target.dataset.index;
            const addresses =
              JSON.parse(localStorage.getItem("lune-addresses")) || [];
            addresses.splice(index, 1);
            localStorage.setItem("lune-addresses", JSON.stringify(addresses));
            renderAddresses();
          }
        });
      }
    } else {
      window.location.href = "login.html";
    }
  }
});

const mobileSignOut = document.querySelector("#mobile-sign-out");
if (mobileSignOut) {
  mobileSignOut.addEventListener("click", () => {
    localStorage.removeItem("lune-user");
  });
}

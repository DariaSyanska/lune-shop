import { PRODUCTS } from "./data/products-data.js";
import { gsap } from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

let modalOverlay;

// ─── HELPERS ────────────────────────────────────────────────────────────────
function getProductById(id) {
  return PRODUCTS.find((p) => String(p.id) === String(id));
}

function getColorHex(colorName = "") {
  const colors = {
    ivory: "#f5f2ea",
    black: "#1a1a1a",
    violet: "#7060d8",
    pink: "#ffb2d0",
    blue: "#87cefa",
    yellow: "#fffdd0",
    teal: "#008080",
  };

  return colors[colorName.toLowerCase()] || "#ccc";
}

function normalizeImagePath(path = "") {
  if (!path) return "";
  if (path.startsWith("/")) return path;
  if (path.startsWith("http")) return path;
  return `/images/${path}`;
}

function capitalize(str = "") {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// ─── INIT ───────────────────────────────────────────────────────────────────
export function initModals() {
  modalOverlay = document.getElementById("product-modal-overlay");

  if (!modalOverlay) return;

  initOpenButtons();
  initModalClose();
  initEscapeClose();
}

// ─── OPEN MODAL ─────────────────────────────────────────────────────────────
function initOpenButtons() {
  document.querySelectorAll(".open-product").forEach((btn) => {
    if (btn.dataset.modalInit) return;

    btn.addEventListener("click", () => {
      const productId = btn.dataset.id;
      if (!productId) return;

      const product = getProductById(productId);
      if (!product) return;

      openModal(product);
    });

    btn.dataset.modalInit = "true";
  });
}

function openModal(product) {
  modalOverlay.dataset.productId = product.id;

  const compEl = document.getElementById("modal-composition");
  console.log("Product inspection:", product);

  if (compEl) {
    compEl.textContent =
      product.composition || "Composition info not available.";
  }

  const titleEl = document.getElementById("modal-title");
  const priceEl = document.getElementById("modal-price");
  const modalImg = document.getElementById("modal-img");

  if (titleEl) titleEl.textContent = product.name;
  if (priceEl) priceEl.textContent = `€ ${product.price}`;

  const firstVariant = product.variants?.[0];

  if (modalImg && firstVariant) {
    modalImg.src = normalizeImagePath(firstVariant.img);
    modalImg.alt = product.name;
  }

  renderModalColors(product);
  renderModalSizes(product);

  modalOverlay.classList.add("active");
  document.body.classList.add("no-scroll");

  gsap.fromTo(
    modalOverlay,
    { opacity: 0 },
    { opacity: 1, duration: 0.25, ease: "power2.out" },
  );
}

document.addEventListener("click", (e) => {
  if (e.target.closest(".care-trigger")) {
    const trigger = e.target.closest(".care-trigger");
    const content = trigger.nextElementSibling;
    const isHidden = content.style.display === "none";

    content.style.display = isHidden ? "block" : "none";
    trigger.querySelector("span").textContent = isHidden ? "−" : "+";
  }
});

// ─── CLOSE MODAL ────────────────────────────────────────────────────────────
function closeModal() {
  gsap.to(modalOverlay, {
    opacity: 0,
    duration: 0.2,
    ease: "power2.out",
    onComplete: () => {
      modalOverlay.classList.remove("active");
      document.body.classList.remove("no-scroll");
    },
  });
}

function initModalClose() {
  if (modalOverlay.dataset.closeInit) return;

  document
    .getElementById("product-modal-close")
    ?.addEventListener("click", closeModal);

  modalOverlay.addEventListener("click", (e) => {
    if (e.target === modalOverlay) closeModal();
  });

  modalOverlay.dataset.closeInit = "true";
}

function initEscapeClose() {
  if (document.body.dataset.modalEscapeInit) return;

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modalOverlay.classList.contains("active")) {
      closeModal();
    }
  });

  document.body.dataset.modalEscapeInit = "true";
}

// ─── RENDER COLORS ──────────────────────────────────────────────────────────
function renderModalColors(product) {
  const container = document.querySelector(".product-modal .color-options");
  if (!container) return;

  container.innerHTML = product.variants
    .map((v, i) => {
      const color = v.color;

      return `
        <button
          class="color-btn ${i === 0 ? "active" : ""}"
          style="background-color: ${getColorHex(color)}"
          data-color="${color}"
        ></button>
      `;
    })
    .join("");

  const label = document.getElementById("modal-color-name");
  if (label && product.variants?.[0]) {
    label.textContent = capitalize(product.variants[0].color);
  }
}

// ─── RENDER SIZES ───────────────────────────────────────────────────────────

function renderModalSizes(product) {
  const sizeOptionsContainer = document.querySelector(
    ".product-modal .size-options",
  );
  if (!sizeOptionsContainer) return;

  sizeOptionsContainer.innerHTML = "";

  const ALL_SIZES = ["XS", "S", "M", "L", "XL"];

  if (product.sizes.includes("ONE_SIZE")) {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "size-btn active";
    btn.textContent = "One Size";
    sizeOptionsContainer.appendChild(btn);
    return;
  }

  ALL_SIZES.forEach((size) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "size-btn";
    btn.textContent = size;

    if (product.sizes.includes(size)) {
      btn.addEventListener("click", () => {
        sizeOptionsContainer
          .querySelectorAll(".size-btn:not(.out-of-stock)")
          .forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
      });
    } else {
      btn.classList.add("out-of-stock");
      btn.disabled = true;
    }

    sizeOptionsContainer.appendChild(btn);
  });

  const firstAvailable = sizeOptionsContainer.querySelector(
    ".size-btn:not(.out-of-stock)",
  );
  if (firstAvailable) firstAvailable.classList.add("active");
}

// ─── EVENT DELEGATION (COLOR + SIZE) ───────────────────────────────────────
document.addEventListener("click", (e) => {
  if (!modalOverlay?.classList.contains("active")) return;

  // COLOR SWITCH
  const colorBtn = e.target.closest(".color-btn");
  if (colorBtn) {
    const product = getProductById(modalOverlay.dataset.productId);
    if (!product) return;

    const color = colorBtn.dataset.color;

    document
      .querySelectorAll(".color-btn")
      .forEach((b) => b.classList.remove("active"));

    colorBtn.classList.add("active");

    const label = document.getElementById("modal-color-name");
    if (label) label.textContent = capitalize(color);

    const variant = product.variants.find(
      (v) => v.color.toLowerCase() === color.toLowerCase(),
    );

    const img = document.getElementById("modal-img");

    if (variant && img) {
      gsap.to(img, {
        opacity: 0,
        duration: 0.15,
        onComplete: () => {
          img.src = normalizeImagePath(variant.img);
          gsap.to(img, { opacity: 1, duration: 0.15 });
        },
      });
    }
  }

  // SIZE SWITCH
  const sizeBtn = e.target.closest(".size-btn");
  if (sizeBtn) {
    document
      .querySelectorAll(".size-btn")
      .forEach((b) => b.classList.remove("active"));

    sizeBtn.classList.add("active");
  }
});

// ─── SIZE GUIDE ──────────────────────────────
document.addEventListener("click", (e) => {
  if (e.target.closest("#size-guide-open")) {
    const overlay = document.getElementById("size-guide-overlay");
    if (!overlay) return;
    overlay.classList.add("active");
  }

  if (
    e.target.closest("#size-guide-close") ||
    e.target.id === "size-guide-overlay"
  ) {
    const overlay = document.getElementById("size-guide-overlay");
    if (!overlay) return;
    overlay.classList.remove("active");
  }
});

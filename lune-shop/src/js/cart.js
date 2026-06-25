import { PRODUCTS } from "./data/products-data.js";
import { gsap } from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// ─── STORAGE ────────────────────────────────────────────────────────────────
const STORAGE_KEY = "lune-cart";

function loadCart() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  } catch (e) {
    console.error("Failed to load cart:", e);
    return [];
  }
}

function saveCart(cartItems) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(cartItems));
}

// ─── STATE ──────────────────────────────────────────────────────────────────
export let cart = loadCart();

// ─── HELPERS ────────────────────────────────────────────────────────────────
function escapeHTML(str = "") {
  return String(str)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function normalizeImgSrc(src = "") {
  const s = String(src);
  if (!s) return "";
  if (s.startsWith("http") || s.startsWith("/")) return s;
  return `/${s}`;
}

function normalizeVariant(v) {
  return v ?? "Default";
}

// ─── SYNC ───────────────────────────────────────────────────────────────────
function syncCartUI() {
  renderCart();
  updateCheckoutIfNeeded();
}

function updateCheckoutIfNeeded() {
  if (typeof window.renderCheckoutSummary === "function") {
    window.renderCheckoutSummary();
  }
}

// ─── INIT ───────────────────────────────────────────────────────────────────
export function initCart() {
  renderCart();

  const singleProductBtn = document.getElementById("add-to-cart");
  if (singleProductBtn) {
    singleProductBtn.addEventListener("click", () => {
      const productSection = document.querySelector(
        ".product-section, [data-id]",
      );
      const item = {
        id: productSection?.dataset.id || "manual-id",
        title:
          document.querySelector(".product-h1")?.textContent?.trim() ||
          "Silk Dress",
        price:
          parseFloat(
            document
              .querySelector(".product-price-large")
              ?.textContent.replace("€", ""),
          ) || 189,
        img:
          document.getElementById("product-main-img")?.getAttribute("src") ||
          "/images/silk-dress.jpg",
        variant:
          document
            .querySelector(".color-options .active")
            ?.getAttribute("aria-label") || "Default",
        quantity: 1,
      };
      addToCart(item);
      toggleCart(true);
    });
  }

  document.addEventListener("click", (e) => {
    const quickSizeBtn = e.target.closest(".quick-size-trigger");
    const modalAddBtn =
      e.target.closest("#modal-add-btn") ||
      e.target.closest(".modal-add-to-cart");

    if (quickSizeBtn) {
      const chosenSize = quickSizeBtn.dataset.size;
      const baseVariant = quickSizeBtn.dataset.variant || "Default";

      const item = {
        id: quickSizeBtn.dataset.id,
        title: quickSizeBtn.dataset.title,
        price: parseFloat(quickSizeBtn.dataset.price),
        img: quickSizeBtn.dataset.img,
        variant: `${baseVariant} / ${chosenSize}`,
        quantity: 1,
      };
      addToCart(item);
      toggleCart(true);
    }

    if (modalAddBtn) {
      const activeSizeBtn = document.querySelector(".size-btn.active");
      const chosenSize = activeSizeBtn ? activeSizeBtn.textContent.trim() : "S";
      const baseVariant =
        document.getElementById("modal-color-name")?.textContent || "Default";

      const item = {
        id: document.getElementById("product-modal-overlay")?.dataset.productId,
        title: document.getElementById("modal-title")?.textContent?.trim(),
        price: parseFloat(
          document.getElementById("modal-price")?.textContent.replace("€", ""),
        ),
        img: document.getElementById("modal-img")?.getAttribute("src"),
        variant: `${baseVariant} / ${chosenSize}`,
        quantity: 1,
      };
      addToCart(item);
      document.getElementById("product-modal-close")?.click();
      setTimeout(() => toggleCart(true), 300);
    }
  });

  // ─── Wishlist Organizer ─────────
  window.addEventListener("lune:add-to-cart", (e) => {
    const { id, title, price, variant, img } = e.detail;

    addToCart({
      id: String(id),
      title: title,
      price: parseFloat(price) || 0,
      variant: variant,
      img: img,
      quantity: 1,
    });

    toggleCart(true);
  });

  document
    .querySelectorAll('button[aria-label="Cart"], #cart-open')
    .forEach((btn) => btn.addEventListener("click", () => toggleCart(true)));

  document
    .getElementById("cart-close")
    ?.addEventListener("click", () => toggleCart(false));

  document
    .getElementById("cart-overlay")
    ?.addEventListener("click", () => toggleCart(false));

  document
    .querySelectorAll('button[aria-label="Cart"], #cart-open')
    .forEach((btn) => btn.addEventListener("click", () => toggleCart(true)));

  const cartBody = document.querySelector(".cart-body");
  if (cartBody && !cartBody.dataset.init) {
    cartBody.addEventListener("click", (e) => {
      const itemRow = e.target.closest(".cart-item");
      if (!itemRow) return;

      const id = itemRow.dataset.id;
      const variant = itemRow.dataset.variant;

      if (e.target.closest(".plus")) {
        updateQty(id, variant, 1);
        return;
      }

      if (e.target.closest(".minus")) {
        updateQty(id, variant, -1);
        return;
      }

      if (e.target.closest(".cart-item-remove")) {
        removeItem(id, variant);
      }
    });
    cartBody.dataset.init = "true";
  }
}

const checkoutBtn = document.querySelector(".checkout-btn");
if (checkoutBtn) {
  checkoutBtn.addEventListener("click", (e) => {
    e.preventDefault();
    window.location.href = "checkout.html";
  });
}

// ─── ADD TO CART ─────────────────────────────────────────
export function addToCart(item) {
  if (PRODUCTS && PRODUCTS.length > 0) {
    const exists = PRODUCTS.some(
      (p) =>
        String(p.id).toLowerCase().trim() ===
        String(item.id).toLowerCase().trim(),
    );
    if (!exists) {
      console.warn(
        `Product ID "${item.id}" not found in local database, adding as custom item.`,
      );
    }
  }

  const quantity = Math.max(1, Number(item.quantity) || 1);
  const variant = normalizeVariant(item.variant);

  const existing = cart.find(
    (i) =>
      String(i.id) === String(item.id) &&
      normalizeVariant(i.variant) === variant,
  );

  if (existing) {
    existing.quantity += quantity;
  } else {
    cart.push({
      id: String(item.id),
      title: item.title || "Lune Piece",
      price: Number(item.price) || 0,
      img: item.img || "/images/placeholder.jpg",
      variant: variant,
      quantity: quantity,
    });
  }

  saveCart(cart);
  syncCartUI();
}

function updateQty(id, variant, change) {
  const index = cart.findIndex(
    (i) =>
      String(i.id) === String(id) &&
      normalizeVariant(i.variant) === normalizeVariant(variant),
  );
  if (index === -1) return;

  cart[index].quantity += change;
  if (cart[index].quantity <= 0) {
    cart.splice(index, 1);
  }
  saveCart(cart);
  syncCartUI();
}

function removeItem(id, variant) {
  const index = cart.findIndex(
    (i) =>
      String(i.id) === String(id) &&
      normalizeVariant(i.variant) === normalizeVariant(variant),
  );
  if (index === -1) return;

  cart.splice(index, 1);
  saveCart(cart);
  syncCartUI();
}

// ─── RENDER ──────────────────────
export function renderCart() {
  const cartBody = document.querySelector(".cart-body");
  const subtotalEl = document.querySelector(".cart-total span:last-child");
  const cartCountEls = document.querySelectorAll(".cart-count");

  if (!cartBody) return;

  const totalItems = cart.reduce(
    (sum, i) => sum + (Number(i.quantity) || 0),
    0,
  );

  cartCountEls.forEach((el) => {
    if (parseInt(el.textContent) !== totalItems && totalItems > 0) {
      el.classList.add("highlight");

      setTimeout(() => {
        el.classList.remove("highlight");
      }, 300);
    }

    el.textContent = totalItems;
    el.style.display = totalItems > 0 ? "flex" : "none";
  });

  if (cart.length === 0) {
    cartBody.innerHTML = `
    <div class="empty-drawer-state">
      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1">
        <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/>
        <line x1="3" y1="6" x2="21" y2="6"/>
        <path d="M16 10a4 4 0 0 1-8 0"/>
      </svg>
      <p>Your cart is empty</p>
      <span>Add something beautiful</span>
      <a href="catalog.html" class="empty-drawer-cta">Browse Collection</a>
    </div>
  `;
    if (subtotalEl) subtotalEl.textContent = "€ 0.00";
    return;
  }

  let total = 0;

  cartBody.innerHTML = cart
    .map((item) => {
      const qty = Number(item.quantity) || 1;
      const price = Number(item.price) || 0;
      const itemTotal = qty * price;
      total += itemTotal;

      return `
        <div class="cart-item" data-id="${escapeHTML(item.id)}" data-variant="${escapeHTML(item.variant)}">
          <img src="${normalizeImgSrc(item.img)}" alt="${escapeHTML(item.title)}" class="cart-item-img" loading="lazy" />
          <div class="cart-item-info">
            <div class="item-header-row">
              <p class="cart-item-title">${escapeHTML(item.title)}</p>
              <p class="cart-item-price">€ ${itemTotal.toFixed(2)}</p>
            </div>
            <p class="cart-item-variant">${escapeHTML(item.variant)}</p>
            <div class="cart-item-controls">
              <div class="qty-control">
                <button class="qty-btn minus">-</button>
                <span class="qty-num">${qty}</span>
                <button class="qty-btn plus">+</button>
              </div>
              <button class="cart-item-remove">Remove</button>
            </div>
          </div>
        </div>
      `;
    })
    .join("");

  if (subtotalEl) subtotalEl.textContent = `€ ${total.toFixed(2)}`;
}

export function toggleCart(forceOpen = null) {
  const drawer = document.getElementById("cart-drawer");
  const overlay = document.getElementById("cart-overlay");
  if (!drawer || !overlay) return;

  const open =
    forceOpen !== null ? forceOpen : !drawer.classList.contains("active");
  gsap.killTweensOf([drawer, overlay]);

  if (open) {
    drawer.classList.add("active");
    overlay.classList.add("active");
    document.body.classList.add("no-scroll");
    drawer.style.pointerEvents = "auto";
    overlay.style.pointerEvents = "auto";
    gsap.set(drawer, { x: "100%" });
    gsap.set(overlay, { opacity: 0 });
    gsap.to(drawer, { x: 0, duration: 0.4, ease: "power2.out" });
    gsap.to(overlay, { opacity: 1, duration: 0.4 });
  } else {
    document.body.classList.remove("no-scroll");
    drawer.style.pointerEvents = "none";
    overlay.style.pointerEvents = "none";
    gsap.to(drawer, {
      x: "100%",
      duration: 0.3,
      ease: "power2.in",
      onComplete: () => drawer.classList.remove("active"),
    });
    gsap.to(overlay, {
      opacity: 0,
      duration: 0.3,
      onComplete: () => overlay.classList.remove("active"),
    });
  }
}

window.addToCart = addToCart;
window.toggleCart = toggleCart;

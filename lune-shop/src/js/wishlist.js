import { PRODUCTS } from "./data/products-data.js";
import { addToCart } from "./cart.js";
import { gsap } from "gsap";

const WISHLIST_KEY = "lune-wishlist";

function loadWishlist() {
  try {
    const data = localStorage.getItem(WISHLIST_KEY);
    const parsed = data ? JSON.parse(data) : [];

    return Array.isArray(parsed)
      ? parsed.filter((item) => item && typeof item === "object" && item.id)
      : [];
  } catch (error) {
    console.error("Failed to load wishlist:", error);
    return [];
  }
}

let wishlist = loadWishlist();

function saveWishlist() {
  try {
    localStorage.setItem(WISHLIST_KEY, JSON.stringify(wishlist));
  } catch (error) {
    console.error("Failed to save wishlist:", error);
  }
}

// ─── INITIALIZATION AND DELEGATION OF CLICKS ────────────────────────────────────
export function initWishlist() {
  updateWishlistUI();

  if (document.body.dataset.wishlistInit) return;
  document.body.dataset.wishlistInit = "true";

  document.addEventListener("click", (e) => {
    const btn = e.target.closest(".wish-btn");
    if (!btn) return;

    e.preventDefault();
    e.stopPropagation();

    const productId = btn.dataset.id;
    if (!productId) return;

    const card = btn.closest(".product-card");
    let currentImg = "";
    let currentColor = "";

    if (card) {
      const activeColorBtn = card.querySelector(".color-dot-btn.active");
      const quickAddBtn = card.querySelector(".quick-add-btn");

      currentColor = activeColorBtn ? activeColorBtn.dataset.color : "ivory";
      currentImg = quickAddBtn
        ? quickAddBtn.dataset.img
        : "/images/" + productId + ".jpg";
    } else {
      const product = PRODUCTS.find((p) => String(p.id) === String(productId));
      currentColor = product ? product.variants[0].color : "ivory";
      currentImg = product ? product.variants[0].img : "";
    }

    toggleWishlist(productId, currentColor, currentImg);
  });

  document
    .getElementById("wishlist-container")
    ?.addEventListener("click", (e) => {
      const removeBtn = e.target.closest(".account-wishlist-remove");
      const moveToCartBtn = e.target.closest(".wishlist-to-cart-btn");

      if (removeBtn) {
        const productId = removeBtn.dataset.id;
        const color = removeBtn.dataset.color;
        if (productId && color) toggleWishlist(productId, color);
      }

      if (moveToCartBtn) {
        const id = moveToCartBtn.dataset.id;
        const title = moveToCartBtn.dataset.title;
        const price = parseFloat(moveToCartBtn.dataset.price);
        const variant = moveToCartBtn.dataset.variant;
        const img = moveToCartBtn.dataset.img;

        const cartEvent = new CustomEvent("lune:add-to-cart", {
          detail: { id, title, price, variant, img },
        });
        window.dispatchEvent(cartEvent);

        toggleWishlist(id, variant);
      }
    });

  document.getElementById("wishlist-open")?.addEventListener("click", () => {
    toggleWishlistDrawer(true);
  });

  document.getElementById("wishlist-close")?.addEventListener("click", () => {
    toggleWishlistDrawer(false);
  });

  document.getElementById("wishlist-overlay")?.addEventListener("click", () => {
    toggleWishlistDrawer(false);
  });

  document.querySelector(".wishlist-body")?.addEventListener("click", (e) => {
    const removeBtn = e.target.closest(".wishlist-item-remove");
    const moveToCartBtn = e.target.closest(".wishlist-to-cart-btn");

    if (removeBtn) {
      const productId = removeBtn.dataset.id;
      const color = removeBtn.dataset.color;
      if (productId && color) toggleWishlist(productId, color);
    }

    if (moveToCartBtn) {
      const id = moveToCartBtn.dataset.id;
      const title = moveToCartBtn.dataset.title;
      const price = parseFloat(moveToCartBtn.dataset.price);
      const variant = moveToCartBtn.dataset.variant;
      const img = moveToCartBtn.dataset.img;

      const cartEvent = new CustomEvent("lune:add-to-cart", {
        detail: { id, title, price, variant, img },
      });
      window.dispatchEvent(cartEvent);

      toggleWishlist(id, variant);
      toggleWishlistDrawer(false);
    }
  });

  document.querySelectorAll(".wish-btn").forEach((btn) => {
    const productId = btn.dataset.id;
    if (!productId) return;

    const card = btn.closest(".product-card");
    const activeColorBtn = card?.querySelector(".color-dot-btn.active");
    const currentColor = activeColorBtn?.dataset.color || "ivory";

    const isSaved = wishlist.some(
      (item) =>
        String(item.id) === String(productId) &&
        item.color.toLowerCase() === currentColor.toLowerCase(),
    );

    btn.classList.toggle("active", isSaved);
  });
}

// ─── SMART TOGGLE ──────────────────────────────────────
function toggleWishlist(id, color, img = "") {
  const existingIndex = wishlist.findIndex(
    (item) =>
      String(item.id) === String(id) &&
      item.color.toLowerCase() === color.toLowerCase(),
  );

  if (existingIndex > -1) {
    wishlist.splice(existingIndex, 1);
  } else {
    const product = PRODUCTS.find((p) => String(p.id) === String(id));
    const title = product ? product.name : "Fine Knit Item";
    const price = product ? product.price : 0;

    wishlist.push({
      id: String(id),
      title: title,
      price: price,
      color: color.toLowerCase(),
      img: img,
    });
  }

  saveWishlist();
  updateWishlistUI();

  const modalBtn = document.querySelector("#modal-wish-btn");
  if (modalBtn) {
    const isSaved = wishlist.some((item) => String(item.id) === String(id));
    modalBtn.classList.toggle("active", isSaved);
  }

  renderWishlistItems();
}

// ─── ANIMATION CURTAIN (GSAP) ──────────────────────────────────────────────────
export function toggleWishlistDrawer(forceOpen = null) {
  const drawer = document.getElementById("wishlist-drawer");
  const overlay = document.getElementById("wishlist-overlay");
  if (!drawer || !overlay) return;

  const open =
    forceOpen !== null ? forceOpen : !drawer.classList.contains("active");
  gsap.killTweensOf([drawer, overlay]);

  if (open) {
    renderWishlistItems();
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

// ─── RENDER OF PRODUCTS INSIDE THE CURTAIN ─────────
function renderWishlistItems() {
  const body = document.querySelector(".wishlist-body");

  if (!body) return;

  if (wishlist.length === 0) {
    body.innerHTML = `
    <div class="empty-drawer-state">
      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
      </svg>
      <p>Your wishlist is empty</p>
      <span>Save pieces you love</span>
      <a href="catalog.html" class="empty-drawer-cta">Browse Collection</a>
    </div>
  `;
    return;
  }

  body.innerHTML = wishlist
    .map((item) => {
      return `
        <div class="cart-item" data-id="${item.id}" data-color="${item.color}" style="display: flex; gap: 16px; padding: 16px 24px; border-bottom: 1px solid var(--color-border, rgba(255,255,255,0.05));">
          <img src="${item.img || "/images/placeholder.jpg"}" alt="${item.title || "Lune Item"}" class="cart-item-img" style="width: 70px; height: 90px; object-fit: cover; border-radius: 2px;" />
          <div class="cart-item-info" style="flex: 1; display: flex; flex-direction: column;">
            <div class="item-header-row" style="display: flex; justify-content: space-between; align-items: start;">
              <p class="cart-item-title" style="font-size: 14px; font-weight: 500; margin: 0;">${item.title || "Lune Item"}</p>
              <p class="cart-item-price" style="font-size: 14px; font-weight: 500; margin: 0;">€ ${item.price || 0}</p>
            </div>
            <p style="font-size: 12px; color: var(--color-muted); margin: 4px 0 0 0; text-transform: capitalize;">Color: ${item.color || "Default"}</p>
            
            <div class="wishlist-actions-row" style="margin-top: auto; display: flex; justify-content: space-between; align-items: center; width: 100%;">
              <button class="wishlist-to-cart-btn" 
                data-id="${item.id}" 
                data-title="${item.title}" 
                data-price="${item.price}" 
                data-variant="${item.color}" 
                data-img="${item.img}"
                style="background: none; border: none; color: var(--color-text); font-size: 12px; font-weight: 500; cursor: pointer; padding: 0; text-decoration: underline; text-underline-offset: 4px;">
                + Move to Bag
              </button>
              
              <button class="wishlist-item-remove" data-id="${item.id}" data-color="${item.color}" 
                style="background: none; border: none; color: var(--color-muted); font-size: 12px; cursor: pointer; padding: 0; opacity: 0.6; transition: opacity 0.2s;">
                Remove
              </button>
            </div>
          </div>
        </div>
      `;
    })
    .join("");
}

// ─── SYNCHRONIZATION OF HEARTS AND COUNTER ────────────────────────────────────────
export function updateWishlistUI() {
  const total = wishlist.length;

  document.querySelectorAll(".wishlist-count").forEach((el) => {
    el.textContent = String(total);
    el.style.display = total > 0 ? "flex" : "none";
  });

  document.querySelectorAll(".wish-btn").forEach((btn) => {
    const productId = btn.dataset.id;
    if (!productId) return;

    const card = btn.closest(".product-card");
    const activeColorBtn = card?.querySelector(".color-dot-btn.active");
    const currentColor =
      activeColorBtn?.dataset.color || btn.dataset.color || "ivory";

    const isSaved = wishlist.some(
      (item) =>
        String(item.id) === String(productId) &&
        item.color.toLowerCase() === currentColor.toLowerCase(),
    );

    btn.classList.toggle("active", isSaved);
  });

  renderAccountWishlist();
}

export function isInWishlist(id) {
  return wishlist.some((item) => String(item.id) === String(id));
}

// ─── RENDER ACCOUNT WISHLIST GRID ──────────────────────────────────────────────
function renderAccountWishlist() {
  const container = document.getElementById("wishlist-container");
  if (!container) return;

  if (wishlist.length === 0) {
    container.innerHTML = `
      <p class="account-placeholder-text">Your wishlist is currently empty. Explore our collection to add items.</p>
      <a href="catalog.html" class="order-action-link" style="margin-top: 16px; display: inline-block;">Go to Shop</a>
    `;
    return;
  }

  container.innerHTML = `
    <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 32px; margin-top: 24px;">
      ${wishlist
        .map(
          (item) => `
        <div class="product-card" style="position: relative; border: 1px solid var(--color-border); padding: 16px; background: rgba(255,255,255,0.01);">
          <div class="product-img-wrapper" style="position: relative;">
            <img src="${item.img || "/images/placeholder.jpg"}" alt="${item.title}" style="width: 100%; aspect-ratio: 3/4; object-fit: cover; border-radius: 2px;">
            <button class="account-wishlist-remove" data-id="${item.id}" data-color="${item.color}" style="position: absolute; top: 8px; right: 8px; background: var(--bg-body); border: none; cursor: pointer; color: var(--color-text); padding: 6px; border-radius: 50%; display: flex; align-items: center; justify-content: center; opacity: 0.8; transition: opacity 0.3s;">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="1.5">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
              </svg>
            </button>
          </div>
          <div class="product-info" style="margin-top: 16px; display: flex; justify-content: space-between; align-items: flex-start;">
            <div>
              <h3 style="font-size: 14px; margin: 0; font-weight: 500;">${item.title}</h3>
              <p style="font-size: 12px; color: var(--color-muted); margin: 4px 0 0 0; text-transform: capitalize;">Color: ${item.color}</p>
            </div>
            <span style="font-size: 14px; color: var(--color-text); font-weight: 500;">€ ${item.price}</span>
          </div>
          <button class="btn-secondary wishlist-to-cart-btn" data-id="${item.id}" data-title="${item.title}" data-price="${item.price}" data-variant="${item.color}" data-img="${item.img}" style="width: 100%; margin-top: 16px; padding: 10px; font-size: 11px;">Move to Bag</button>
        </div>
      `,
        )
        .join("")}
    </div>
  `;
}

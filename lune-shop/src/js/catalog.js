import { PRODUCTS } from "./data/products-data.js";
import { initModals } from "./modal.js";
import { initWishlist, updateWishlistUI } from "./wishlist.js";
import { gsap } from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

let activeFilters = {
  categories: [],
  colors: [],
  sizes: [],
  sort: "newest",
};

function getColorHex(colorName) {
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

function renderCatalog() {
  const grid = document.getElementById("catalog-grid");
  if (!grid) return;

  const itemsToFilter = Array.isArray(PRODUCTS) ? PRODUCTS : [];

  let filteredProducts = itemsToFilter.filter((product) => {
    const normalizedActiveCategories = activeFilters.categories.map((c) =>
      String(c).toLowerCase().trim(),
    );
    const productCategory = product.category
      ? String(product.category).toLowerCase().trim()
      : "";
    const categoryMatch =
      normalizedActiveCategories.length === 0 ||
      normalizedActiveCategories.includes(productCategory);

    const colorMatch =
      activeFilters.colors.length === 0 ||
      (product.variants &&
        product.variants.some((v) => {
          const variantColor = v.color
            ? String(v.color).toLowerCase().trim()
            : "";
          return activeFilters.colors.includes(variantColor);
        }));

    const sizeMatch =
      activeFilters.sizes.length === 0 ||
      (product.sizes &&
        product.sizes.some((size) =>
          activeFilters.sizes.includes(String(size).trim()),
        ));

    return categoryMatch && colorMatch && sizeMatch;
  });

  if (activeFilters.sort === "price-low") {
    filteredProducts.sort((a, b) => a.price - b.price);
  } else if (activeFilters.sort === "price-high") {
    filteredProducts.sort((a, b) => b.price - a.price);
  } else if (activeFilters.sort === "newest") {
    filteredProducts.sort((a, b) => new Date(b.date) - new Date(a.date));
  }

  gsap.to(grid, {
    opacity: 0,
    y: 10,
    duration: 0.15,
    onComplete: () => {
      if (filteredProducts.length === 0) {
        grid.innerHTML =
          '<p class="no-results" style="grid-column: 1/-1; color: var(--color-muted);">No products match your criteria.</p>';
      } else {
        grid.innerHTML = filteredProducts
          .map((p) => {
            let selectedVariant =
              p.variants && p.variants.length > 0
                ? p.variants[0]
                : { img: "/images/placeholder.jpg", color: "ivory" };

            if (activeFilters.colors.length > 0 && p.variants) {
              const matched = p.variants.find((v) =>
                activeFilters.colors.includes(v.color.toLowerCase()),
              );
              if (matched) selectedVariant = matched;
            }

            const mainImg = selectedVariant.img || "/images/placeholder.jpg";
            const currentSubColor = selectedVariant.color || "ivory";

            return `
        <div class="product-card">
      <div class="product-img-wrapper">
        <div class="product-img open-product" data-id="${p.id}" style="cursor: pointer;">
          <img src="${mainImg}" alt="${p.name}" class="catalog-main-img" loading="lazy" onerror="this.src='/images/placeholder.jpg';">
        </div>
        
        <button class="wish-btn" data-id="${p.id}" data-color="${currentSubColor}" aria-label="Add to wishlist">
  <svg class="wish-icon-svg" viewBox="0 0 24 24" width="18" height="18">
    <path
      d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
      fill="none"
      stroke="currentColor"
      stroke-width="1.8"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </svg>
</button>

        <button class="quick-add-btn" 
          data-id="${p.id}"
          data-title="${p.name}" 
          data-price="${p.price}" 
          data-variant="${currentSubColor}"
          data-img="${mainImg}">
          ADD TO CART
        </button>
      </div>
      <div class="product-info" style="text-align: left;">
        <p class="product-name">${p.name}</p>
        <div class="product-colors-preview">
          ${
            p.variants
              ? p.variants
                  .map(
                    (v) => `
            <button 
              class="color-dot-btn ${v.color.toLowerCase() === currentSubColor.toLowerCase() ? "active" : ""}" 
              style="background:${getColorHex(v.color)}" 
              title="${v.color}"
              data-id="${p.id}"
              data-color="${v.color}">
            </button>
          `,
                  )
                  .join("")
              : ""
          }
        </div>
        <p class="product-price">€ ${p.price}</p>
      </div>
    </div>`;
          })
          .join("");

        initCatalogColorClicks();
      }

      if (typeof initModals === "function") initModals();
      if (typeof initWishlist === "function") initWishlist();
      if (typeof updateWishlistUI === "function") updateWishlistUI();

      grid.style.opacity = "1";
      grid.style.transform = "translateY(0)";

      const cards = grid.querySelectorAll(".product-card");
      if (cards.length > 0) {
        gsap.fromTo(
          cards,
          { opacity: 0, y: 15 },
          {
            opacity: 1,
            y: 0,
            stagger: 0.04,
            duration: 0.4,
            ease: "power2.out",
            clearProps: "all",
          },
        );
      }
    },
  });
}

function initCatalogColorClicks() {
  const dots = document.querySelectorAll(".color-dot-btn");
  dots.forEach((dot) => {
    dot.addEventListener("click", (e) => {
      e.stopPropagation();
      const productId = dot.dataset.id;
      const colorName = dot.dataset.color;
      const card = dot.closest(".product-card");
      const img = card.querySelector(".catalog-main-img");
      const quickAddBtn = card.querySelector(".quick-add-btn");

      const product = PRODUCTS.find((p) => p.id === productId);
      const variant = product.variants.find(
        (v) => v.color.toLowerCase() === colorName.toLowerCase(),
      );

      if (variant && img) {
        card
          .querySelectorAll(".color-dot-btn")
          .forEach((d) => d.classList.remove("active"));
        dot.classList.add("active");

        gsap.to(img, {
          opacity: 0,
          duration: 0.15,
          onComplete: () => {
            img.src = variant.img;
            if (quickAddBtn) {
              quickAddBtn.dataset.img = variant.img;
              quickAddBtn.dataset.variant = colorName;
            }

            gsap.to(img, { opacity: 1, duration: 0.15 });
            if (typeof updateWishlistUI === "function") updateWishlistUI();
          },
        });
      }
    });
  });
}

function initHeaderNavFilters() {
  const categoryInputs = document.querySelectorAll("#category-filters input");
  const handleHashFilter = () => {
    const hash = window.location.hash.replace("#", "").toLowerCase().trim();
    categoryInputs.forEach((input) => (input.checked = false));
    activeFilters.categories = [];

    if (!hash || hash === "new") {
      activeFilters.sort = "newest";
      renderCatalog();
      return;
    }

    const targetCheckbox = Array.from(categoryInputs).find(
      (input) => input.value.toLowerCase().trim() === hash,
    );

    if (targetCheckbox) {
      targetCheckbox.checked = true;
      activeFilters.categories.push(targetCheckbox.value.toLowerCase());
    }
    renderCatalog();
  };

  window.addEventListener("hashchange", handleHashFilter);
  if (window.location.hash) handleHashFilter();
  else renderCatalog();
}

// ─── Cart Initialization and Click Listeners ─────────────────────────────
export function initCatalog() {
  renderCatalog();
  initHeaderNavFilters();

  const catalogGrid = document.getElementById("catalog-grid");
  if (catalogGrid) {
    catalogGrid.addEventListener("click", (e) => {
      const quickAddBtn = e.target.closest(".quick-add-btn");
      if (!quickAddBtn) return;

      e.preventDefault();
      e.stopPropagation();

      const productData = {
        id: String(quickAddBtn.dataset.id),
        title: quickAddBtn.dataset.title,
        price: Number(quickAddBtn.dataset.price) || 0,
        variant: quickAddBtn.dataset.variant || "Default",
        img: quickAddBtn.dataset.img,
        quantity: 1,
      };

      if (typeof window.addToCart === "function") {
        window.addToCart(productData);
        window.toggleCart(true);
      }

      quickAddBtn.classList.add("added");
      quickAddBtn.textContent = "Added!";
      quickAddBtn.disabled = true;

      setTimeout(() => {
        quickAddBtn.classList.remove("added");
        quickAddBtn.textContent = "ADD TO CART";
        quickAddBtn.disabled = false;
      }, 1500);
    });
  }

  document.getElementById("sort-select")?.addEventListener("change", (e) => {
    activeFilters.sort = e.target.value;
    renderCatalog();
  });

  const categoryInputs = document.querySelectorAll("#category-filters input");
  categoryInputs.forEach((input) => {
    input.addEventListener("change", () => {
      activeFilters.categories = Array.from(categoryInputs)
        .filter((i) => i.checked)
        .map((i) => String(i.value).toLowerCase().trim());
      renderCatalog();
    });
  });

  const colorDots = document.querySelectorAll("#color-filters .color-dot");
  colorDots.forEach((dot) => {
    dot.addEventListener("click", (e) => {
      e.preventDefault();
      const color = dot.dataset.color
        ? dot.dataset.color.toLowerCase().trim()
        : "";
      if (!color) return;

      dot.classList.toggle("active");
      if (dot.classList.contains("active")) {
        activeFilters.colors.push(color);
      } else {
        activeFilters.colors = activeFilters.colors.filter((c) => c !== color);
      }
      renderCatalog();
    });
  });

  const sizeBtns = document.querySelectorAll("#size-filters .filter-size-btn");
  sizeBtns.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      const size = btn.textContent.trim();
      btn.classList.toggle("active");

      if (btn.classList.contains("active")) {
        activeFilters.sizes.push(size);
      } else {
        activeFilters.sizes = activeFilters.sizes.filter((s) => s !== size);
      }
      renderCatalog();
    });
  });

  document.getElementById("reset-filters")?.addEventListener("click", () => {
    activeFilters = { categories: [], colors: [], sizes: [], sort: "newest" };
    categoryInputs.forEach((input) => (input.checked = false));
    colorDots.forEach((dot) => dot.classList.remove("active"));
    sizeBtns.forEach((btn) => btn.classList.remove("active"));
    renderCatalog();
  });
}

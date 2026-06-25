import { gsap } from "gsap";
import { PRODUCTS } from "./data/products-data.js";

export function initSearch() {
  const searchOpenBtn = document.getElementById("search-open");
  const searchOverlay = document.getElementById("search-overlay");
  const searchCloseBtn = document.getElementById("search-close");
  const searchInput = document.getElementById("search-input");
  const searchResults = document.getElementById("search-results");

  if (!searchOpenBtn || !searchOverlay) return;

  const newOpenBtn = searchOpenBtn.cloneNode(true);
  searchOpenBtn.parentNode.replaceChild(newOpenBtn, searchOpenBtn);

  newOpenBtn.addEventListener("click", (e) => {
    e.preventDefault();
    gsap.killTweensOf([searchOverlay, searchInput]);

    searchOverlay.classList.add("active");
    searchOverlay.style.display = "flex";
    searchOverlay.style.pointerEvents = "auto";

    if (searchInput) searchInput.value = "";
    if (searchResults) searchResults.innerHTML = "";

    gsap.fromTo(searchOverlay, { opacity: 0 }, { opacity: 1, duration: 0.3 });
    gsap.fromTo(
      searchInput,
      { y: -15, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.4,
        delay: 0.1,
        ease: "power2.out",
        onComplete: () => {
          if (searchInput) searchInput.focus();
        },
      },
    );
  });

  if (searchInput && searchResults) {
    searchInput.addEventListener("input", (e) => {
      const query = e.target.value.trim().toLowerCase();

      if (query.length === 0) {
        searchResults.innerHTML = "";
        return;
      }

      const filtered = PRODUCTS.filter((product) => {
        return (
          product.name.toLowerCase().includes(query) ||
          (product.description &&
            product.description.toLowerCase().includes(query))
        );
      });

      renderSearchResults(filtered, searchResults);
    });
  }

  if (searchCloseBtn) {
    searchCloseBtn.addEventListener("click", (e) => {
      e.preventDefault();
      closeSearch(searchOverlay);
    });
  }

  searchOverlay.addEventListener("click", (e) => {
    if (
      e.target === searchOverlay ||
      e.target.classList.contains("search-container")
    ) {
      closeSearch(searchOverlay);
    }
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && searchOverlay.classList.contains("active")) {
      closeSearch(searchOverlay);
    }
  });
}

function renderSearchResults(products, container) {
  if (products.length === 0) {
    container.innerHTML = `<p class="search-no-results">No products found matching your request.</p>`;
    return;
  }

  container.innerHTML = products
    .map((product) => {
      const defaultImg = product.variants[0]?.img || "";

      return `
        <div class="search-result-item" data-id="${product.id}">
          <img src="${defaultImg}" alt="${product.name}" class="search-result-img" />
          <div class="search-result-info">
            <p class="search-result-name">${product.name}</p>
            <p class="search-result-price">€ ${product.price}</p>
          </div>
        </div>
      `;
    })
    .join("");

  container.querySelectorAll(".search-result-item").forEach((item) => {
    item.addEventListener("click", () => {
      const productId = item.getAttribute("data-id");

      const overlay = document.getElementById("search-overlay");
      if (overlay) overlay.style.display = "none";

      const openTrigger = document.createElement("div");
      openTrigger.setAttribute("data-id", productId);
      openTrigger.className = "open-product";
      document.body.appendChild(openTrigger);
      openTrigger.click();
      openTrigger.remove();
    });
  });
}

function closeSearch(overlay) {
  gsap.to(overlay, {
    opacity: 0,
    duration: 0.25,
    onComplete: () => {
      overlay.classList.remove("active");
      overlay.style.display = "none";
      overlay.style.pointerEvents = "none";
    },
  });
}

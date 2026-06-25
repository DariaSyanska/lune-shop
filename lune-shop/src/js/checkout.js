import "../styles/main.scss";
import { initSearch } from "./search.js";
import { initTheme } from "./theme.js";
import { initCart, toggleCart } from "./cart.js";

document.body.style.opacity = "1";
document.body.style.visibility = "visible";

function safeInit(name, initFn) {
  try {
    if (typeof initFn === "function") initFn();
  } catch (error) {
    console.error(`${name} initialization failed:`, error);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  safeInit("Theme", initTheme);
  safeInit("Search", initSearch);
  safeInit("Cart", initCart);
});

const CART_STORAGE_KEY = "lune-cart";

function loadCart() {
  try {
    return JSON.parse(localStorage.getItem(CART_STORAGE_KEY)) || [];
  } catch (e) {
    console.error("Failed to load cart for checkout:", e);
    return [];
  }
}

const cart = loadCart();
let discountAmount = 0;
let paypalRendered = false;

// ─── 1. ORDER RENDERING AND CONNECTION WITH WEB3FORMS ──────────────────────────────────────
function renderCheckout() {
  const container = document.getElementById("checkout-products-list");
  const subtotalEl = document.getElementById("chk-subtotal");
  const finalTotalEl = document.getElementById("chk-final-total");

  const formOrderItemsInput = document.getElementById("form-order-items");
  const formTotalPriceInput = document.getElementById("form-total-price");

  if (!container) return 0;

  if (cart.length === 0) {
    container.innerHTML = `<p style="font-size: 14px; color: var(--color-muted);">Your bag is empty.</p>`;
    const submitBtn = document.getElementById("submit-order-btn");
    if (submitBtn) submitBtn.disabled = true;
    return 0;
  }

  let subtotal = 0;
  let textSummaryForEmail = [];

  container.innerHTML = cart
    .map((item) => {
      const qty = Number(item.quantity) || 1;
      const price = Number(item.price) || 0;
      const itemTotal = qty * price;
      subtotal += itemTotal;

      textSummaryForEmail.push(
        `${item.title} (${item.variant}) x${qty} — €${itemTotal.toFixed(2)}`,
      );

      return `
        <div style="display: flex; gap: 16px; margin-bottom: 20px; align-items: center;">
          <img src="${item.img.startsWith("http") || item.img.startsWith("/") ? item.img : "/" + item.img}" 
               style="width: 50px; height: 65px; object-fit: cover; border-radius: 2px;" alt="${item.title}" />
          <div style="flex: 1; min-width: 0;">
            <p style="font-size: 14px; font-weight: 500; margin: 0; color: var(--color-text); text-overflow: ellipsis; overflow: hidden; white-space: nowrap;">${item.title}</p>
            <p style="font-size: 12px; color: var(--color-muted); margin: 4px 0 0 0;">${item.variant} × ${qty}</p>
          </div>
          <p style="font-size: 14px; font-weight: 500; margin: 0; color: var(--color-text);">€ ${itemTotal.toFixed(2)}</p>
        </div>
      `;
    })
    .join("");

  const finalTotal = Math.max(0, subtotal - discountAmount);

  if (subtotalEl) subtotalEl.textContent = `€ ${subtotal.toFixed(2)}`;
  if (finalTotalEl) finalTotalEl.textContent = `€ ${finalTotal.toFixed(2)}`;

  if (formOrderItemsInput)
    formOrderItemsInput.value = textSummaryForEmail.join("\n");
  if (formTotalPriceInput)
    formTotalPriceInput.value = `€ ${finalTotal.toFixed(2)}`;

  return finalTotal;
}

// ─── 2. PAYPAL SANDBOX INTEGRATION ──────────────────────────────────────────────
function initPayPalIntegration(totalAmount) {
  if (
    typeof window.paypal === "undefined" ||
    totalAmount <= 0 ||
    paypalRendered
  )
    return;

  window.paypal
    .Buttons({
      style: { color: "black", shape: "rect", label: "pay", height: 46 },
      createOrder: function (data, actions) {
        return actions.order.create({
          purchase_units: [
            { amount: { currency_code: "EUR", value: totalAmount.toFixed(2) } },
          ],
        });
      },
      onApprove: function (data, actions) {
        return actions.order.capture().then(function (details) {
          const form =
            document.getElementById("checkout-form") ||
            document.getElementById("lune-checkout-form");
          if (form) {
            const paySuccessInput = document.createElement("input");
            paySuccessInput.type = "hidden";
            paySuccessInput.name = "PayPal_Status";
            paySuccessInput.value = `PAID (ID: ${details.id})`;
            form.appendChild(paySuccessInput);

            saveOrderToHistory(totalAmount);
            localStorage.removeItem(CART_STORAGE_KEY);
            form.submit();
          }
        });
      },
    })
    .render("#paypal-button-container");

  paypalRendered = true;
}

// ─── 3. PROMOTION CODE LOGIC ────────────────────────────────────────────────────
function initPromoCode() {
  const applyBtn = document.getElementById("apply-promo-trigger");
  const promoInput = document.getElementById("promo-input");
  const discountRow = document.querySelector(".discount-row");
  const discountEl = document.getElementById("chk-discount");

  if (!applyBtn || !promoInput) return;

  applyBtn.addEventListener("click", () => {
    const code = promoInput.value.trim().toUpperCase();

    if (code === "LUNE10") {
      let subtotal = cart.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0,
      );
      discountAmount = subtotal * 0.1;

      if (discountEl)
        discountEl.textContent = `- € ${discountAmount.toFixed(2)}`;
      if (discountRow) discountRow.style.display = "flex";

      const newTotal = renderCheckout();

      if (paypalRendered) {
        paypalRendered = false;
        initPayPalIntegration(newTotal);
      }
      alert("Promo code LUNE10 applied! 10% discount added.");
    } else {
      alert("Invalid promo code.");
    }
  });
}

// ─── 4. SMART PAYMENT METHODS SWITCHING ──────────────────────────────────
function initPaymentToggle(finalPrice) {
  const radios = document.querySelectorAll('input[name="payment-option"]');
  const cardSection = document.getElementById("card-inputs-area");
  const paypalSection = document.getElementById("paypal-button-area");
  const defaultSubmitBtn = document.getElementById("submit-order-btn");

  const cardNumInput = document.getElementById("card-num");
  const cardDateInput = document.getElementById("card-date");
  const cardCvcInput = document.getElementById("card-cvc");

  cardNumInput?.addEventListener("input", (e) => {
    let value = e.target.value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    let matches = value.match(/\d{4,16}/g);
    let match = (matches && matches[0]) || "";
    let parts = [];

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }

    e.target.value = parts.length > 0 ? parts.join(" ") : value;
  });

  cardDateInput?.addEventListener("input", (e) => {
    let value = e.target.value.replace(/\D/g, "");
    if (value.length > 2) {
      e.target.value = value.substring(0, 2) + "/" + value.substring(2, 4);
    } else {
      e.target.value = value;
    }
  });

  cardCvcInput?.addEventListener("input", (e) => {
    e.target.value = e.target.value.replace(/\D/g, "");
  });

  radios.forEach((radio) => {
    radio.addEventListener("change", (e) => {
      document.querySelectorAll(".payment-radio-card").forEach((card) => {
        card.classList.remove("active");
      });
      e.target.closest(".payment-radio-card")?.classList.add("active");

      if (e.target.value === "paypal") {
        if (defaultSubmitBtn) defaultSubmitBtn.style.display = "none";
        initPayPalIntegration(finalPrice);

        if (cardSection) cardSection.style.display = "none";
        if (paypalSection) paypalSection.style.display = "block";
      } else {
        if (defaultSubmitBtn) defaultSubmitBtn.style.display = "";
        if (paypalSection) paypalSection.style.display = "none";
        if (cardSection) cardSection.style.display = "block";
      }
    });
  });
}

// ─── 5. LOGIC OF SELECTING A COUNTRY WITH SEARCH ─────────────────────────
function initCountrySelect() {
  const countries = [
    "Aland Islands",
    "Albania",
    "Algeria",
    "American Samoa",
    "Andorra",
    "Angola",
    "Anguilla",
    "Antarctica",
    "Australia",
    "Austria",
    "Azerbaijan",
    "Belgium",
    "Canada",
    "Czech Republic",
    "Denmark",
    "Estonia",
    "Finland",
    "France",
    "Germany",
    "Greece",
    "Hungary",
    "Ireland",
    "Italy",
    "Japan",
    "Latvia",
    "Lithuania",
    "Netherlands",
    "Norway",
    "Poland",
    "Portugal",
    "Slovakia",
    "Spain",
    "Sweden",
    "Switzerland",
    "Ukraine",
    "United Kingdom",
    "United States",
  ];

  const triggerDiv = document.getElementById("open-country-modal");
  const mainInput = document.getElementById("chk-country");
  const modal = document.getElementById("country-modal-overlay");
  const closeBtn = document.getElementById("close-country-modal");
  const searchInput = document.getElementById("country-search-input");
  const listContainer = document.getElementById("country-list-container");

  if (!triggerDiv || !modal) return;

  function renderList(filterText = "") {
    listContainer.innerHTML = "";
    const filtered = countries.filter((c) =>
      c.toLowerCase().includes(filterText.toLowerCase()),
    );

    if (filtered.length === 0) {
      listContainer.innerHTML = `<p style="padding: 16px 24px; color: var(--color-muted); font-size: 14px;">No countries found.</p>`;
      return;
    }

    filtered.forEach((country) => {
      const isChecked = mainInput.value === country ? "checked" : "";
      const html = `
        <label class="country-option-label">
          <input type="radio" name="modal_country" value="${country}" ${isChecked}>
          <span class="radio-circle"></span>
          <span class="country-name">${country}</span>
        </label>
      `;
      listContainer.insertAdjacentHTML("beforeend", html);
    });
  }

  triggerDiv.addEventListener("click", (e) => {
    e.preventDefault();
    renderList("");
    searchInput.value = "";
    modal.classList.add("active");
    modal.style.zIndex = "9999";
    setTimeout(() => searchInput.focus(), 100);
  });

  function closeModal() {
    modal.classList.remove("active");
  }

  closeBtn.addEventListener("click", (e) => {
    e.preventDefault();
    closeModal();
  });

  modal.addEventListener("click", (e) => {
    if (e.target === modal) closeModal();
  });

  searchInput.addEventListener("input", (e) => renderList(e.target.value));

  listContainer.addEventListener("change", (e) => {
    if (e.target.name === "modal_country") {
      mainInput.value = e.target.value;
      mainInput.focus();
      setTimeout(() => mainInput.blur(), 50);
      closeModal();
    }
  });
}

// ─── 6. SAVING AN ORDER TO HISTORY ─────────────────────────
function saveOrderToHistory(totalPrice) {
  const currentCart = loadCart();
  if (currentCart.length === 0) return;

  const pastOrders = JSON.parse(localStorage.getItem("lune-orders")) || [];

  const newOrder = {
    id: Math.floor(100000 + Math.random() * 900000),
    date: new Date().toLocaleDateString("en-GB", {
      month: "long",
      day: "numeric",
      year: "numeric",
    }),
    total: totalPrice,
    items: currentCart,
  };

  pastOrders.unshift(newOrder);
  localStorage.setItem("lune-orders", JSON.stringify(pastOrders));
}

// ─── 7. IRON START WITH SAFETY AND CLEANING ─────────────────────────
document.addEventListener("DOMContentLoaded", () => {
  const finalPrice = renderCheckout();

  initPromoCode();
  initPaymentToggle(finalPrice);
  initCountrySelect();

  const form =
    document.getElementById("lune-checkout-form") ||
    document.getElementById("checkout-form");

  if (form) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      const submitBtn = document.getElementById("submit-order-btn");
      if (submitBtn) {
        submitBtn.textContent = "Processing...";
        submitBtn.style.opacity = "0.6";
        submitBtn.style.pointerEvents = "none";
      }

      try {
        const formData = new FormData(form);
        const response = await fetch(form.action, {
          method: "POST",
          body: formData,
        });

        if (response.ok) {
          saveOrderToHistory(finalPrice);
          localStorage.removeItem(CART_STORAGE_KEY);
          window.location.href = "thank-you.html";
        } else {
          throw new Error("Form submission failed");
        }
      } catch (err) {
        console.error("Order error:", err);
        alert("Something went wrong. Please try again.");
        if (submitBtn) {
          submitBtn.textContent = "Submit Order";
          submitBtn.style.opacity = "1";
          submitBtn.style.pointerEvents = "auto";
        }
      }
    });
  }

  document.body.style.opacity = "1";
  document.body.style.visibility = "visible";
});

# 🌙 Lune Fashion Store

A modern minimalist fashion e-commerce platform built with high-performance web technologies.

## ✨ Overview

**Lune** is a concept online store focused on elegant aesthetics, smooth interactions, and a premium user experience. This project serves as a showcase of advanced front-end development, featuring a fully functional interactive store, custom UI components, and a refined shopping flow.

## 🛠 Tech Stack

- **Build Tool:** Vite 8
- **Languages:** HTML5, CSS3 (SCSS/BEM), JavaScript (ES6+)
- **Animations:** GSAP
- **Smooth Scrolling:** Lenis
- **Deployment:** Vercel

## 🚀 Key Features

- 🌗 **Theme System:** Dynamic Light / Dark mode.
- 🛍 **Dynamic Catalog:** Interactive browsing with product filtering.
- 🛒 **Shopping Experience:** Full cart drawer system and wishlist functionality.
- 🔍 **Smart UI:** Search overlay and intuitive modal interactions.
- 🧾 **Checkout Flow:** Dedicated checkout and success interfaces.
- 📱 **Mobile-First:** Fully responsive design with optimized touch interactions.

## 📸 Visuals

### 🌗 Themes & Overview

| Dark Mode                                       | Light Mode                                        |
| :---------------------------------------------- | :------------------------------------------------ |
| ![Dark Preview](./screenshots/preview-dark.jpg) | ![Light Preview](./screenshots/preview-light.jpg) |

### 🛍 Shopping Experience

| Catalog                         | Product Modal                     | Size Chart                                  | Wishlist                                |
| :------------------------------ | :-------------------------------- | :------------------------------------------ | :-------------------------------------- |
| ![Shop](./screenshots/shop.jpg) | ![Modal](./screenshots/modal.jpg) | ![Size Chart](./screenshots/size-chart.jpg) | ![Wishlist](./screenshots/wishlist.jpg) |

| Cart                            | Checkout                                | Shipping                                |
| :------------------------------ | :-------------------------------------- | :-------------------------------------- |
| ![Cart](./screenshots/cart.jpg) | ![Checkout](./screenshots/checkout.jpg) | ![Shipping](./screenshots/shipping.jpg) |

### 👤 Account & Access

| My Account                            | Login                             | QR ID                       |
| :------------------------------------ | :-------------------------------- | :-------------------------- |
| ![Account](./screenshots/account.jpg) | ![Login](./screenshots/login.jpg) | ![QR](./screenshots/qr.jpg) |

### ℹ️ Information & Legal

| About                             | Contact                               | Privacy                                      | Terms                             | Conditions                                  |
| :-------------------------------- | :------------------------------------ | :------------------------------------------- | :-------------------------------- | :------------------------------------------ |
| ![About](./screenshots/about.jpg) | ![Contact](./screenshots/contact.jpg) | ![Privacy](./screenshots/privacy-policy.jpg) | ![Terms](./screenshots/terms.jpg) | ![Conditions](./screenshots/conditions.jpg) |

### 📱 Mobile Experience

| Home (Light)                                       | Home (Dark)                                      | Navigation                                         | Shop                                       |
| :------------------------------------------------- | :----------------------------------------------- | :------------------------------------------------- | :----------------------------------------- |
| ![Home Light](./screenshots/mobile-home-light.jpg) | ![Home Dark](./screenshots/mobile-home-dark.jpg) | ![Navigation](./screenshots/mobile-navigation.jpg) | ![Shop 1](./screenshots/mobile-shop-1.jpg) |

| Shop Details                               | Wishlist                                       | Cart                                   |
| :----------------------------------------- | :--------------------------------------------- | :------------------------------------- |
| ![Shop 2](./screenshots/mobile-shop-2.jpg) | ![Wishlist](./screenshots/mobile-wishlist.jpg) | ![Cart](./screenshots/mobile-cart.jpg) |

## 📂 Project Structure

The project follows a highly modular architecture, utilizing the **7-1 SCSS Pattern** for scalable styling and component-based JavaScript.

```text
lune-shop/
├── .github/workflows/       # CI/CD pipelines (Deployments)
├── public/                  # Static assets (fonts, images)
├── src/
│   ├── assets/              # Project media, SVGs, and screenshots
│   ├── js/                  # Modular JavaScript logic
│   │   ├── data/            # JSON/JS data structures (products data)
│   │   ├── animations.js    # GSAP animation controllers
│   │   ├── cart.js          # Cart state and drawer logic
│   │   ├── checkout.js      # Form validation and checkout flow
│   │   ├── modal.js         # Accessible modal interactions
│   │   ├── theme.js         # Dark/Light mode toggling logic
│   │   └── ...              # Other modules (wishlist, search, catalog)
│   ├── styles/              # Advanced SCSS Architecture (BEM)
│   │   ├── animations/      # Keyframes and transition classes
│   │   ├── base/            # Resets, typography, and scrollbars
│   │   ├── components/      # UI components (buttons, modals, cards)
│   │   ├── layout/          # Global layout sections (header, footer)
│   │   ├── pages/           # Page-specific styles (home, catalog, auth)
│   │   ├── theme/           # CSS variables and theme overrides
│   │   ├── utilities/       # SCSS mixins and helper functions
│   │   └── main.scss        # Main stylesheet entry point
│   └── main.js              # Main JavaScript entry point
├── *.html                   # Multi-page HTML views (index, catalog, checkout, etc.)
├── package.json             # Project dependencies and scripts
└── vite.config.js           # Vite build configuration
```

## 💻 Getting Started

To run this project locally:

1. Clone the repository:

   ```bash
   git clone https://github.com/DariaSyanska/lune-shop.git
   ```

2. Navigate to the project directory:

   ```bash
   cd lune-shop
   ```

3. Install dependencies:

   ```bash
   npm install
   ```

4. Start the development server:

   ```bash
   npm run dev
   ```

5. Build for production:

   ```bash
   npm run build
   ```

## ⚠️ Disclaimer

This is a non-commercial, conceptual project created solely for portfolio and demonstration purposes. It is not a real functioning business. All products, brands, and transactions are fictional or used for educational purposes only. No actual payments are processed.

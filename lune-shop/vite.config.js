import { defineConfig } from "vite";
import viteImagemin from "vite-plugin-imagemin";
import { resolve } from "path";

export default defineConfig({
  base: "/lune-shop/",
  server: {
    port: 3000,
    open: true,
  },
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
        about: resolve(__dirname, "about.html"),
        account: resolve(__dirname, "account.html"),
        catalog: resolve(__dirname, "catalog.html"),
        checkout: resolve(__dirname, "checkout.html"),
        contact: resolve(__dirname, "contact.html"),
        login: resolve(__dirname, "login.html"),
        privacy: resolve(__dirname, "privacy.html"),
        product: resolve(__dirname, "product.html"),
        shipping: resolve(__dirname, "shipping.html"),
        success: resolve(__dirname, "success.html"),
        terms: resolve(__dirname, "terms.html"),
        thankyou: resolve(__dirname, "thank-you.html"),
        error404: resolve(__dirname, "404.html"),
      },
    },
  },
  plugins: [
    viteImagemin({
      gifsicle: { optimizationLevel: 7, interlaced: false },
      optipng: { optimizationLevel: 7 },
      mozjpeg: { quality: 82 },
      pngquant: { quality: [0.8, 0.9], speed: 4 },
      svgo: {
        plugins: [
          { name: "removeViewBox", active: false },
          { name: "removeEmptyAttrs", active: false },
        ],
      },
    }),
  ],
});

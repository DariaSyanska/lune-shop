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
        catalog: resolve(__dirname, "catalog.html"),
        product: resolve(__dirname, "product.html"),
        contact: resolve(__dirname, "contact.html"),
        checkout: resolve(__dirname, "checkout.html"),
        shipping: resolve(__dirname, "shipping.html"),
        terms: resolve(__dirname, "terms.html"),
        privacy: resolve(__dirname, "privacy.html"),
        success: resolve(__dirname, "success.html"),
        thankyou: resolve(__dirname, "thank-you.html"),
        email: resolve(__dirname, "email.html"),
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

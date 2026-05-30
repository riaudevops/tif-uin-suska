import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import tailwindcss from "@tailwindcss/vite"; // Gunakan kembali Vite plugin
import vercel from "@astrojs/vercel";

export default defineConfig({
  i18n: {
    defaultLocale: "id",
    locales: ["id", "en"],
    routing: {
      prefixDefaultLocale: false,
    },
  },

  output: "server",
  adapter: vercel({
    webAnalytics: {
      enabled: true,
    },
  }),

  // 1. TAMBAHKAN DI SINI: Tailwind v4 masuk ke dalam plugin Vite
  vite: {
    plugins: [tailwindcss()],
  },

  integrations: [
    react(),
    // 2. HAPUS Tailwind dari daftar integrations ini
  ],
});

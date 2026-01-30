import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import tailwind from "@astrojs/tailwind";
import vercel from "@astrojs/vercel";

export default defineConfig({
  i18n: {
    defaultLocale: "id",
    locales: ["id", "en"],
    routing: {
      prefixDefaultLocale: false
    },
  },

  output: "server",
  adapter: vercel({
    webAnalytics: {
      enabled: true,
    }
  }),
  
  integrations: [
    react(),
    tailwind({
      applyBaseStyles: false,
    }),
  ],
});
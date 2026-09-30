// @ts-check
import { defineConfig } from "astro/config";
import node from "@astrojs/node";
import react from "@astrojs/react";
import tailwindcss from "@tailwindcss/vite";

// https://astro.build/config
export default defineConfig({
	output: "server",

	prefetch: {
		prefetchAll: true,
		defaultStrategy: "hover",
	},

	adapter: node({
		mode: "standalone",
	}),

	integrations: [react()],

	i18n: {
		defaultLocale: "id",
		locales: ["id", "en"],
		fallback: {
			en: "id",
		},
		routing: {
			prefixDefaultLocale: false,
			fallbackType: "rewrite",
		},
	},

	vite: {
		resolve: {
			alias: {
				"@": new URL("./src", import.meta.url).pathname,
			},
		},
		plugins: [tailwindcss()],
	},
});

// @ts-check
import { defineConfig } from "astro/config";
import node from "@astrojs/node";
import react from "@astrojs/react";
import tailwindcss from "@tailwindcss/vite";
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
	site: "https://tif.uin-suska.ac.id",
	output: "server",

	prefetch: {
		prefetchAll: true,
		defaultStrategy: "hover",
	},

	adapter: node({
		mode: "standalone",
	}),

	integrations: [react(),
		sitemap()
	],

	redirects: {
		"/profil/sejarah": "/profile/history",
		"/profil": "/profile/history",
		"/visi-misi/visimisi": "/profile/vision-mission",
		"/visimisi/visimisi": "/profile/vision-mission",
		"/visi-misi": "/profile/vision-mission",
		"/visimisi": "/profile/vision-mission",
		"/profil/visi-misi": "/profile/vision-mission",
		"/profil/visimisi": "/profile/vision-mission",
		"/rencana/rencana": "/profile/strategic-plan",
		"/rencana": "/profile/strategic-plan",
		"/panduan/panduan": "/profile/guidelines",
		"/panduan": "/profile/guidelines",
		"/struktur/struktur": "/profile/organization",
		"/struktur": "/profile/organization",
		"/dosen/dosen": "/profile/faculty",
		"/dosen": "/profile/faculty",
		"/laboratorium/laboratorium": "/profile/laboratories",
		"/laboratorium": "/profile/laboratories",
		"/ruangkelas/ruangkelas": "/profile/classrooms",
		"/ruangkelas": "/profile/classrooms",
		"/prestasi/prestasi": "/profile/achievements",
		"/prestasi": "/profile/achievements",
		"/kurikulum/kurikulum": "/academics/curriculum",
		"/kurikulum": "/academics/curriculum",
		"/beasiswa/beasiswa": "/academics/scholarships",
		"/beasiswa": "/academics/scholarships",
		"/tugas-akhir/tugas-akhir": "/academics/thesis",
		"/tugas/tugas-akhir": "/academics/thesis",
		"/tugas-akhir": "/academics/thesis",
		"/kerja-praktik/kerja-praktik": "/academics/internship",
		"/kp/kerja-praktik": "/academics/internship",
		"/kerja-praktik": "/academics/internship",
		"/labssquad/labssquad": "/academics/labs-squad",
		"/labssquad": "/academics/labs-squad",
		"/aiorc/aiorc": "/research/aiorc",
		"/aiorc": "/research/aiorc",
		"/software/software": "/research/software-engineering",
		"/software": "/research/software-engineering",
		"/information/information": "/research/information-technology",
		"/information": "/research/information-technology",
		"/berita": "/news",
		"/agenda/agenda": "/events",
		"/agenda": "/events",
		"/alumni/alumni": "/alumni",
		"/akreditasi": "/accreditation",
		"/mitra": "/partners",
	},

	i18n: {
		defaultLocale: "en",
		locales: ["en", "id"],
		fallback: {
			id: "en",
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

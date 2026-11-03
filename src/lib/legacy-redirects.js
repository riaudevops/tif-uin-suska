/**
 * Legacy URL map used by Astro's `redirects` config (301) and by the
 * middleware for locale-prefixed requests (e.g. `/id/berita`).
 *
 * Keys are locale-less source paths; values are locale-less destinations.
 * Keeping this in one module prevents the config and the middleware from
 * drifting apart.
 */
export const LEGACY_REDIRECTS = {
  "/profil/sejarah": "/profile/history",
  "/visi-misi/visimisi": "/profile/vision-mission",
  "/visimisi/visimisi": "/profile/vision-mission",
  "/rencana/rencana": "/profile/strategic-plan",
  "/panduan/panduan": "/profile/guidelines",
  "/struktur/struktur": "/profile/organization",
  "/dosen/dosen": "/profile/faculty",
  "/laboratorium/laboratorium": "/profile/laboratories",
  "/ruangkelas/ruangkelas": "/profile/classrooms",
  "/prestasi/prestasi": "/profile/achievements",
  "/kurikulum/kurikulum": "/academics/curriculum",
  "/beasiswa/beasiswa": "/academics/scholarships",
  "/tugas-akhir/tugas-akhir": "/academics/thesis",
  "/tugas/tugas-akhir": "/academics/thesis",
  "/kerja-praktik/kerja-praktik": "/academics/internship",
  "/kp/kerja-praktik": "/academics/internship",
  "/labssquad/labssquad": "/academics/labs-squad",
  "/aiorc/aiorc": "/research/aiorc",
  "/software/software": "/research/software-engineering",
  "/information/information": "/research/information-technology",
  "/berita": "/news",
  "/agenda/agenda": "/events",
  "/alumni/alumni": "/alumni",
  "/akreditasi": "/accreditation",
  "/mitra": "/partners",
};

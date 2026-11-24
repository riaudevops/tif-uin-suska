/**
 * Struktur organisasi Program Studi Teknik Informatika.
 *
 * Daftar di bawah adalah acuan susunan pejabat struktural. Data pribadi
 * (nama lengkap, foto, dan tautan profil) tetap diambil dari koleksi
 * `dosen_tif` di Directus agar halaman ini selalu sinkron dengan halaman
 * /profile/faculty. Jabatan dari CMS dipakai bila ada; kalau kosong atau
 * masih generik ("Dosen"), dipakai jabatan dari daftar ini.
 */

export const ORGANIZATION_GROUPS = [
  {
    id: "leadership",
    labelKey: "inline.study-program-leadership",
    featured: true,
    members: [
      {
        match: "muhammad affandes",
        fallbackName: "Muhammad Affandes, S.T., M.T.",
        role: { id: "Kepala Prodi", en: "Head of Study Program" },
      },
      {
        match: "elvia budianita",
        fallbackName: "Elvia Budianita, S.T., M.Cs.",
        role: { id: "Sekretaris Prodi", en: "Secretary of Study Program" },
      },
    ],
  },
  {
    id: "laboratories",
    labelKey: "inline.heads-of-laboratory",
    featured: true,
    members: [
      {
        match: "pizaini",
        fallbackName: "Pizaini, S.T., M.Kom.",
        role: {
          id: "Kepala Lab Pengembangan Aplikasi",
          en: "Head of Application Development Lab",
        },
      },
      {
        match: "nazruddin safaat h",
        fallbackName: "Nazruddin Safaat H., S.T., M.T.",
        role: {
          id: "Kepala Lab Pengembangan Riset",
          en: "Head of Research Development Lab",
        },
      },
    ],
  },
  {
    id: "coordinators",
    labelKey: "inline.academic-coordinators",
    members: [
      {
        match: "fadhilah syafria",
        fallbackName: "Fadhilah Syafria, S.T., M.Kom.",
        role: { id: "Koord. Tugas Akhir", en: "Final Project Coordinator" },
      },
      {
        match: "rahmad abdillah",
        fallbackName: "Rahmad Abdillah, S.T., M.T.",
        role: { id: "Koord. Tugas Akhir", en: "Final Project Coordinator" },
      },
      {
        match: "liza afriyanti",
        fallbackName: "Liza Afriyanti, S.Kom., M.Kom.",
        role: { id: "Koord. Kerja Praktik", en: "Internship Coordinator" },
      },
      {
        match: "lola oktavia",
        fallbackName: "Lola Oktavia, S.S.T., M.T.I.",
        role: { id: "Koord. Kerja Praktik", en: "Internship Coordinator" },
      },
    ],
  },
];

/**
 * Nama depan sebelum koma, tanpa gelar, huruf kecil, tanpa tanda baca.
 * "Muhammad Affandes, S.T., M.T." -> "muhammad affandes"
 */
export function normalizePersonName(value) {
  return String(value || "")
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .split(",")[0]
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

const GENERIC_ROLES = new Set([
  "dosen",
  "dosen pengajar",
  "lecturer",
  "teaching lecturer",
  "faculty member",
]);

function resolveRole(cmsRole, fallbackRole, lang) {
  const normalized = String(cmsRole || "").trim();
  if (normalized && !GENERIC_ROLES.has(normalized.toLowerCase())) {
    return normalized;
  }
  return fallbackRole?.[lang] || fallbackRole?.id || "";
}

/**
 * Gabungkan daftar pejabat struktural dengan data dosen dari CMS.
 *
 * @param {Array<object>} dosenData hasil `normalizeDosen`
 * @param {string} lang "id" atau "en"
 */
export function buildOrganizationStructure(dosenData = [], lang = "id") {
  const people = Array.isArray(dosenData) ? dosenData : [];

  return ORGANIZATION_GROUPS.map((group) => ({
    id: group.id,
    labelKey: group.labelKey,
    featured: Boolean(group.featured),
    members: group.members.map((member) => {
      const person = people.find(
        (candidate) =>
          normalizePersonName(candidate?.nama) === member.match,
      );

      return {
        id: person?.id ?? member.match,
        name: person?.nama || member.fallbackName,
        role: resolveRole(person?.jabatan, member.role, lang),
        photo: person?.foto || null,
        email: person?.email || "",
        href: person ? `/profile/faculty/${person.slug || person.id}` : "",
        matched: Boolean(person),
      };
    }),
  }));
}

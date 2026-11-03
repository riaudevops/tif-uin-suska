import { API_ITEMS_URL } from "./cms.js";
import { fetchWithCache } from "./cachedFetch.js";
import { AGENDA_FIELDS, normalizeAgenda } from "./agenda.js";
import { DOSEN_FIELDS, normalizeDosen } from "./dosen.js";
import { BERITA_LIST_FIELDS, normalizeBeritaList } from "./berita.js";
import { localizePath } from "./translations.js";

const STATIC_PAGES = [
    {
        title: "Beranda",
        title_en: "Home",
        url: "/",
        category: "Halaman",
        category_en: "Page",
        keywords: "home beranda utama",
        keywords_en: "home main landing",
    },
    {
        title: "Sejarah",
        title_en: "History",
        url: "/profile/history",
        category: "Profil",
        category_en: "Profile",
        keywords: "sejarah prodi teknik informatika",
        keywords_en: "history study program informatics engineering",
    },
    {
        title: "Visi, Misi, Tujuan, dan Strategi",
        title_en: "Vision, Mission, Goals, and Strategy",
        url: "/profile/vision-mission",
        category: "Profil",
        category_en: "Profile",
        keywords: "visi misi tujuan strategi",
        keywords_en: "vision mission goals strategy",
    },
    {
        title: "Rencana Strategis",
        title_en: "Strategic Plan",
        url: "/profile/strategic-plan",
        category: "Profil",
        category_en: "Profile",
        keywords: "rencana strategis perencanaan",
        keywords_en: "strategic plan planning",
    },
    {
        title: "Panduan Pengelolaan Pendidikan",
        title_en: "Educational Management Guidelines",
        url: "/profile/guidelines",
        category: "Profil",
        category_en: "Profile",
        keywords: "panduan pengelolaan pendidikan",
        keywords_en: "guidelines educational management",
    },
    {
        title: "Struktur Organisasi",
        title_en: "Organizational Structure",
        url: "/profile/organization",
        category: "Profil",
        category_en: "Profile",
        keywords: "struktur organisasi pimpinan",
        keywords_en: "organizational structure leadership",
    },
    {
        title: "Dosen",
        title_en: "Lecturers",
        url: "/profile/faculty",
        category: "Profil",
        category_en: "Profile",
        keywords: "dosen pengajar tenaga pendidik",
        keywords_en: "lecturers faculty teaching staff",
    },
    {
        title: "Laboratorium",
        title_en: "Laboratories",
        url: "/profile/laboratories",
        category: "Profil",
        category_en: "Profile",
        keywords: "laboratorium lab fasilitas",
        keywords_en: "laboratory lab facilities",
    },
    {
        title: "Ruang Kelas",
        title_en: "Classrooms",
        url: "/profile/classrooms",
        category: "Profil",
        category_en: "Profile",
        keywords: "ruang kelas",
        keywords_en: "classrooms lecture rooms",
    },
    {
        title: "Prestasi",
        title_en: "Achievements",
        url: "/profile/achievements",
        category: "Profil",
        category_en: "Profile",
        keywords: "prestasi penghargaan",
        keywords_en: "achievements awards accomplishments",
    },
    {
        title: "Kurikulum",
        title_en: "Curriculum",
        url: "/academics/curriculum",
        category: "Akademik",
        category_en: "Academic",
        keywords: "kurikulum mata kuliah",
        keywords_en: "curriculum courses subjects",
    },
    {
        title: "Beasiswa",
        title_en: "Scholarships",
        url: "/academics/scholarships",
        category: "Akademik",
        category_en: "Academic",
        keywords: "beasiswa",
        keywords_en: "scholarships funding financial aid",
    },
    {
        title: "Info Tugas Akhir (TA)",
        title_en: "Thesis Information (TA)",
        url: "/academics/thesis",
        category: "Akademik",
        category_en: "Academic",
        keywords: "tugas akhir skripsi ta",
        keywords_en: "thesis final project dissertation",
    },
    {
        title: "Info Kerja Praktik (KP)",
        title_en: "Internship Information (KP)",
        url: "/academics/internship",
        category: "Akademik",
        category_en: "Academic",
        keywords: "kerja praktik kp magang",
        keywords_en: "internship practical work kp",
    },
    {
        title: "Labs Squad",
        title_en: "Labs Squad",
        url: "/academics/labs-squad",
        category: "Akademik",
        category_en: "Academic",
        keywords: "labs squad",
        keywords_en: "labs squad",
    },
    {
        title: "Software Engineering",
        title_en: "Software Engineering",
        url: "/research/software-engineering",
        category: "Penelitian",
        category_en: "Research",
        keywords: "software engineering riset",
        keywords_en: "software engineering research",
    },
    {
        title: "Information Technology",
        title_en: "Information Technology",
        url: "/research/information-technology",
        category: "Penelitian",
        category_en: "Research",
        keywords: "information technology riset",
        keywords_en: "information technology research",
    },
    {
        title: "AIORC",
        title_en: "AIORC",
        url: "/research/aiorc",
        category: "Penelitian",
        category_en: "Research",
        keywords: "aiorc penelitian kecerdasan buatan optimasi",
        keywords_en: "aiorc research artificial intelligence optimization",
    },
    {
        title: "Berita",
        title_en: "News",
        url: "/news",
        category: "Berita",
        category_en: "News",
        keywords: "berita artikel informasi",
        keywords_en: "news articles information",
    },
    {
        title: "Agenda",
        title_en: "Agenda",
        url: "/events",
        category: "Agenda",
        category_en: "Agenda",
        keywords: "agenda kegiatan acara",
        keywords_en: "agenda events activities",
    },
    // {
    //     title: "Alumni",
    //     title_en: "Alumni",
    //     url: "/alumni",
    //     category: "Alumni",
    //     category_en: "Alumni",
    //     keywords: "alumni lulusan",
    //     keywords_en: "alumni graduates",
    // },
    {
        title: "Akreditasi",
        title_en: "Accreditation",
        url: "/accreditation",
        category: "Halaman",
        category_en: "Page",
        keywords: "akreditasi lam infokom",
        keywords_en: "accreditation",
    },
    {
        title: "Mitra",
        title_en: "Partners",
        url: "/partners",
        category: "Halaman",
        category_en: "Page",
        keywords: "mitra kerjasama kolaborasi",
        keywords_en: "partners collaboration cooperation",
    },
    {
        title: "International Office",
        title_en: "International Office",
        url: "/international-office",
        category: "Halaman",
        category_en: "Page",
        keywords: "international office internasional",
        keywords_en: "international office global",
    },
];

function normalize(text) {
    return text
        .toLowerCase()
        .normalize("NFD")
        .replace(/\p{M}/gu, "");
}

export function filterSearchItems(items, query, limit = 12) {
    const q = normalize(query.trim());
    if (!q) return [];

    return items
        .filter((item) => {
            const haystack = normalize(`${item.title} ${item.keywords} ${item.category}`);
            return haystack.includes(q);
        })
        .slice(0, limit);
}

const API_TOKEN = import.meta.env?.DIRECTUS_TOKEN;

const API_HEADERS = {
    "Content-Type": "application/json",
    ...(API_TOKEN ? { Authorization: `Bearer ${API_TOKEN}` } : {}),
};

/**
 * Fetches a Directus collection through the shared cache so a slow or failing
 * CMS never blocks (or duplicates) work on every search-index request.
 */
async function fetchCollection(query, ttlMs = 300000) {
    return fetchWithCache(`${API_ITEMS_URL}${query}`, { headers: API_HEADERS }, ttlMs);
}

export async function buildSearchIndex(lang = "id") {
    const currentLang = lang === "en" ? "en" : "id";
    const isEn = currentLang === "en";

    // Localized static pages (Indonesian URLs are always prefixed with /id)
    const items = STATIC_PAGES.map((page) => ({
        title: isEn ? (page.title_en || page.title) : page.title,
        url: localizePath(page.url, currentLang),
        category: isEn ? (page.category_en || page.category) : page.category,
        keywords: isEn ? (page.keywords_en || page.keywords) : page.keywords,
    }));

    const results = await Promise.allSettled([
        fetchCollection(
            `/berita?fields=${BERITA_LIST_FIELDS}` +
                `&filter[status][_in]=publish,Publish,published,Published` +
                `&sort=-date,-modified&limit=100`,
        ),
        fetchCollection(`/dosen_tif?fields=${DOSEN_FIELDS}&limit=-1`),
        fetchCollection(`/agenda?fields=${AGENDA_FIELDS}&limit=50`),
        fetchCollection(`/kerja_praktik?fields=id,title,slug,excerpt&limit=50`),
        fetchCollection(`/tugas_akhir?fields=id,title,slug,excerpt&limit=50`),
        fetchCollection(`/beasiswa?fields=id,title,slug,excerpt&limit=50`),
    ]);

    /** Returns `data` for a settled, successful collection request. */
    const dataAt = (index) => {
        const result = results[index];
        if (result.status !== "fulfilled") return [];
        const payload = result.value;
        return Array.isArray(payload?.data) ? payload.data : [];
    };

    // Berita lives in a `translations` relation, so it must be normalized first.
    for (const post of normalizeBeritaList(dataAt(0), currentLang)) {
        if (!post?.title || !post?.slug) continue;
        items.push({
            title: post.title,
            url: localizePath(`/news/${post.slug}`, currentLang),
            category: isEn ? "News" : "Berita",
            keywords: `${post.title} ${post.excerpt || ""} ${isEn ? "news article" : "berita artikel"}`,
        });
    }

    for (const rawDosen of dataAt(1)) {
        const dosen = normalizeDosen(rawDosen, currentLang);
        if (!dosen?.nama) continue;
        items.push({
            title: dosen.nama,
            url: localizePath(`/profile/faculty/${dosen.id}`, currentLang),
            category: isEn ? "Lecturers" : "Dosen",
            keywords: `${dosen.nama} ${dosen.jabatan || ""} ${dosen.email || ""} ${dosen.nip || ""} ${isEn ? "lecturer faculty" : "dosen pengajar"}`,
        });
    }

    for (const rawAgenda of dataAt(2)) {
        const agenda = normalizeAgenda(rawAgenda, currentLang);
        if (!agenda?.title) continue;
        items.push({
            title: agenda.title,
            url: localizePath("/events", currentLang),
            category: "Agenda",
            keywords: `${agenda.title} ${agenda.description} ${agenda.location} ${agenda.category} ${isEn ? "agenda events" : "agenda kegiatan"}`,
        });
    }

    const detailCollections = [
        {
            index: 3,
            base: "/academics/internship",
            category: isEn ? "Internship" : "Kerja Praktik",
            extra: isEn ? "internship kp" : "kerja praktik kp magang",
        },
        {
            index: 4,
            base: "/academics/thesis",
            category: isEn ? "Thesis" : "Tugas Akhir",
            extra: isEn ? "thesis final project" : "tugas akhir skripsi ta sempro munaqasyah",
        },
        {
            index: 5,
            base: "/academics/scholarships",
            category: isEn ? "Scholarships" : "Beasiswa",
            extra: isEn ? "scholarship grant tuition funding" : "beasiswa bantuan ukt kip-k genbi",
        },
    ];

    for (const collection of detailCollections) {
        for (const entry of dataAt(collection.index)) {
            if (!entry?.title || !entry?.slug) continue;
            items.push({
                title: entry.title,
                url: localizePath(`${collection.base}/${entry.slug}`, currentLang),
                category: collection.category,
                keywords: `${entry.title} ${entry.excerpt || ""} ${collection.extra}`,
            });
        }
    }

    return items;
}

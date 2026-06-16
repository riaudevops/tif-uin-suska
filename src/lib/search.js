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
        url: "/profil-pages/sejarah",
        category: "Profil",
        category_en: "Profile",
        keywords: "sejarah prodi teknik informatika",
        keywords_en: "history study program informatics engineering",
    },
    {
        title: "Visi, Misi, Tujuan, dan Strategi",
        title_en: "Vision, Mission, Goals, and Strategy",
        url: "/visimisi-pages/visimisi",
        category: "Profil",
        category_en: "Profile",
        keywords: "visi misi tujuan strategi",
        keywords_en: "vision mission goals strategy",
    },
    {
        title: "Rencana Strategi",
        title_en: "Strategic Plan",
        url: "/rencana-pages/rencana",
        category: "Profil",
        category_en: "Profile",
        keywords: "rencana strategi perencanaan",
        keywords_en: "strategic plan planning",
    },
    {
        title: "Panduan Pengelolaan Pendidikan",
        title_en: "Educational Management Guidelines",
        url: "/panduan-pages/panduan",
        category: "Profil",
        category_en: "Profile",
        keywords: "panduan pengelolaan pendidikan",
        keywords_en: "guidelines educational management",
    },
    {
        title: "Struktur Organisasi",
        title_en: "Organizational Structure",
        url: "/struktur-pages/struktur",
        category: "Profil",
        category_en: "Profile",
        keywords: "struktur organisasi pimpinan",
        keywords_en: "organizational structure leadership",
    },
    {
        title: "Dosen",
        title_en: "Lecturers",
        url: "/dosen-pages/dosen",
        category: "Profil",
        category_en: "Profile",
        keywords: "dosen pengajar tenaga pendidik",
        keywords_en: "lecturers faculty teaching staff",
    },
    {
        title: "Laboratorium",
        title_en: "Laboratories",
        url: "/laboratorium-pages/laboratorium",
        category: "Profil",
        category_en: "Profile",
        keywords: "laboratorium lab fasilitas",
        keywords_en: "laboratory lab facilities",
    },
    {
        title: "Ruang Kelas",
        title_en: "Classrooms",
        url: "/ruangkelas/ruangkelas",
        category: "Profil",
        category_en: "Profile",
        keywords: "ruang kelas",
        keywords_en: "classrooms lecture rooms",
    },
    {
        title: "Prestasi",
        title_en: "Achievements",
        url: "/prestasi-pages/prestasi",
        category: "Profil",
        category_en: "Profile",
        keywords: "prestasi penghargaan",
        keywords_en: "achievements awards accomplishments",
    },
    {
        title: "Kurikulum",
        title_en: "Curriculum",
        url: "/kurikulum-pages/kurikulum",
        category: "Akademik",
        category_en: "Academic",
        keywords: "kurikulum mata kuliah",
        keywords_en: "curriculum courses subjects",
    },
    {
        title: "Beasiswa",
        title_en: "Scholarships",
        url: "/beasiswa/beasiswa",
        category: "Akademik",
        category_en: "Academic",
        keywords: "beasiswa",
        keywords_en: "scholarships funding financial aid",
    },
    {
        title: "Info Tugas Akhir (TA)",
        title_en: "Thesis Information (TA)",
        url: "/tugas/tugas-akhir",
        category: "Akademik",
        category_en: "Academic",
        keywords: "tugas akhir skripsi ta",
        keywords_en: "thesis final project dissertation",
    },
    {
        title: "Info Kerja Praktik (KP)",
        title_en: "Internship Information (KP)",
        url: "/kp/kerja-praktik",
        category: "Akademik",
        category_en: "Academic",
        keywords: "kerja praktik kp magang",
        keywords_en: "internship practical work kp",
    },
    {
        title: "Labs Squad",
        title_en: "Labs Squad",
        url: "/labssquad-pages/labssquad",
        category: "Akademik",
        category_en: "Academic",
        keywords: "labs squad",
        keywords_en: "labs squad",
    },
    {
        title: "Software Engineering",
        title_en: "Software Engineering",
        url: "/software-pages/software",
        category: "Penelitian",
        category_en: "Research",
        keywords: "software engineering riset",
        keywords_en: "software engineering research",
    },
    {
        title: "Information Technology",
        title_en: "Information Technology",
        url: "/information-pages/information",
        category: "Penelitian",
        category_en: "Research",
        keywords: "information technology riset",
        keywords_en: "information technology research",
    },
    {
        title: "AIORC",
        title_en: "AIORC",
        url: "/aiorc-pages/aiorc",
        category: "Penelitian",
        category_en: "Research",
        keywords: "aiorc penelitian kecerdasan buatan optimasi",
        keywords_en: "aiorc research artificial intelligence optimization",
    },
    {
        title: "Berita",
        title_en: "News",
        url: "/berita",
        category: "Berita",
        category_en: "News",
        keywords: "berita artikel informasi",
        keywords_en: "news articles information",
    },
    {
        title: "Agenda",
        title_en: "Agenda",
        url: "/agenda-pages/agenda",
        category: "Agenda",
        category_en: "Agenda",
        keywords: "agenda kegiatan acara",
        keywords_en: "agenda events activities",
    },
    {
        title: "Alumni",
        title_en: "Alumni",
        url: "/alumni-pages/alumni",
        category: "Alumni",
        category_en: "Alumni",
        keywords: "alumni lulusan",
        keywords_en: "alumni graduates",
    },
    {
        title: "Akreditasi",
        title_en: "Accreditation",
        url: "/akreditasi",
        category: "Halaman",
        category_en: "Page",
        keywords: "akreditasi lam infokom",
        keywords_en: "accreditation",
    },
    {
        title: "Mitra",
        title_en: "Partners",
        url: "/mitra",
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

export async function buildSearchIndex(lang = "id") {
    const API_URL = import.meta.env.BASE_API_URL || "http://localhost:8055";
    const isEn = lang === "en";

    // Localize static pages based on language
    const items = STATIC_PAGES.map((page) => ({
        title: isEn ? (page.title_en || page.title) : page.title,
        url: isEn ? `/en${page.url === "/" ? "" : page.url}` : page.url,
        category: isEn ? (page.category_en || page.category) : page.category,
        keywords: isEn ? (page.keywords_en || page.keywords) : page.keywords,
    }));

    const fetches = await Promise.allSettled([
        fetch(
            `${API_URL}/items/article?fields=title,slug,category.name&sort=-publish&limit=100`,
            { cache: "no-store" },
        ),
        fetch(`${API_URL}/items/dosen?fields=nama,slug,jabatan,email,nip`, { cache: "no-store" }),
        fetch(`${API_URL}/items/agenda?fields=title,deskripsi,lokasi,kategori.nama_kategori&limit=50`, {
            cache: "no-store",
        }),
    ]);

    const [articlesRes, dosenRes, agendaRes] = fetches;

    if (articlesRes.status === "fulfilled" && articlesRes.value.ok) {
        const json = await articlesRes.value.json();
        for (const post of json.data || []) {
            if (!post?.title || !post?.slug) continue;
            const categoryName = post.category?.name || (isEn ? "News" : "Berita");
            items.push({
                title: post.title,
                url: isEn ? `/en/berita/${post.slug}` : `/berita/${post.slug}`,
                category: isEn ? "News" : "Berita",
                keywords: `${post.title} ${categoryName} ${isEn ? "news article" : "berita artikel"}`,
            });
        }
    }

    if (dosenRes.status === "fulfilled" && dosenRes.value.ok) {
        const json = await dosenRes.value.json();
        for (const dosen of json.data || []) {
            if (!dosen?.nama || !dosen?.slug) continue;
            items.push({
                title: dosen.nama,
                url: isEn ? `/en/dosen/${dosen.slug}` : `/dosen/${dosen.slug}`,
                category: isEn ? "Lecturers" : "Dosen",
                keywords: `${dosen.nama} ${dosen.jabatan || ""} ${dosen.email || ""} ${dosen.nip || ""} ${isEn ? "lecturer faculty" : "dosen pengajar"}`,
            });
        }
    }

    if (agendaRes.status === "fulfilled" && agendaRes.value.ok) {
        const json = await agendaRes.value.json();
        for (const agenda of json.data || []) {
            if (!agenda?.title) continue;
            const kategori =
                agenda.kategori?.nama_kategori || agenda.kategori?.nama || "";
            items.push({
                title: agenda.title,
                url: isEn ? "/en/agenda-pages/agenda" : "/agenda-pages/agenda",
                category: isEn ? "Agenda" : "Agenda",
                keywords: `${agenda.title} ${agenda.deskripsi || ""} ${agenda.lokasi || ""} ${kategori} ${isEn ? "agenda events" : "agenda kegiatan"}`,
            });
        }
    }

    return items;
}
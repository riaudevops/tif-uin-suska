const STATIC_PAGES = [
    { title: "Beranda", url: "/", category: "Halaman", keywords: "home beranda utama" },
    { title: "Sejarah", url: "/profil-pages/sejarah", category: "Profil", keywords: "sejarah prodi teknik informatika" },
    {
        title: "Visi, Misi, Tujuan, dan Strategi",
        url: "/visimisi-pages/visimisi",
        category: "Profil",
        keywords: "visi misi tujuan strategi",
    },
    {
        title: "Rencana Strategi",
        url: "/rencana-pages/rencana",
        category: "Profil",
        keywords: "rencana strategi perencanaan",
    },
    {
        title: "Panduan Pengelolaan Pendidikan",
        url: "/panduan-pages/panduan",
        category: "Profil",
        keywords: "panduan pengelolaan pendidikan",
    },
    {
        title: "Struktur Organisasi",
        url: "/struktur-pages/struktur",
        category: "Profil",
        keywords: "struktur organisasi pimpinan",
    },
    { title: "Dosen", url: "/dosen-pages/dosen", category: "Profil", keywords: "dosen pengajar tenaga pendidik" },
    {
        title: "Laboratorium",
        url: "/laboratorium-pages/laboratorium",
        category: "Profil",
        keywords: "laboratorium lab fasilitas",
    },
    { title: "Ruang Kelas", url: "/ruang-kelas", category: "Profil", keywords: "ruang kelas" },
    { title: "Prestasi", url: "/prestasi-pages/prestasi", category: "Profil", keywords: "prestasi penghargaan" },
    { title: "Kurikulum", url: "/kurikulum-pages/kurikulum", category: "Akademik", keywords: "kurikulum mata kuliah" },
    { title: "Beasiswa", url: "/beasiswa", category: "Akademik", keywords: "beasiswa" },
    {
        title: "Info Tugas Akhir (TA)",
        url: "/tugas-akhir",
        category: "Akademik",
        keywords: "tugas akhir skripsi ta",
    },
    {
        title: "Info Kerja Praktik (KP)",
        url: "/kerja-praktik",
        category: "Akademik",
        keywords: "kerja praktik kp magang",
    },
    { title: "Labs Squad", url: "/labssquad-pages/labssquad", category: "Akademik", keywords: "labs squad" },
    {
        title: "Software Engineering",
        url: "/software-pages/software",
        category: "Penelitian",
        keywords: "software engineering riset",
    },
    {
        title: "Information Technology",
        url: "/information-pages/information",
        category: "Penelitian",
        keywords: "information technology riset",
    },
    { title: "AIORC", url: "/aiorc-pages/aiorc", category: "Penelitian", keywords: "aiorc penelitian" },
    { title: "Berita", url: "/berita", category: "Berita", keywords: "berita artikel informasi" },
    { title: "Agenda", url: "/agenda-pages/agenda", category: "Agenda", keywords: "agenda kegiatan acara" },
    { title: "Alumni", url: "/alumni-pages/alumni", category: "Alumni", keywords: "alumni lulusan" },
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

export async function buildSearchIndex() {
    const API_URL = import.meta.env.BASE_API_URL || "http://localhost:8055";
    const items = [...STATIC_PAGES];

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
            const categoryName = post.category?.name || "Berita";
            items.push({
                title: post.title,
                url: `/berita/${post.slug}`,
                category: "Berita",
                keywords: `${post.title} ${categoryName} berita artikel`,
            });
        }
    }

    if (dosenRes.status === "fulfilled" && dosenRes.value.ok) {
        const json = await dosenRes.value.json();
        for (const dosen of json.data || []) {
            if (!dosen?.nama || !dosen?.slug) continue;
            items.push({
                title: dosen.nama,
                url: `/dosen/${dosen.slug}`,
                category: "Dosen",
                keywords: `${dosen.nama} ${dosen.jabatan || ""} ${dosen.email || ""} ${dosen.nip || ""} dosen`,
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
                url: "/agenda-pages/agenda",
                category: "Agenda",
                keywords: `${agenda.title} ${agenda.deskripsi || ""} ${agenda.lokasi || ""} ${kategori} agenda kegiatan`,
            });
        }
    }

    return items;
}
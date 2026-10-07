export const AGENDA_FIELDS =
  "id,tanggal_pelaksanaan,status,link_pendaftaran,kategori,image,translations.languages_code,translations.title_translate,translations.deskripsi_translate,translations.lokasi_translate";

export function normalizeAgenda(item, lang = "id") {
  if (!item || typeof item !== "object") return null;

  const translations = Array.isArray(item.translations) ? item.translations : [];
  const currentLang = (lang || "id").toLowerCase();
  const matchedTranslation = translations.find(
    (translation) =>
      typeof translation === "object" &&
      (translation?.languages_code || "").toLowerCase() === currentLang,
  );
  const fallbackTranslation =
    translations.find(
      (translation) =>
        typeof translation === "object" &&
        (translation?.languages_code || "").toLowerCase() === "id",
    ) ||
    translations.find(
      (translation) =>
        typeof translation === "object" && translation !== null,
    ) ||
    {};
  const activeTranslation = matchedTranslation || fallbackTranslation;
  const category =
    (typeof item.kategori === "object" &&
      (item.kategori?.nama_kategori ||
        item.kategori?.nama ||
        item.kategori?.title ||
        item.kategori?.name)) ||
    item.status ||
    "Umum";

  return {
    id: item.id,
    title:
      activeTranslation.title_translate ||
      activeTranslation.title ||
      activeTranslation.judul_translate ||
      activeTranslation.judul ||
      item.title ||
      "Agenda Tanpa Judul",
    description:
      activeTranslation.deskripsi_translate ||
      activeTranslation.deskripsi ||
      item.deskripsi ||
      "-",
    location:
      activeTranslation.lokasi_translate ||
      activeTranslation.lokasi ||
      item.lokasi ||
      "-",
    category: String(category),
    date: item.tanggal_pelaksanaan || null,
    status: item.status || "",
    registrationLink: item.link_pendaftaran || null,
    image: item.image || null,
  };
}

export const PRESTASI_LIST_FIELDS =
  "id,waktu_penyelenggaraan,mahasiswa,translations.languages_code,translations.nama_kegiatan_translate,translations.tingkat_translate,translations.prestasi_translate";
export const PRESTASI_DETAIL_FIELDS =
  PRESTASI_LIST_FIELDS;
  
export function normalizePrestasi(item, lang = "id") {
  if (!item || typeof item !== "object") return null;

  const currentLang = (lang || "id").toLowerCase();
  const translations = Array.isArray(item.translations) ? item.translations : [];
  const matchedTranslation = translations.find(
    (translation) =>
      (translation?.languages_code || "").toLowerCase() === currentLang,
  );
  const fallbackTranslation =
    translations.find(
      (translation) =>
        (translation?.languages_code || "").toLowerCase() === "id",
    ) ||
    translations[0] ||
    {};
  let year = "-";
  if (item.waktu_penyelenggaraan) {
    if (!isNaN(item.waktu_penyelenggaraan)) {
      year = String(item.waktu_penyelenggaraan);
    } else {
      const parsedDate = new Date(item.waktu_penyelenggaraan);
      year = !isNaN(parsedDate.getTime())
        ? parsedDate.getFullYear().toString()
        : String(item.waktu_penyelenggaraan);
    }
  }

  return {
    kegiatan:
      matchedTranslation?.nama_kegiatan_translate ||
      fallbackTranslation.nama_kegiatan_translate ||
      item.nama_kegiatan ||
      (currentLang === "en" ? "Untitled Achievement" : "Tanpa Nama"),
    nama: item.mahasiswa || (currentLang === "en" ? "Unknown" : "Anonim"),
    tahun: year,
    tingkat:
      matchedTranslation?.tingkat_translate ||
      fallbackTranslation.tingkat_translate ||
      item.tingkat ||
      (currentLang === "en" ? "Local" : "Lokal"),
    prestasi:
      matchedTranslation?.prestasi_translate ||
      fallbackTranslation.prestasi_translate ||
      item.prestasi ||
      "-",
  };
}

export function normalizePrestasiList(items, lang = "id") {
  if (!Array.isArray(items)) return [];
  return items.map((item) => normalizePrestasi(item, lang)).filter(Boolean);
}

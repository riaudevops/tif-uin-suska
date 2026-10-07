export const DOSEN_FIELDS =
  "id,nama,foto,email,nip,goggle_scholar,sinta,bidang_keahlian,translations.languages_code,translations.jabatan_translate,translations.fakultas_translate,translations.pendidikan_translate";

export function normalizeDosen(item, lang = "id") {
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
  const education =
    matchedTranslation?.pendidikan_translate ||
    fallbackTranslation.pendidikan_translate ||
    item.pendidikan ||
    "";

  const educationList = Array.isArray(education)
    ? education.filter(Boolean)
    : typeof education === "string"
      ? education.split(/[\n,;]+/).map((value) => value.trim()).filter(Boolean)
      : [];

  return {
    ...item,
    nama: item.nama || "",
    jabatan:
      matchedTranslation?.jabatan_translate ||
      fallbackTranslation.jabatan_translate ||
      item.jabatan ||
      "",
    fakultas:
      matchedTranslation?.fakultas_translate ||
      fallbackTranslation.fakultas_translate ||
      item.fakultas ||
      "",
    pendidikan: educationList,
    foto: item.foto || null,
    email: item.email || "",
    nip: item.nip || "",
    google_scholar: item.goggle_scholar || item.google_scholar || null,
    sinta: item.sinta || null,
    bidang_keahlian: item.bidang_keahlian || null,
    activeTranslation,
  };
}

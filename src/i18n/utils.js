import { ui, defaultLanguage } from "./ui.js";

export function useTranslation(lang) {
  const currentLang = ui[lang] ? lang : defaultLanguage;

  function translate(key) {
    return ui[currentLang][key] || ui[defaultLanguage][key] || key;
  }

  return { translate };
}

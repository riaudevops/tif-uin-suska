import { ui, defaultLanguage } from './ui';

export function useTranslation(lang = defaultLanguage) {
    const translate = (key) => {
        return ui[lang]?.[key] || ui[defaultLanguage][key] || key;
    };
    
    return { translate };
}
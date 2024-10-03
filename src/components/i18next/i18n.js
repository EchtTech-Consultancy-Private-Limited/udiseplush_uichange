import { initReactI18next } from 'react-i18next';
import i18n from 'i18next';

import enTranslation from '../../assets/locales/en/translation.json';
import hiTranslation from '../../assets/locales/hi/translation.json';

const languageKey = 'selectedLanguage';
const selectedLanguage = localStorage.getItem(languageKey);

i18n
    .use(initReactI18next)
    .init({
        resources: {
            en: {
                translation: enTranslation,
            },
            hi: {
                translation: hiTranslation,
            },
        },
        lng: selectedLanguage || 'en',
        fallbackLng: 'en',
        interpolation: {
            escapeValue: false,
        },
    });

export default i18n;
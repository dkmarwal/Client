import i18n from "i18next";
import detector from "i18next-browser-languagedetector";
import translationEN from './locales/en.json';
import translationFR from './locales/fr.json';
import translationES from './locales/es.json';
import { initReactI18next } from 'react-i18next';

const options = {
  interpolation: {
    escapeValue: false, // not needed for react!!
  },
  debug: true,
  lng: 'en',
  resources: {
    en: {
      translation: translationEN
    },
    fr: {
      translation: translationFR
    },
    es: {
      translation: translationES
    }    
  },
  fallbackLng: 'en',  
  react: {
    wait: true,
    useSuspense: false,
    bindI18n: 'languageChanged loaded',
    bindStore: 'added removed',
    nsMode: 'default'
  },
};

i18n
  .use(detector)  
  .use(initReactI18next)  
  .init(options);
  

export default i18n;
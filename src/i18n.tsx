import i18n from 'i18next';
import {initReactI18next} from 'react-i18next';
import resourcesToBackend from 'i18next-resources-to-backend';
import LanguageDetector from 'i18next-browser-languagedetector';

i18n
    .use(resourcesToBackend((language, namespace, callback) => {
        import(`./locales/${language}/${namespace}.json`)
            .then((resources) => {
                callback(null, resources)
            })
            .catch((error) => {
                callback(error, null)
            })
    }))
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        /*debug: true,*/
        fallbackLng: 'en',
        interpolation: {
            escapeValue: false, // not needed for react as it escapes by default
        },
        backend: {
            // for all available options read the backend's repository readme file
            loadPath: `${process.env.PUBLIC_URL}/locales/{{lng}}/{{ns}}.json`
        }
    });

export default i18n;

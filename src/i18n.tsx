import i18n from 'i18next';
import {initReactI18next} from 'react-i18next';
import resourcesToBackend from 'i18next-resources-to-backend';
import LanguageDetector from 'i18next-browser-languagedetector';
import {de, enUS as en} from "date-fns/locale";
import {format as formatDate} from 'date-fns';

const locs: { [key: string]: Locale } = {"en": en, "de": de};
const resources = resourcesToBackend((language, namespace, callback) => {
    import(`./locales/${language}/${namespace}.json`)
        .then((resources) => callback(null, resources))
        .catch((error) => callback(error, null))
});

i18n.use(resources)
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        /*debug: true,*/
        fallbackLng: 'en',
        interpolation: {
            escapeValue: false, // not needed for react as it escapes by default
            format: (value, format, lng) => {
                if (value instanceof Date) try {
                    return formatDate(value, format!, {locale: locs[lng!]})
                } catch (e) {
                    console.error(e);
                }
                return value;
            }
        },
        backend: {
            // for all available options read the backend's repository readme file
            loadPath: `${process.env.PUBLIC_URL}/locales/{{lng}}/{{ns}}.json`
        }
    });

export default i18n;

import i18Next from "i18next";
import {initReactI18next, Trans, useTranslation} from "react-i18next";

/* Add languages here */
const languages = {
	nl: require("./nl.json"),
};

/* Don't change anything below this line */
const resources = {};
Object.keys(languages).forEach((lang) => {
	resources[lang] = {translation: languages[lang]};
});

i18Next.use(initReactI18next).init({
	resources,
	lng: "nl",
	fallbackLng: "nl",
	interpolation: {
		escapeValue: false,
	},
	defaultNS: "translation",
});

export {Trans};
export const useTranslate = useTranslation;
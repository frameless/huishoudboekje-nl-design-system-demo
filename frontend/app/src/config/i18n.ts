import i18Next from "i18next";
import {initReactI18next} from "react-i18next";

const defaultNamespace = "translation";

/* Add languages here */
const resources = {
	nl: {
		translation: require("../lang/nl.translation.json")
	},
};

i18Next.use(initReactI18next).init({
	resources,
	lng: "nl",
	fallbackLng: "nl",
	interpolation: {
		escapeValue: false,
	},
	defaultNS: defaultNamespace,
});

export default i18Next;
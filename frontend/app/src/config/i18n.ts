import i18Next from "i18next";
import {initReactI18next} from "react-i18next";

const defaultNamespace = "translation";
const notifationNamespace = "notifications"

/* Add languages here */
const resources = {
	nl: {
		translation: require("../lang/nl.translation.json"),
		notifications: require("../lang/nl.notifications.json"),
		paymentrecords: require("../lang/nl.paymentrecords.json"),
		formcomponents: require("../lang/nl.formcomponents.json"),
		citizendetails: require("../lang/nl.citizendetails.json")
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
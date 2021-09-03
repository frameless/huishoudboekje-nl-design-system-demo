import {useTranslation} from "react-i18next";
import useToaster from "../../../utils/useToaster";

const useHandleSaveBurgerErrors = () => {
	const {t} = useTranslation();
	const toast = useToaster();

	return (err) => {
		console.error(err);

		let message = err.message;
		if (err.message.includes("already exists")) {
			message = t("messages.burger.alreadyExists");
		}
		if (err.message.includes("BSN should consist of 8 or 9 digits")) {
			message = t("messages.burger.bsnLengthError");
		}
		if (err.message.includes("BSN does not meet the 11-proef requirement")) {
			message = t("messages.burger.bsnElfProefError");
		}

		toast({
			error: message,
		});
	};
};

export default useHandleSaveBurgerErrors;
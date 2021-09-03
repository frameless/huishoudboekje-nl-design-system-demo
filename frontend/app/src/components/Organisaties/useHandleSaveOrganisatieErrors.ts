import {useTranslation} from "react-i18next";
import useToaster from "../../utils/useToaster";

const useHandleSaveOrganisatieErrors = () => {
	const {t} = useTranslation();
	const toast = useToaster();

	return (err) => {
		console.error(err);

		let message = err.message;
		if (err.message.includes("already exists")) {
			message = t("messages.organisaties.alreadyExists");
		}
		else if (err.message.includes("not unique")) {
			message = t("messages.organisaties.alreadyExists");
		}

		toast({
			error: message,
		});
	};
};

export default useHandleSaveOrganisatieErrors;
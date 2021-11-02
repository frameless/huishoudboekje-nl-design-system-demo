import {MutationErrorHandlerFactory} from "./useMutationErrorHandler";

const SaveAfdelingErrorHandler: MutationErrorHandlerFactory = ({t, toast}) => (err) => {
	let errorMessage = err.message;

	if (err.message.includes("already exists")) {
		errorMessage = t("messages.afdelingen.alreadyExistsError");
	}

	toast({
		error: errorMessage,
	});
};

export default SaveAfdelingErrorHandler;
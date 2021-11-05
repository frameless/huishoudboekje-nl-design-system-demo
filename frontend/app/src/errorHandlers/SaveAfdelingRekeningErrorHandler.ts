import {MutationErrorHandlerFactory} from "./useMutationErrorHandler";

const SaveAfdelingRekeningErrorHandler: MutationErrorHandlerFactory = ({t, toast}) => (err) => {
	let errorMessage = err.message;

	if (err.message.includes("already exists")) {
		errorMessage = t("messages.rekeningen.alreadyExistsError");
	}

	toast({
		error: errorMessage,
	});
};

export default SaveAfdelingRekeningErrorHandler;
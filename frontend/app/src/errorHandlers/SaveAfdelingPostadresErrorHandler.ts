import {MutationErrorHandlerFactory} from "./useMutationErrorHandler";

const SaveAfdelingPostadresErrorHandler: MutationErrorHandlerFactory = ({t, toast}) => (err) => {
	let errorMessage = err.message;

	toast({
		error: errorMessage,
	});
};

export default SaveAfdelingPostadresErrorHandler;
import {MutationErrorHandlerFactory} from "./useMutationErrorHandler";

const SaveAfdelingPostadresErrorHandler: MutationErrorHandlerFactory = ({toast}) => (err) => {
	toast({
		error: err.message,
	});
};

export default SaveAfdelingPostadresErrorHandler;

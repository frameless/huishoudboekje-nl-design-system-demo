import {TFunction} from "i18next";
import {useTranslation} from "react-i18next";
import useToaster, {ToasterFunction} from "../utils/useToaster";

export type MutationErrorHandlerHook = (errorHandlerFactory: MutationErrorHandlerFactory) => MutationErrorHandler;
export type MutationErrorHandlerFactory = (options: MutationErrorHandlerHookProps) => MutationErrorHandler;
export type MutationErrorHandlerHookProps = {
	t: TFunction;
	toast: ToasterFunction
};
export type MutationErrorHandler = (err: Error) => void;

const useMutationErrorHandler: MutationErrorHandlerHook = (errorHandlerFactory: MutationErrorHandlerFactory): MutationErrorHandler => {
	const {t} = useTranslation();
	const toast = useToaster();

	return errorHandlerFactory({
		t,
		toast,
	});
};

export default useMutationErrorHandler;
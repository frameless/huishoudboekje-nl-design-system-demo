import {useToast, UseToastOptions} from "@chakra-ui/react";
import {useTranslation} from "react-i18next";

export type ToastOptions = UseToastOptions & {
	error?: string,
	success?: string,
}

export type ToasterFunction = (options: ToastOptions) => void;
export type UseToaster = () => ToasterFunction & {
	closeAll: VoidFunction
}

export const useToaster: UseToaster = () => {
	const {t} = useTranslation();
	const chakraToast = useToast();

	const toast = (options: ToastOptions) => {
		const {error, success, ...chakraToastOptions} = options;

		return chakraToast({
			position: "top",
			variant: "solid",
			isClosable: true,
			status: error ? "error" : "success",

			title: error ? t("messages.genericToastErrorTitle") : success,
			description: error,
			...chakraToastOptions,
		});
	};

	toast.closeAll = chakraToast.closeAll;

	return toast;
};

export default useToaster;
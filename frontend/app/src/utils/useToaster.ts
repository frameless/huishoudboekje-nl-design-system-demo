import {useToast, UseToastOptions} from "@chakra-ui/react";
import {useTranslation} from "react-i18next";

type ToastOptions = UseToastOptions & {
	error?: string,
	success?: string,
}

const useToaster = () => {
	const {t} = useTranslation();
	const chakraToast = useToast();

	const toast = ({error, success, ...toastProps}: ToastOptions) => {
		chakraToast({
			position: "top",
			variant: "solid",
			isClosable: true,
			status: error ? "error" : "success",

			title: error ? t("toastMessages.generic.errorTitle") : success,
			description: error,
			...toastProps,
		});
	};

	toast.closeAll = chakraToast.closeAll;

	return toast;
};

export default useToaster;
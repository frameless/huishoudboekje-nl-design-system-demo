import useToaster from "./useToaster";

const useHandleMutation = () => {
	const toast = useToaster();

	return (mutation: Promise<unknown>, successMessage: string, onReady?: (data) => void) => {
		mutation?.then((data) => {
			toast({
				success: successMessage,
			});
			onReady?.(data);
		}).catch(err => {
			console.error(err);
			toast({
				error: err.message,
			});
		});
	};
};

export default useHandleMutation;

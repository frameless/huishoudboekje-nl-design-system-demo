import useToaster from "./useToaster";

const useHandleMutation = () => {
	const toast = useToaster();

	return (mutation: Promise<any>, successMessage: string, onReady?: VoidFunction) => {
		mutation?.then(() => {
			toast({
				success: successMessage,
			});
			onReady?.();
		}).catch(err => {
			console.error(err);
			toast({
				error: err.message,
			});
		});
	};
};

export default useHandleMutation;
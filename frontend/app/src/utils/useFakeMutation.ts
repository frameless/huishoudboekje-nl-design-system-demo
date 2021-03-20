const useFakeMutation = (success: boolean = false) => (args: any) => new Promise((resolve, reject) => {
	if (!success) {
		throw new Error("Deze functie is nog niet beschikbaar.");
	}

	resolve(true);
});

export default useFakeMutation;
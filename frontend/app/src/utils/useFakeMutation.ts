const useFakeMutation = (success: boolean = false) => (args: any) => new Promise((resolve, reject) => {
	console.info("Executing fake mutation", {args});

	if (!success) {
		throw new Error("Deze functie is nog niet beschikbaar.");
	}

	setTimeout(() => {
		resolve(true);
		console.info("Finished executing fake mutation");
	}, 1000);
});

export default useFakeMutation;
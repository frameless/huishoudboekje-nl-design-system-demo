const useFakeMutation = (success = false) => (args) => new Promise((resolve, reject) => {
	console.info("Executing fake mutation", {args});

	setTimeout(() => {
		if (!success) {
			reject(new Error("Deze functie is nog niet beschikbaar."));
		}

		resolve(true);
		console.info("Finished executing fake mutation");
	}, 1000);
});

export default useFakeMutation;

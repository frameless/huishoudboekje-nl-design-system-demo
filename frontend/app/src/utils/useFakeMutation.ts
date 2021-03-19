const useFakeMutation = () => (args: any) => new Promise((resolve, reject) => {
	throw new Error("Deze functie is nog niet beschikbaar.");
});

export default useFakeMutation;
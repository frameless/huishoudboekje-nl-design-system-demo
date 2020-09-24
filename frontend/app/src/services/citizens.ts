/** Todo: mutation createCitizen() */
export const CreateCitizenMutation = async () => {
	return new Promise(resolve => {
		setTimeout(() => {
			resolve(true)
		}, 3000);
	});
}
import BurgerLoader from "./burgers";

const AfsprakenLoader = {
	findAllByBurgerId: async (burgerId: number) => {
		const burger = await BurgerLoader.findById(burgerId);
		return burger.afspraken || [];
	},
};

export default AfsprakenLoader;
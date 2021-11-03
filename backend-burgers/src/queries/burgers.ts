import BurgerLoader from "../dataloaders/burgers";
import Burger from "../models/Burger";

const burgers = (t) => {
	t.list.field("burgers", {
		type: Burger,
		resolve: (root, args, ctx) => {
			return BurgerLoader.findAll();
		},
	});
};

export default burgers;

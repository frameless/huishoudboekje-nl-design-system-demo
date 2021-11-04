import {intArg} from "nexus";
import BurgerLoader from "../dataloaders/burgers";
import Burger from "../models/Burger";

const burger = (t) => {
	t.field("burger", {
		args: {
			id: intArg(),
		},
		type: Burger,
		resolve: (root, args) => {
			return BurgerLoader.findById(args.id);
		},
	});
};

export default burger;

import {intArg} from "nexus";
import DataLoader from "../dataloaders/dataloader";
import Burger from "../models/Burger";
import {isDev} from "../utils/things";

const burger = (t) => {
	t.field("burger", {
		args: {
			id: intArg(),
		},
		type: Burger,
		resolve: (root, args) => {
			return DataLoader.getBurgerById(args.id);
		},
	});

	if(!isDev) {
		return;
	}

	/* Fields below here are only available when an envvar NODE_ENV="development". */

	t.list.field("burgers", {
		type: Burger,
		resolve: (root, args) => {
			return DataLoader.getAllBurgers();
		},
	});
};

export default burger;

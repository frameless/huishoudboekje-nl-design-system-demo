import {intArg, list} from "nexus";
import DataLoader from "../dataloaders/dataloader";
import Burger from "../models/Burger";
import {isDev} from "../utils/things";

const burger = (t) => {
	t.field("burger", {
		args: {
			bsn: intArg(),
		},
		type: Burger,
		resolve: async (root, args) => {
			return DataLoader.getBurgersByBsn(args.bsn).then(r => r.shift());
		},
	});

	if (!isDev) {
		return;
	}

	/* Fields below here are only available when an envvar NODE_ENV="development". */

	t.list.field("burgers", {
		type: "Burger",
		resolve: (root, args) => {
			return DataLoader.getAllBurgers();
		},
	});

	t.list.field("organisaties", {
		type: "Organisatie",
		args: {
			ids: list(intArg()),
		},
		resolve: (root, args) => {
			return DataLoader.getOrganisatiesById(args.ids);
		},
	});
};

export default burger;

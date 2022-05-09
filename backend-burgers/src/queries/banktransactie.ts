import {intArg, nonNull} from "nexus";
import DataLoader from "../dataloaders/dataloader";
import Banktransactie from "../models/Banktransactie";
import {isDev} from "../utils/things";

const banktransactie = (t) => {
	t.field("banktransactie", {
		args: {
			id: nonNull(intArg()),
		},
		type: Banktransactie,
		resolve: async (root, args) => {
			return DataLoader.getBanktransactiesById([args.id]).then(r => r.shift());
		},
	});

	if (!isDev) {
		return;
	}

	/* Fields below here are only available when an envvar NODE_ENV="development". */
	t.list.field("banktransacties", {
		type: Banktransactie,
		resolve: async (root, args) => {
			return await DataLoader.getAllBanktransacties();
		},
	});
};

export default banktransactie;

import {intArg, nonNull} from "nexus";
import {Context} from "../context";
import {isDev} from "../utils/things";

const banktransactie = (t) => {
	t.field("banktransactie", {
		args: {
			id: nonNull(intArg()),
		},
		type: "Banktransactie",
		resolve: async (_, args, ctx: Context) => {
			if (!args.id) {
				return null;
			}

			return await ctx.dataSources.banktransactieservice.getBanktransactieById(args.id)
		},
	});

	if (!isDev) {
		return;
	}

	/* Fields below here are only available when an envvar NODE_ENV="development". */
	// t.list.field("banktransacties", {
	// 	type: Banktransactie,
	// 	resolve: async (root, args) => {
	// 		return await DataLoader.getAllBanktransacties();
	// 	},
	// });
};

export default banktransactie;

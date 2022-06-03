import {intArg} from "nexus";
import {Context} from "../context";
import Burger from "../models/Burger";
import {isDev} from "../utils/things";

const burger = (t) => {
	t.field("burger", {
		args: {
			bsn: intArg(),
		},
		type: Burger,
		resolve: async (_, args, ctx: Context) => {
			const burgers = await ctx.dataSources.huishoudboekjeservice.getBurgersByBsns([args.bsn]);
			return burgers.shift();
		},
	});

	if (!isDev) {
		return;
	}

	/* Fields below here are only available when an envvar NODE_ENV="development". */

	t.list.field("burgers", {
		type: "Burger",
		resolve: (_, __, ctx: Context) => {
			return ctx.dataSources.huishoudboekjeservice.getAllBurgers();
		},
	});

};

export default burger;

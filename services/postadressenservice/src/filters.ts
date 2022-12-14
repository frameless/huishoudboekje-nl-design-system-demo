import {Prisma} from "@prisma/client";
import {Request} from "express";

export const addFilterByIds = (req: Request): Partial<Prisma.AddressWhereInput> => {
	const bFilterIds: string = req.body.filter_ids;
	const qFilterIds: string = req.query.filter_ids as string;

	const filterIds: string[] = [];

	// Body: { filter_ids: ["abc","def"] }
	if (bFilterIds) {
		filterIds.push(...bFilterIds);
	}
	// ?filter_ids=abc,def
	else if (qFilterIds) {
		filterIds.push(...qFilterIds.split(","));
	}

	if (filterIds.length > 0) {
		return {
			id: {
				in: filterIds.filter(x => x),
			},
		};
	}

	return {};
};

import {Alarm} from "@prisma/client";
import prisma from "../../src/client";

type Filters = {
	ids?: string[],
	isActive?: boolean
};

const getManyAlarms = async (filters: Filters): Promise<Alarm[] | unknown> => {
	return await prisma.alarm.findMany({
		where: {
			// Filter by ids
			...filters.ids && {id: {in: filters.ids}},

			// Filter by isActive
			...filters.isActive !== undefined && {isActive: filters.isActive},
		},
	});
};

export default getManyAlarms;

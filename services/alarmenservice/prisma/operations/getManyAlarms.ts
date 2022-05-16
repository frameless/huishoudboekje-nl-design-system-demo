import {Alarm} from "@prisma/client";
import prisma from "../../src/client";

const getManyAlarms = async (ids: string[] = []): Promise<Alarm[] | unknown> => {
	return await prisma.alarm.findMany({
		where: {
			...ids.length > 0 && {
				id: {
					in: ids,
				},
			},
		},
	});
};

export default getManyAlarms;
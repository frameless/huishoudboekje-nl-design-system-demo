import {Alarm, Prisma} from "@prisma/client";
import prisma from "../../src/client";

const getManyAlarms = async (filters: Prisma.AlarmWhereInput): Promise<Alarm[] | unknown> => {
	return await prisma.alarm.findMany({
		where: filters,
	});
};

export default getManyAlarms;

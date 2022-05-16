import prisma from "../../src/client";
import {NotFoundError} from "../../src/errorHandlers";

const getOneAlarm = async (id: string) => {
	const data = await prisma.alarm.findUnique({
		where: {id},
	});

	if (!data) {
		throw new NotFoundError();
	}

	return data;
};

export default getOneAlarm;
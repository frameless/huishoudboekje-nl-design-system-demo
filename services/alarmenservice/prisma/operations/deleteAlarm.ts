import {Prisma} from "@prisma/client";
import prisma from "../../src/client";

const deleteAlarm = async (id: string) => {
	try {
		return await prisma.alarm.delete({
			where: {id},
		});
	}
	catch (err) {
		if (err instanceof Prisma.PrismaClientKnownRequestError) {
			if (err.code === "P2025") {
				// Ignore the fact that the resource doesn't exist. In this case, it's ok, cause it should be deleted anyway.
				return;
			}
		}

		throw err;
	}
};

export default deleteAlarm;
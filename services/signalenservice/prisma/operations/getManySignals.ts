import {Prisma, Signal} from "@prisma/client";
import prisma from "../../src/client";

const getManySignals = async (filters: Prisma.SignalWhereInput): Promise<Signal[] | unknown> => {
	return await prisma.signal.findMany({
		where: filters,
	});
};

export default getManySignals;

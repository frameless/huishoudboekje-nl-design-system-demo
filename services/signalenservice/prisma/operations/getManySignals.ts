import {Signal} from "@prisma/client";
import prisma from "../../src/client";

const getManySignals = async (ids: string[] = []): Promise<Signal[] | unknown> => {
	return await prisma.signal.findMany({
		where: {
			...ids.length > 0 && {
				id: {
					in: ids,
				},
			},
		},
	});
};

export default getManySignals;
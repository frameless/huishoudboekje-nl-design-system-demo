import {Address} from "@prisma/client";
import prisma from "../../src/client";

const getManyAddresses = async (ids: string[] = []): Promise<Address[] | unknown> => {
	return await prisma.address.findMany({
		where: {
			...ids.length > 0 && {
				id: {
					in: ids,
				},
			},
		},
	});
};

export default getManyAddresses;
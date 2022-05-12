import {Address} from "@prisma/client";
import prisma from "../../src/client";

const getManyAddresses = async (ids: string[] = []): Promise<Address[] | unknown> => {
	try {
		return await prisma.address.findMany({
			where: {
				...ids.length > 0 && {
					id: {
						in: ids,
					},
				},
			},
		});
	}
	catch (err) {
		throw err;
	}
};

export default getManyAddresses;
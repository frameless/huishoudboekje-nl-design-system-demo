import prisma from "../../src/client";
import {NotFoundError} from "../../src/errorHandlers";

const getOneAddress = async (id: string) => {
	const data = await prisma.address.findUnique({
		where: {id},
	});

	if (!data) {
		throw new NotFoundError();
	}

	return data;
};

export default getOneAddress;
import prisma from "../../src/client";
import {NotFoundError} from "../../src/errorHandlers";

const getOneSignal = async (id: string) => {
	const data = await prisma.signal.findUnique({
		where: {id},
	});

	if (!data) {
		throw new NotFoundError();
	}

	return data;
};

export default getOneSignal;
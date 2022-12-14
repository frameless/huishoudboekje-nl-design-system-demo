import {Address, Prisma} from "@prisma/client";
import prisma from "../../src/client";

const getManyAddresses = async (filters: Prisma.AddressWhereInput): Promise<Address[] | unknown> => {
	return await prisma.address.findMany({
		where: filters,
	});
};

export default getManyAddresses;

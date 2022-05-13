import {PrismaClient} from "@prisma/client";
import {DeepMockProxy, mockDeep, mockReset} from "jest-mock-extended";

import prisma from "../src/client";

const mockedPrisma = jest.mock("../src/client", () => ({
	__esModule: true,
	default: () => {
		console.log("MOCKED");
		return {
			address: {
				findUnique: jest.fn(),
			}
		};
	},
}));

export const prismaMock = mockedPrisma as unknown as DeepMockProxy<PrismaClient>;

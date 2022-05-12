import {Address} from "@prisma/client";
import {config} from "dotenv";
import getOneAddress from "../prisma/operations/getOneAddress";
import {prismaMock} from "../mockedClient";

config();

const address: Address = {
	id: "3fc9baf4-f85b-4643-b525-bb901ab825dc",
	street: "Foostreet",
	houseNumber: "1",
	postalCode: "9999ZZ",
	locality: "Sloothuizen",
	timeCreated: new Date(),
};

describe("Address CRUD", () => {

	describe("Given the address exists", () => {
		it("should return the address", async () => {
			prismaMock.address.findUnique.mockResolvedValue(address);

			await expect(getOneAddress(address.id)).resolves.toEqual(address);
		});
	});

});
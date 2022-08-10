import {render, screen} from "@testing-library/react";
import React from "react";
import BurgerListView from "../components/Burgers/BurgerListView";
import {Burger} from "../generated/graphql";
import {formatBurgerName} from "../utils/things";

jest.mock("react-i18next", () => require("./utils/mock-hooks").reactI18NextMock());
jest.mock("react-router-dom", () => require("./utils/mock-hooks").reactRouterDomMock());
jest.mock("@chakra-ui/media-query", () => ({
	...jest.requireActual("@chakra-ui/media-query"),
	useBreakpointValue: () => {
		return false;
	},
}));

it("renders an empty list", () => {
	const {container} = render(<BurgerListView burgers={[]} />);

	const element = container.querySelector("div");
	expect(element).not.toBe(null);
	expect(element!.children.length).toEqual(0);
});

it("renders an empty list with addButton", () => {
	const {container} = render(<BurgerListView burgers={[]} showAddButton={true} />);

	const element = container.querySelector("div");
	expect(element).not.toBe(null);
	expect(element!.children.length).toEqual(1);
	expect(element!.innerHTML).toContain("actions.add");
});

it("renders a list of two burgers", () => {
	const burgers: Burger[] = [
		{
			achternaam: "de Jager",
			email: "fien.dejager@example.com",
			geboortedatum: "1955-10-26",
			huisnummer: "51",
			plaatsnaam: "Sloothuizen",
			postcode: "9999ZZ",
			straatnaam: "Anna Walderstraat",
			telefoonnummer: "0654887612",
			voorletters: "F.S.",
			voornamen: "Fien Sandra",
		},
		{
			achternaam: "Winkel",
			email: "hj.winkel@example.com",
			geboortedatum: "1959-11-30",
			huisnummer: "12",
			plaatsnaam: "Sloothuizen",
			postcode: "9999ZZ",
			straatnaam: "Carpenterweg",
			telefoonnummer: "0688551495",
			voorletters: "H.J.",
			voornamen: "Henk Jan",
		},
	];

	render(<BurgerListView burgers={burgers} showAddButton={true} />);

	const button = screen.queryByRole("button");
	expect(button).not.toBeNull();
	expect(button).toContainHTML("actions.add");

	const burger1Card = screen.queryByText(formatBurgerName(burgers[0], true));
	expect(burger1Card).not.toBeNull();

	const burger2Card = screen.queryByText(formatBurgerName(burgers[0], true));
	expect(burger2Card).not.toBeNull();
});

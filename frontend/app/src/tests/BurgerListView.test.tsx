import {act, screen} from "@testing-library/react";
import React from "react";
import {render, unmountComponentAtNode} from "react-dom";
import BurgerListView from "../components/Burgers/BurgerListView";
import {Burger} from "../generated/graphql";
import {formatBurgerName} from "../utils/things";

jest.mock("react-i18next", () => require("./utils/mock-hooks").reactI18NextMock());
jest.mock("react-router-dom", () => require("./utils/mock-hooks").reactRouterDomMock());

let container: HTMLDivElement | null = null;

beforeAll(() => {
	window.matchMedia = (query) => ({
		matches: false,
		media: query,
		onchange: null,
		addListener: jest.fn(),
		removeListener: jest.fn(),
		addEventListener: jest.fn(),
		removeEventListener: jest.fn(),
		dispatchEvent: jest.fn(),
	})
})

beforeEach(() => {
	container = document.createElement("div");
	document.body.appendChild(container);
});

afterEach(() => {
	unmountComponentAtNode(container!);
	container!.remove();
	container = null;
});

it("renders an empty list", () => {
	act(() => {
		render(<BurgerListView burgers={[]} />, container);
	});

	const element = container!.querySelector("div");
	expect(element).not.toBe(null);
	expect(element!.children.length).toEqual(0);
});

it("renders an empty list with addButton", () => {
	act(() => {
		render(<BurgerListView burgers={[]} showAddButton={true} />, container);
	});

	const element = container!.querySelector("div");
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
		}
	];

	act(() => {
		render(<BurgerListView burgers={burgers} showAddButton={true} />, container);
	});

	const button = screen.queryByRole("button");
	expect(button).not.toBeNull();
	expect(button).toContainHTML("actions.add");

	const burger1Card = screen.queryByText(formatBurgerName(burgers[0], true));
	expect(burger1Card).not.toBeNull();

	const burger2Card = screen.queryByText(formatBurgerName(burgers[0], true));
	expect(burger2Card).not.toBeNull();
});
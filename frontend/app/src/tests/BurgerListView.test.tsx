import React from 'react';
import BurgerListView from "../components/Burgers/BurgerListView";
import { Burger } from "../generated/graphql";
import { formatBurgerName } from "../utils/things";
import { render, screen } from '@testing-library/react';

jest.mock("react-i18next", () => require("./utils/mock-hooks").reactI18NextMock());
jest.mock("react-router-dom", () => require("./utils/mock-hooks").reactRouterDomMock());
jest.mock('@chakra-ui/react', () => ({
	...jest.requireActual('@chakra-ui/react'),
	Grid: (children, ...rest) => { 
		if (children.children[1].length === 0) return null; 
		
		return (<div className="mainGrid" title="mainGrid" {...rest}>{children.children[1]}</div>);
	},
	useBreakpointValue: () => [true, null, null, false],
}));
jest.mock('../../src/components/shared/DashedAddButton', () => ({
	...jest.requireActual('../../src/components/shared/DashedAddButton'),
	DashedAddButton: ({ onClick, ...rest }) => (<button onClick={() => jest.fn()} {...rest}></button>),
}));
jest.mock('react', () => ({
	...jest.requireActual('react'),
	useContext: () => 'mocked useContext',
}));
jest.mock("react-router-dom", () => require("./utils/mock-hooks").reactRouterDomMock());

describe("BurgerListView", () => {
	it("renders an empty list", () => {
		const {container} = render(<BurgerListView burgers={[]} />);
		const mainGrids = container.getElementsByClassName("mainGrid").length;
		
		expect(mainGrids).toEqual(0);
		
		const element = screen.findAllByTitle("mainGrid");

		expect(element).not.toBe(null);
	});

	it("renders an empty list with addButton", () => {
		const {container} = render(<BurgerListView burgers={[]} showAddButton={true} />);

		const element = screen.findAllByTitle("mainGrid").then((result) => {
			console.log('aaaa');
			expect(result).not.toBe(null);
			expect(result.length).toEqual(1);
			// expect(result.toString).toContain("actions.add");
		});
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

		// const {container} = render(<BurgerListView burgers={burgers} showAddButton={true} />);

		const element = screen.findAllByTitle("mainGrid").then((result) => {
			const button = screen.findByRole("button");

			expect(button).not.toBeNull();
			expect(button).toContain("global.actions.add");

			const burger1Card = screen.getAllByText(formatBurgerName(burgers[0], true));
			expect(burger1Card).not.toBeNull();

			const burger2Card = screen.getAllByText(formatBurgerName(burgers[1], true));
			expect(burger2Card).not.toBeNull();
		});
	});
});

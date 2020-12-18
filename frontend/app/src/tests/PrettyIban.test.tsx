import {act, screen} from "@testing-library/react";
import React from "react";
import {render, unmountComponentAtNode} from "react-dom";
import {formatIBAN} from "../utils/things";
import PrettyIban from "../components/Layouts/PrettyIban";

jest.mock("react-i18next", () => require("./utils/mock-hooks").reactI18NextMock());

let container: HTMLDivElement | null = null;

beforeEach(() => {
	container = document.createElement("div");
	document.body.appendChild(container);
});

afterEach(() => {
	unmountComponentAtNode(container!);
	container!.remove();
	container = null;
});

it("shows formatted IBAN", () => {
	const unformattedIBAN = "NL00BANK0123456789";
	const formattedIBAN = formatIBAN(unformattedIBAN);

	act(() => {
		render(<PrettyIban iban={unformattedIBAN} />, container);
	});

	const html = container!.innerHTML;
	expect(html).not.toBeNull();
	expect(html).toContain(formattedIBAN!);
});

it("shows 'unknown' when no iban is passed", () => {
	const unformattedIBAN = undefined;

	act(() => {
		render(<PrettyIban iban={unformattedIBAN} />, container);
	});

	const html = container!.innerHTML;
	expect(html).not.toBeNull();
	expect(html).toContain("unknown");
});
import {render} from "@testing-library/react";
import React from "react";
import PrettyIban from "../components/shared/PrettyIban";
import {formatIBAN} from "../utils/things";

jest.mock("react-i18next", () => require("./utils/mock-hooks").reactI18NextMock());

it("shows formatted IBAN", () => {
	const unformattedIBAN = "NL00BANK0123456789";
	const formattedIBAN = formatIBAN(unformattedIBAN);

	const {container} = render(<PrettyIban iban={unformattedIBAN} />);

	const html = container.innerHTML;
	expect(html).not.toBeNull();
	expect(html).toContain(formattedIBAN!);
});

it("shows 'unknown' when no iban is passed", () => {
	const unformattedIBAN = undefined;

	const {container} = render(<PrettyIban iban={unformattedIBAN} fallback={"unknown"} />);

	const html = container.innerHTML;
	expect(html).not.toBeNull();
	expect(html).toContain("unknown");
});
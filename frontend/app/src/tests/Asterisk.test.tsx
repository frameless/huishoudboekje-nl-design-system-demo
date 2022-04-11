import {act} from "@testing-library/react";
import React from "react";
import {render, unmountComponentAtNode} from "react-dom";
import Asterisk from "../components/shared/Asterisk";

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

it("Show asterisk", () => {
	act(() => {
		render(<Asterisk />, container);
	});

	const html = container!.innerHTML;
	expect(html).not.toBeNull();
});
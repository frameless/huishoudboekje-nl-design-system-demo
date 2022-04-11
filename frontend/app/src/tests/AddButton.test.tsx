import {act} from "@testing-library/react";
import React from "react";
import {render, unmountComponentAtNode} from "react-dom";
import AddButton from "../components/shared/AddButton";

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

it("show button", () => {
	const children = "Toevoegen";

	act(() => {
		render(<AddButton>{children}</AddButton>, container);
	});

	const html = container!.innerHTML;
	expect(html).not.toBeNull();
});

it("show button without children", () => {

	act(() => {
		render(<AddButton />, container);
	});

	const html = container!.innerHTML;
	expect(html).not.toBeNull();
});
import {act} from "@testing-library/react";
import React from "react";
import {render, unmountComponentAtNode} from "react-dom";
import DashedAddButton from "../components/shared/DashedAddButton";

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

it("show dashed button", () => {
    const children = "Toevoegen";

    act(() => {
        render(<DashedAddButton>{children}</DashedAddButton>, container);
    });

    const html = container!.innerHTML;
    expect(html).not.toBeNull();
});

it("show dashed button without children", () => {

    act(() => {
        render(<DashedAddButton />, container);
    });

    const html = container!.innerHTML;
    expect(html).not.toBeNull();
});
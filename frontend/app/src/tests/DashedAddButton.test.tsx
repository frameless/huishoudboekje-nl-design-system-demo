import {act, fireEvent, getByText} from "@testing-library/react";
import React from "react";
import pretty from "pretty";
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

describe("Dashed button", () => {
    it("Show dashed button with label", () => {
        const label = "Toevoegen";

        act(() => {
            render(<DashedAddButton>{label}</DashedAddButton>, container);
        });

        expect(pretty(container?.innerHTML)).toMatchSnapshot();
        expect(container!.textContent).toBe(label)
    });

    it("Show dashed button with default label", () => {

        act(() => {
            render(<DashedAddButton />, container);
        });

        expect(pretty(container?.innerHTML)).toMatchSnapshot();
        expect(container!.textContent).toBe("global.actions.add")
    });

    it("Check the onClick", () => {
        const onClick = jest.fn();
        const label = "Opslaan";

        act(() => {
            render(<DashedAddButton onClick={onClick}>{label}</DashedAddButton>, container);
        });

        expect(pretty(container?.innerHTML)).toMatchSnapshot();
        expect(container?.textContent).toBe("Opslaan");

        const clickEvent = new Event("click", {
            bubbles: true,
            cancelable: true,
        });

        const element = getByText(container!, "Opslaan");

        fireEvent(element, clickEvent);
        expect(onClick).toHaveBeenCalledTimes(1);

        fireEvent(element, clickEvent);
        expect(onClick).toHaveBeenCalledTimes(2);

    })
})

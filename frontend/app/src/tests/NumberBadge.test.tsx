import {act} from "@testing-library/react";
import React from "react";
import {render, unmountComponentAtNode} from "react-dom";
import NumberBadge from "../components/shared/NumberBadge";
import pretty from "pretty";

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

describe("Numberbadge", () => {

    it("shows NumberBage count", () => {

        act(() => {
            render(<NumberBadge count={9} />, container);
        });

        expect(pretty(container?.innerHTML)).toMatchSnapshot();
    });

    it("shows NumberBage count more than 99", () => {

        act(() => {
            render(<NumberBadge count={9999} />, container);
        });

        expect(pretty(container?.innerHTML)).toMatchSnapshot();
    });
})


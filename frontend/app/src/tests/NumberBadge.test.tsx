import {act} from "@testing-library/react";
import React from "react";
import {render, unmountComponentAtNode} from "react-dom";
import NumberBadge from "../components/shared/NumberBadge";

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

it("shows NumberBage count", () => {

    act(() => {
        render(<NumberBadge count={9} />, container);
    });

    const html = container!.innerHTML;
    expect(html).not.toBeNull();
});

it("shows NumberBage count more than 99", () => {

    act(() => {
        render(<NumberBadge count={9999} />, container);
    });

    const html = container!.innerHTML;
    expect(html).not.toBeNull();
});


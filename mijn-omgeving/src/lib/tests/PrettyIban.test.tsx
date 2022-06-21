import {act} from "@testing-library/react";
import React from "react";
import {render, unmountComponentAtNode} from "react-dom";
import PrettyIban from "../components/PrettyIban";
import {formatIBAN} from "../../../../frontend/app/src/utils/things";

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

describe("Pretty Iban", () => {

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
})

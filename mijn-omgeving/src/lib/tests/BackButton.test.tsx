import {act} from "@testing-library/react";
import React from "react";
import {render, unmountComponentAtNode} from "react-dom";
import BackButton from "../components/BackButton";

jest.mock("react-router-dom", () => require("./utils/mock-hooks").reactRouterDomMock());

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

describe("Back Button", () => {

    it('should show the button without extras', function () {
        act(() => {
            render(<BackButton />, container);
        });

        expect(container!.textContent).toBe("Terug")
    });

    it('should show the button without custom label', function () {
        act(() => {
            render(<BackButton label={"Huishoudboekje"} />, container);
        });

        expect(container!.textContent).toBe("Huishoudboekje")
    });

    // it('should fire an onClick event', function () {
    //     const fn = jest.fn();
    //     act(() => {
    //         render(<BackButton to={"/huishoudboekje"} />, container);
    //     });
    //
    //     expect()
    // });
})